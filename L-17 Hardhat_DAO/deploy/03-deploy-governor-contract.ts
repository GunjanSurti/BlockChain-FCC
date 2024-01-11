import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { QUORUM_PERCENTAGE, VOTING_DELAY, VOTING_PERIOD } from "../helper-hardhat-config"
import { networkConfig, developmentChains } from "../helper-hardhat-config"

const deployGovernor: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  //@ts-ignore
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const governanceToken = await get("GovernanceToken")
  // get is a function which gets contracts for us
  const timeLock = await get("TimeLock")
  log("Deploying Governor..........")

  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: [governanceToken.address, timeLock.address, QUORUM_PERCENTAGE, VOTING_PERIOD, VOTING_DELAY],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
}
module.exports = deployGovernor


// the governor contract  is only one that proposes to timelock
// and anybody can execute
// the way it works is 
// the governor contract proposes something to timelock it stays for sometime and it wait that period anybody can execute it.

// GovernorContract => everybody votes and everything, once a vote passes 
// governor says to timelock can you propose this it says yes but after MinDelay
// once MinDelay happens anybody can exectue it  