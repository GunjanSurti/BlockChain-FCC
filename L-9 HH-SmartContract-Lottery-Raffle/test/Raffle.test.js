const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

// making sure that we are on testnet not "hardhat", "localhost"
!developmentChains.includes(network.name)
    ? describe().skip
    : describe("Raffle Unit Test", async function () {
          let raffle
      })
