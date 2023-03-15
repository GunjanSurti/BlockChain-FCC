/**
 *
 *
 *
 *
 *
 */
const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_PRICE,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    // const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        log("Local Network detected! Deploying Mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE], // we should look at constructor first in MockV3Aggerator contract in node module or github
        })
        log("Mocks Deployed")
        log(
            "----------------------------------------------------------------------------------"
        )
    }
}
module.exports.tags = ["all", "mocks"]

/*****************This code is from github by Patrick Collins********************************** */

// const { network } = require("hardhat")

// const DECIMALS = "8" which shows that how many decimals we need to put in real price of eth in usd
// const INITIAL_PRICE = "200000000000" // 2000 * 10^8 (8 is decimals)
// module.exports = async ({ getNamedAccounts, deployments }) => {
//     const { deploy, log } = deployments
//     const { deployer } = await getNamedAccounts()
//     const chainId = network.config.chainId
//     // If we are on a local development network, we need to deploy mocks!
//     if (chainId == 31337) {
//         log("Local network detected! Deploying mocks...")
//         await deploy("MockV3Aggregator", {
//             contract: "MockV3Aggregator",
//             from: deployer,
//             log: true,
//             args: [DECIMALS, INITIAL_PRICE],
//         })
//         log("Mocks Deployed!")
//         log("------------------------------------------------")
//         log(
//             "You are deploying to a local network, you'll need a local network running to interact"
//         )
//         log(
//             "Please run `npx hardhat console` to interact with the deployed smart contracts!"
//         )
//         log("------------------------------------------------")
//     }
// }
// module.exports.tags = ["all", "mocks"]
