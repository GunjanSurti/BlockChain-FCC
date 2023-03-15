// we are creating our own hardhat task
//we have created tasks folder

//we have to add this to hardhat.config.js
// require("./tasks/block-number")

// tasks and scripts do more of a same things
//tasks are better for plugin and scripts are better for own local development

const { task } = require("hardhat/config")
// task ("name of task" , " description")
task("block-number", "Prints the current block number by Gunjan").setAction(
    async (taskArgs, hre) => {
        const blockNumber = await hre.ethers.provider.getBlockNumber()
        console.log(`Current Block Number : ${blockNumber}`)
    }
    // hre: HardhatRuntimeEnvironment
    // hre can access a lot of pacakages which hardhat can
    //same as but difference is we are not giving a name to function
    // const blockTask = async function(taskArgs, hre) => {}
    // async function blockTask(taskArgs, hre) {}
)
// we can add parameters by ".addParam("account", "The account's address")" and we cal alos set actions by "setAction(async(taskArgs) => {...}"

module.exports = {}
