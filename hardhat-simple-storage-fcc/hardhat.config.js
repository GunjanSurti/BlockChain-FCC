require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("./tasks/block-number")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("@nomiclabs/hardhat-waffle")

/** @type import('hardhat/config').HardhatUserConfig */
const GOERLI_RPC_URL =
    process.env.GOERLI_RPC_URL || "https://eth-goerli/example"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key"
const COINMARKETCAP_API = process.env.COINMARKETCAP_API || "key"

//    "||" means if process.env... does not exits then hardhat will take other one

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        goerli: { url: GOERLI_RPC_URL, accounts: [PRIVATE_KEY], chainId: 5 },
        localhost: { url: "http://127.0.0.1:8545/", chainId: 31337 },
        // we dont need to add accounts here as hardhat will take itself
    },
    solidity: "0.8.17",
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    // gas report shows how much it will cost to deploy on different chains
    gasReporter: {
        enabled: true, //if dont want to run then do "false"
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD", //we can get the cost of each function in USD or ethereum
        // in order to get currency we need api key
        coinmarketcap: COINMARKETCAP_API,
        //If we want to deploy to other blockchain eg Ethereum(defalut),binance(BNB),polygon(MATIC),heco(HT), avalanche(AVAX),Moonriver(MOVR)
        // token: "BNB",
    },
}

// yarn add hardhat-gas-reporter --dev
// we have to run test-deploy.js => yarn hardhat test
