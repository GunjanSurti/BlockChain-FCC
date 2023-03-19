// yarn hardhat node
// yarn hardhat run scripts/withdraw.js --network localhost
const { ethers, getNamedAccounts } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log(`Got contract FundMe at ${fundMe.address}`)
    const transactionresponse = await fundMe.fund({
        value: ethers.utils.parseEther("4"),
    })
    await transactionresponse.wait(1)
    const beforeBalance = await fundMe.provider.getBalance(fundMe.address)
    console.log(beforeBalance.toString()) // 4000000000000000000
    console.log("Withdrawing from contract...")
    const transactionResponse = await fundMe.withDraw()
    await transactionResponse.wait()
    console.log("Got it back!")
    const balance = await fundMe.provider.getBalance(fundMe.address)
    console.log(balance.toString()) // 0
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
