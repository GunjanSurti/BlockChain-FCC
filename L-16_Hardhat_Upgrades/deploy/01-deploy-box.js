const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    console.log("----------------")

    // what we are doing is deploying Box contract behind OpenZeppelinTransparentProxy that is owned by BoxProxyAdmin contract
    // Box contract is remaned as Box_Implementation by hardhat 
    // Box_Proxy is (OpenZeppelinTransparentProxy)transparent proxy here, Box is Implementation contract 
    // import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

    const box = await deploy("Box", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: network.config.blockConfirmations,
        // we are telling hardhat to deploy Box contract behind a proxy contract

        proxy: {
            proxyContract: "OpenZeppelinTransparentProxy",
            // instead of having admin address, we are having admin contract for proxy contract
            // this is considered best practice
            viaAdminContract: {
                // telling which is admin contract
                name: "BoxProxyAdmin",
                artifact: "BoxProxyAdmin",
            },
        },
    })
}
