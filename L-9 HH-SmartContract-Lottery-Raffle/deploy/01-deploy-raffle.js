    const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const VRF_SUB_FUND_AMT = ethers.utils.parseEther("3")
const {verify } = require("../utils/verify")
     
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let vrfCoordinatorV2Address, subscriptionId

    if (developmentChains.includes(network.name)) {
        // for hardhat (local)
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        // as we dont have subscriptionId in local network we are doing programatically
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        // console.log(transactionResponse);
        // by createSubscription() =>   emit SubscriptionCreated(s_currentSubId, msg.sender);
        const transactionReceipt = await transactionResponse.wait(1)
        subscriptionId = transactionReceipt.events[0].args.subId
        
        //Fund the subscription
        //usually we need Link Token on real network
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }
    const entranceFee = networkConfig[chainId]["entranceFee"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const keepersUpdateInterval = networkConfig[chainId]["keepersUpdateInterval"]

    const args = [vrfCoordinatorV2Address, entranceFee, gasLane, subscriptionId, callbackGasLimit, keepersUpdateInterval]
  
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        log("Verifying....")
        await verify(raffle.address,args)
    }
    log("-------------------------------------------------")
}

module.exports.tags = ["all","raffle "]