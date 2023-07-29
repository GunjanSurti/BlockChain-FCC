const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
// const { verify } = require("../utils/verify")

// here we are working with chainlink so we need mocks
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
}
