const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")
const imagesLocation = "images/randomNfts"
require("dotenv").config()

// const { HardhatRuntimeEnvironment } = require("hardhat/types")
// const { DeployFunction } = require("hardhat-deploy/types")
// const { parseEther } = require("ethers")

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Cuteness",
            value: 100,
        },
    ],
}
const FUND_AMOUNT = "1000000000000000000000"

let tokenUris = [
    "ipfs://QmV3fMbGBmfEsK64sTqDTdSUR6aQaQWVttFTD4gH6W3bnm",
    "ipfs://QmZvNXhfwaZQPVkQBbCkUztdUWsZTeGdJhRqM1N8U6dExL",
    "ipfs://QmX7w7kPk3LsANQR8Fro8UXPiaFCSjKWGEwvWRy4GFX5Hh",
]

// here we are working with chainlink so we need mocks
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }

    let vrfCoordinatorV2Address, subscriptionId

    const gasLane = networkConfig[chainId].gasLane
    const mintFee = networkConfig[chainId].mintFee
    const callbackGasLimit = networkConfig[chainId].callbackGasLimit

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")

        vrfCoordinatorV2Address = await vrfCoordinatorV2Mock.getAddress()
        // creating Subscription
        // const tx = await vrfCoordinatorV2Mock.createSubscription()
        // const txReceipt = await tx.wait(1)
        // subscriptionId = txReceipt.events[0].args.subId
        // await vrfCoordinatorV2Mock.fundSubscruption(subscriptionId,FUND_AMOUNT)
        /**
         * here the createSubscription() is returning different response so i am going to skip deploymanet in hardhat
         */

        subscriptionId = 255
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }
    console.log("----------------------------------------------")
    
    const args = [
        vrfCoordinatorV2Address,
        subscriptionId,
        gasLane,
        mintFee,
        callbackGasLimit,
        tokenUris,
    ]
    // console.log(args)
    const randomIpfsNft = await deploy("RandomIpfsNft", {
        from: deployer,
        args: args,
        log: true,
        autoMine: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(randomIpfsNft.address, args)
    }
    // await storeImages(imagesLocation)
}

async function handleTokenUris() {
    tokenUris = []

    // store image in ipfs
    // store metadata in ipfs
    // taking response and giving it name imageUploadResopnses
    const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
    console.log(imageUploadResponses, files)
    for (imageUploadResponseIndex in imageUploadResponses) {
        console.log("ekjsdkjsd")
        // create metadata
        // upload metadata
        let tokenUriMetadata = { ...metadataTemplate } // unpack, sticking it to tokenUriMetadata
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "")
        tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name}  pup!`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name}...`)
        // storing JSON to pinata / Ipfs
        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
        console.log("Token URIs uploaded! They are:")
        console.log(tokenUris)
    }

    return tokenUris
}
/**
 * for Image we can use
 * 1. IPFS
 * 2. Pinata https://www.pinata.cloud/
 * 3. NFT.Storage https://nft.storage/ (best way and it is persistant)
 */

module.exports.tags = ["all", "randomipfs", "main"]
