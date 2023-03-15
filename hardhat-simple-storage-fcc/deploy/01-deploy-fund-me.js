/**
 *
 *
 *
 */
const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config") // not .js
const { verify } = require("../utils/verify")
require("dotenv").config()
// getNamedAccounts, deployments => hre
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    console.log(chainId)
    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    // above has address of AggregatorV3Interface no matter on which chain we are on
    let ethUsdPriceFeedAddress
    // if (chainId == 31337) also
    if (developmentChains.includes(network.name)) {
        // we can get most recent deployments using "get(/**name of the contract */)"
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    // this ensure we can deploy anywhere localdevelpoment chain , testnet ,  mainnet chain whithout changing any of our solidity
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe" /*contract name */, {
        from: deployer,
        args: args, //we will pass arguments to constructor (put price feed address)
        log: true, // this is custom log so we dont need to console.log stuff this whole time
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        //verify
        await verify(fundMe.address, args)
    }
    log(
        "----------------------------------------------------------------------------------"
    )
}

module.exports.tags = ["all", "fundMe"]
/**
 *
 *
 *
 *
 *
 */
/*****************This code is from github by Patrick Collins********************************** */

// const { network } = require("hardhat")
// const { networkConfig, developmentChains } = require("../helper-hardhat-config")
// const { verify } = require("../utils/verify")
// require("dotenv").config()

// module.exports = async ({ getNamedAccounts, deployments }) => {
//     const { deploy, log } = deployments
//     const { deployer } = await getNamedAccounts()
//     const chainId = network.config.chainId

//     let ethUsdPriceFeedAddress
//     if (chainId == 31337) {
//         const ethUsdAggregator = await deployments.get("MockV3Aggregator")
//         ethUsdPriceFeedAddress = ethUsdAggregator.address
//     } else {
//         ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
//     }
//     log("----------------------------------------------------")
//     log("Deploying FundMe and waiting for confirmations...")
//     const fundMe = await deploy("FundMe", {
//         from: deployer,
//         args: [ethUsdPriceFeedAddress],
//         log: true,
//         // we need to wait if on a live network so we can verify properly
//         waitConfirmations: network.config.blockConfirmations || 1,
//     })
//     log(`FundMe deployed at ${fundMe.address}`)

//     if (
//         !developmentChains.includes(network.name) &&
//         process.env.ETHERSCAN_API_KEY
//     ) {
//         await verify(fundMe.address, [ethUsdPriceFeedAddress])
//     }
// }

// module.exports.tags = ["all", "fundme"]
