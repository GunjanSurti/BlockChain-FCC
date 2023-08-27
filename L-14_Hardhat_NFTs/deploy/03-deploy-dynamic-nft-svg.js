const { network } = require("hardhat")
// const { developmentChains } = require("../helper-hardhat-config")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

const { verify } = require("../utils/verify")
const fs = require("fs")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log(deployer)
    const chainId = network.config.chainId
    let ethUsdPriceFeedAddress

    if (chainId == 31337) {
        // Find ETH/USD price feed
        const EthUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = EthUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed
    }

    const lowSVG = fs.readFileSync("./images/dynamicNfts/frown.svg", { encoding: "utf8" })
    const highSVG = fs.readFileSync("./images/dynamicNfts/happy.svg", { encoding: "utf8" })
    console.log(highSVG);

    arguments = [ethUsdPriceFeedAddress, lowSVG, highSVG]
    const dynamicSvgNft = await deploy("DynamicSvgNft", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(dynamicSvgNft.address, arguments)
    }
}
//0x694AA1769357215DE4FAC081bf1f309aDC325306 ETH/USD priceFeed address
module.exports.tags = ["all", "dynamicsvg", "main"]
