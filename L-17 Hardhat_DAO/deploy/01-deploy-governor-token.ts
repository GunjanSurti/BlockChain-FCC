import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
// import verify from "../helper-functions"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
//@ts-ignore
import { ethers } from "hardhat"

const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  //@ts-ignore
  const { network, deployments, getNamedAccounts } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  log("Deploying Governance Token...")
  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: [],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  log(`Deployed Governance Token to address ${governanceToken.address}... `)

  log(`Delegating to ${deployer}`)
  await delegate(governanceToken.address, deployer)
  log("Delegated!")
}
// now nobody has voting power let as no one has GovernanceToken
// so we are giving governancetoken to addresses
// delegate function => says you can use my vote and use however you want
const delegate = async (governanceTokenAddress: string, delegatedAccount: string) => {
  const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress)
  const tx = await governanceToken.delegate(delegatedAccount)
  tx.wait(1)
  console.log(`CheckPoints ${await governanceToken.numCheckpoints(delegatedAccount)}`)
  
}

export default deployGovernanceToken

deployGovernanceToken.tags = ["all", "governor"]
