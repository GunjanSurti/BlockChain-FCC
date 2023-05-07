const { network } = require("hardhat")
const {developmentChains} = require("../helper-hardhat-config")

const BASE_FEE = ethers.utils.parseEther("0.25") // 0.25 is the "premium". It costs 0.25 Link per request
// we dont have to do this for priceFeed As that is sponsered
const GAS_PRICE_LINK = 1e9 // calculated value based on gas price of chain // Link per gas
// the price of request changes based on price of gas
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    // const chainId = network.config.chainId
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(network.name)) {
        log("Local Network Detected! Deploying Mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        })
    }
    log("Mocks Depolyed")
    log("---------------------------------------------------------------------------------")
}

module.exports.tags = ["all", "mocks"]
