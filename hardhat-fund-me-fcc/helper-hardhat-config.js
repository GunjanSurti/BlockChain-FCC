/**
 * This file is for knowing if you are in network  used "this" address etc...
 * */
const networkConfig = {
    31337: {
        name: "localhost",
    },
    // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
}
// 'number' shows chainId
const developmentChains = ["hardhat", "localhost"]
const DECIMALS = "8" //which shows that how many decimals we need to put in real price of eth in usd
const INITIAL_PRICE = "200000000000" // 2000 * 10^8 (8 is decimals)
module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_PRICE,
}

// when we do yarn hardhat deploy --network goerli => the "name" goerli will indicate which to choose
