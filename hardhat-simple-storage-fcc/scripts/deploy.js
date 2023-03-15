// imports
const { ethers, run, network } = require("hardhat")
// network will get us network configuration information
// "run" allows us to run any hardhat task
// const { ethers } = require("ethers") but hardhat has in buith ethers
//async
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying Contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed() //deployed() not deploy()
    console.log(`Contract addrress : ${simpleStorage.address}`)
    // we have deployed without private key and RPC URL because of Hardhat Network but we need private key and rpc_url for other networks
    // we dont want to verify this contract when we are working on hardhat
    // console.log(network.config)
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deployTransaction.wait(6)
        // we will wait 6 blocks to be mined or for confirmation as blockExplorer cannot verify instantly deployed contracts
        await verify(simpleStorage.address, [])
    }
    const currentValue = await simpleStorage.retrieve()
    console.log(`Current Value is: ${currentValue}`)

    //Upate the current value
    const transactionResponse = await simpleStorage.store(14)
    await transactionResponse.wait(1) //we are waiting 1 block for transaction to go through
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated value is: ${updatedValue}`)
}
// --> To verify our contract automatically/Programaticaly

// As our simple storage contract does not have constructor the args will be empty
//This auto verification works on block explorer like ether scan only not on Ethplorer
// Ether Scan has api which allow us to interract with Ether Scan (Api Documentation)
// Hardhat also has plugins to interact with etherScan (see Documentation) "Building Plugins"
// yarn add --dev @nomiclabs/hardhat-etherscan
async function verify(contractAddress, args) {
    console.log("Verifying address...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verifided")
        } else {
            console.log(e)
        }
    }
}
// verify is name of command in hardhat

//main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
