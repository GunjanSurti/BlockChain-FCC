// to fund our contract
// yarn hardhat node
// yarn hardhat run scripts/fund.js --network localhost
const { ethers, getNamedAccounts } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log(`Got contract FundMe at ${fundMe.address}`)
    console.log("Funding contract...")
    const beforeBalance = await fundMe.provider.getBalance(fundMe.address)
    console.log(beforeBalance.toString()) //200000000000000000

    const transactionResponse = await fundMe.fund({
        value: ethers.utils.parseEther("243"),
    })
    await transactionResponse.wait()
    console.log("Funded!")
    const balance = await fundMe.provider.getBalance(fundMe.address)
    console.log(balance.toString()) //243200000000000000000
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
