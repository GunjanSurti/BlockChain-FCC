import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
//@ts-ignore
import { ethers } from "hardhat"

const deployBox: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  //@ts-ignore
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  // here deployer has deployed this not timelock
  // so we want to give owner ship to governance
  const timeLock = await ethers.getContract("TimeLock")
  // box is deployment object and we want box contract
  const boxContract = await ethers.getContractAt("Box",box.address)
  
}
module.exports = deployBox