const { getNamedAccounts, ethers } = require("hardhat")

const Amount = ethers.utils.parseEther("0.02")
async function getWeth() {
    const { deployer } = await getNamedAccounts()
    // call "deposit" function on weth contract
    // abi (sepolia contract), contract address of weth (main net address, 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    const iWeth = await ethers.getContractAt("IWeth", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", deployer)
    const tx = await iWeth.deposit({ value: Amount })
    await tx.wait(1)
    const wethBalance = await iWeth.balanceOf(deployer)
    console.log(`Got ${wethBalance.toString()} ETH  `)
}

module.exports = { getWeth }
