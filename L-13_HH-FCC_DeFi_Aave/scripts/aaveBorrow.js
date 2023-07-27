const { getNamedAccounts } = require("hardhat")
const { getWeth } = require("./getWETH")

async function main() {
    await getWeth()
    const { deployer } = require(getNamedAccounts)
    // Interacting with Aave protocol
    // abi, address  (v2 aave docs) Lending pool Lending 
    // lending pool address will be obtained by lendingPoolAddressProvider  
    // lendingPoolAddressProvider : 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5 mainnet
    //  this above   contract will tells us where the lendingPool accress is 
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

// protocol of aave treats everything as ERC20 token but everything is not ERC20 token like sepolia
// but it is much easier to send and interract if it is ERC20
