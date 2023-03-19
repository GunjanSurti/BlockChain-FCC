// staging tests can be done in testnet means it is Last Stop before deployment to mainnet
// these are the test which we can use on actual "testnet"
//  this is the test we basically run after we deployed the code , so we know the the code is working approximately as we wanted to
// we  will assume this is on a test net
const { assert } = require("chai")
const { getNamedAccounts, ethers, network } = require("hardhat")

const { developmentChains } = require("../../helper-hardhat-config")
// we only wnnna run this "describe" only when we are on testnet
// ternary operation => condition ? true : false (one statement if else )
// this means if we are on developmentChains then skip this
developmentChains.includes(network.name)
    ? describe.skip // this will skip describe....
    : describe("FundMe", async () => {
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async () => {
              deployer = await getNamedAccounts().deployer
              fundMe = await ethers.getContract("FundMe", deployer)
              // will we deploy this and not do any "fixtures"(for deploy scripts) as we are assuming
              // also we dont need MockV3Aggerator as assuming it will be on testnet
          })
          it("allows people to fund an withdraw", async () => {
              await fundMe.fund({ value: sendValue })
              await fundMe.withDraw()
              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
/**
 *
 *
 *
 *
 *
 */
/*const { assert } = require("chai")
const { network, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", function () {
          let deployer
          let fundMe
          const sendValue = ethers.utils.parseEther("0.1")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              const fundTxResponse = await fundMe.fund({ value: sendValue })
              await fundTxResponse.wait(1)
              const withdrawTxResponse = await fundMe.withdraw()
              await withdrawTxResponse.wait(1)

              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              console.log(
                  endingFundMeBalance.toString() +
                      " should equal 0, running assert equal..."
              )
              assert.equal(endingFundMeBalance.toString(), "0")
          })
      })
*/
