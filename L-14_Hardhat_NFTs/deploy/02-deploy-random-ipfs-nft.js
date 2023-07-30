const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
// const { verify } = require("../utils/verify")

// here we are working with chainlink so we need mocks
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let tokenUris
    if(process.env.UPLOAD_TO_PINATA == "true"){
        tokenUris = await handleTokenUris()
    }

    let vrfCoordinatorV2Address, subscriptionId

    const gasLane = networkConfig[chainId].gasLane
    const mintFee = networkConfig[chainId].mintFee
    const callbackGasLimit = networkConfig[chainId].callbackGasLimit

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        // creating Subscription
        const tx = await vrfCoordinatorV2Mock.createSubscription()
        const txReceipt = await tx.wait(1)
        subscriptionId = txReceipt.events[0].args.subId
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
    const args = [vrfCoordinatorV2Address, subscriptionId, gasLane, mintFee,callbackGasLimit , /**tokenUris */]
}


async function handleTokenUris() {
    tokenUris =  []
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
