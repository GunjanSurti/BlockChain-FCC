// this is code that will do all setup
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
// @ts-ignore
import { ethers } from "hardhat"
import { ADDRESS_ZERO } from "../helper-hardhat-config"

const setupContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  //@ts-ignore
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()

  const timelock = await ethers.getContract("TimeLock", deployer)
  // acctah to deployer so when we call function it will be called by deployer
  const governor = await ethers.getContract("GovernorContract", deployer)
  log("Setting Up Roles.......")
  // setting roles so only governor can send things to timeLock
  // right now our deployer account is timeLock admin which is bad
  // we dont want any centralized entity to have power over timelock
  const proposerRole = await timelock.PROPOSER_ROLE()
  const executorRole = await timelock.EXECUTOR_ROLE()
  const adminRole = await timelock.TIMELOCK_ADMIN_ROLE()

  // only governor can propose anything, governor can actyally do anything
  const proposerTx = await timelock.grantRole(proposerRole, governor.address)
  await proposerTx.wait(1)
  // giving executor role to nobody which means everybody
  const executorTx = await timelock.grantRole(executorRole, ADDRESS_ZERO)
  await executorTx.wait(1)
  // right now deployer owns so we will revoke its rights
  const revokeTx = await timelock.revokeRole(adminRole, deployer)
  await revokeTx.wait(1)
  console.log("Roles Done!!!");
  

  // now after this runs
  // anything timeLock wants to do has to go through Governance
  // and nobody owns TimeLockController
}
module.exports = setupContracts
