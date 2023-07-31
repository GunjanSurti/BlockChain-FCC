const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages } = require("../utils/uploadToPinata")
const imagesLocation = "images/randomNfts"
// const { HardhatRuntimeEnvironment } = require("hardhat/types")
// const { DeployFunction } = require("hardhat-deploy/types")
// const { parseEther } = require("ethers")

// here we are working with chainlink so we need mocks
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let tokenUris = ["", "", ""]
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
        const tx = await vrfCoordinatorV2Mock.createSubscription()
        console.log(tx);
        const txReceipt = await tx.wait(1)
        // subscriptionId = txReceipt.events[0].args.subId
        // console.log(txReceipt)

        subscriptionId = 255
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }
    console.log("----------------------------------------------")
    // constructor(
    //     address vrfCoordinatorV2,
    //     uint64 subscriptionId,
    //     bytes32 gasLane, // keyHash
    //     uint256 mintFee,
    //     uint32 callbackGasLimit,
    //     string[3] memory dogTokenUris
    // )
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
    // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    //     log("Verifying...")
    //     await verify(randomIpfsNft.address, arguments)
    // }
    await storeImages(imagesLocation)
}

async function handleTokenUris() {
    tokenUris = []
    // store image in ipfs
    // store metadata in ipfs

    return tokenUris
}
/**
 * for Image we can use
 * 1. IPFS
 * 2. Pinata https://www.pinata.cloud/
 * 3. NFT.Storage https://nft.storage/ (best way and it is persistant)
 */

module.exports.tags = ["all", "randomipfs", "main"]
