const { ethers } = require("hardhat")

// const {network} = require("hardhat")
const networkConfig = {
    5: {
        name: "goerli",
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D", //docs
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        //docs https://docs.chain.link/vrf/v2/subscription/supported-networks || "150 gwei Key Hash"
        subscriptionId: "0",
        callbackGasLimit: "500000", // random but high
        interval: "30",
    },
    31337: {
        name: "hardhat",
        entranceFee: ethers.utils.parseEther("0.01"),
        // mock dosent care what we are usig so pasted above
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        callbackGasLimit: "500000",
        interval: "30",
    },
}

// we only want to deploy when we are on dev chain
const developmentChains = ["hardhat", "localhost"]
module.exports = {
    networkConfig,
    developmentChains,
}
