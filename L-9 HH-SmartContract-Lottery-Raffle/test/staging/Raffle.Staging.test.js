// only on test network
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")
const { resolveConfig } = require("prettier")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Staging Test", function () {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer /** connect with deployer */)
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("fulfillRandomWords", () => {
              it("works with live chainlink Keeper and VRF, we get random winner", async () => {
                  // enter raffle
                  console.log("Setting up test...")

                  const startingTimeStamp = await raffle.getLastTimeStamp()
                  const accounts = await ethers.getSigners()
                  // setup the listner before we enter the raffle
                  // just incase the blockchain moves really fast
                  console.log("Setting up Listener...")

                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          console.log("Winner Picked, Event Fired!")
                          try {
                              // add assert here
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerEndingBalance = await accounts[0].getBalance()
                              const endingTimeStamp = await raffle.getLastTimeStamp()

                              // as there will be no players once the raffle is resets
                              await expect(raffle.getNumberOfPlayers(0)).to.be.reverted
                              assert.equal(recentWinner, accounts[0].address) // aka deployer
                              assert.equal(raffleState.toString(), "0")
                              // as they are the only one in raffle
                              assert.equal(winnerEndingBalance.toString(), winnerStratingBalance.add(raffleEntranceFee).toString())
                              assert(endingTimeStamp > startingTimeStamp)
                              resolve()
                          } catch (error) {
                              console.log(error)
                              reject(error)
                          }
                      })
                      // then entering the raffle
                      console.log("Entering Raffle...")

                      const tx = await raffle.enterRaffle({ value: raffleEntranceFee })
                      await tx.wait(1)
                      console.log("Ok, time to wait...")

                      const winnerStratingBalance = await accounts[0].getBalance()
                      console.log(winnerStratingBalance.toNumber())
                      // this code wont complete until our listner has finish listening
                  })
              })
          })
      })
/**
 * For testing in testnet (Goerli)
 *
 * 1. Get our subscription Id for VRF
 * 2. Deploy our contract using subscription Id
 * 3. register th contract with VRF & its subscription id
 * 4. register the contract with Keepers
 * 5. Run staging test
 */
