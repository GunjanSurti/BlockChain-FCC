import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
//@ts-ignore
import { ethers } from "hardhat"
import { MIN_DELAY } from "../helper-hardhat-config"

const deployTimeLock: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  //@ts-ignore
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  log("Deploying TimeLock..........")

  const timeLock = await deploy("TimeLock", {
    from: deployer,
    args: [MIN_DELAY, [], [], deployer],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
}

module.exports = deployTimeLock
