// manual way
// hardhat deploy comes with api to upgrade box contract
// to run this we have to use hardhat node
// yarn hardhat run scripts/upgrade-box.js --network localhost
const { ethers } = require("hardhat")

async function main() {
    const boxProxyAdmin = await ethers.getContract("BoxProxyAdmin")
    const transparentProxy = await ethers.getContract("Box_Proxy")
    // Box_Proxy => Box is implementation and Proxy is added by hardhat

    const proxyBoxV1 = await ethers.getContractAt("Box", transparentProxy.getAddress())
    const versionV1 = await proxyBoxV1.version()
    console.log(versionV1)

    const boxV2 = await ethers.getContract("BoxV2")
    const upgradeTx = await boxProxyAdmin.upgrade(transparentProxy.getAddress(), boxV2.getAddress())
    // this "upgradeTx" call upgrade on boxProxyAdmin which will call transparentProxy and it will change implementation contract
    await upgradeTx.wait(1)

    const proxyBoxV2 = await ethers.getContractAt(
        /**Abi*/ "BoxV2",
        /**address*/ transparentProxy.getAddress(),
    ) // this way ethers know that we have to call at transparentProxy address using BoxV2 ABI
    const versionV2 = await proxyBoxV2.version()
    console.log(versionV2)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
// https://github.com/wighawag/template-ethereum-contracts
