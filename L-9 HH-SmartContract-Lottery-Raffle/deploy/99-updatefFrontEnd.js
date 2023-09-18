const { frontEndContractsFile, frontEndAbiFile } = require("../helper-hardhat-config")
const fs = require("fs")
const { network } = require("hardhat")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}
const chainId = network.config.chainId.toString()

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(frontEndAbiFile, raffle.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    // getting contractAddresses
    const raffle = await ethers.getContract("Raffle")

    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))

    if (chainId in contractAddresses) {
        // if chainId is already there...
        if (!contractAddresses[chainId].includes(raffle.address)) {
            // this will when there is no address but has chainId
            contractAddresses[chainId].push(raffle.address)
        }
        console.log("if")
    } else {
        contractAddresses[chainId] = [raffle.address]
        // this will run when there is no chainId and will add New id and address
        console.log("else")
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]
