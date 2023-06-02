const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")

// running unit test on developmentChains only
// making sure that we are on testnet not "hardhat", "localhost"
!developmentChains.includes(network.name)
    ? describe().skip
    : describe("Raffle Unit Test", function () {
          let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer, interval
          const chainId = network.config.chainId
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"]) // deploying everything (means tags)
              raffle = await ethers.getContract("Raffle", deployer /** connect with deployer */)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
              interval = await raffle.getInterval()
          })
          describe("constructor", function () {
              it("initializes the raffle correctly", async function () {
                  // ideally we make our test, have 1 assert per "it"
                  const raffleState = await raffle.getRaffleState() // when we call here our raffleState will be BigNumber
                  assert.equal(raffleState.toString(), "0")
                  assert.equal(interval.toString(), networkConfig[chainId]["interval"])
                  // we can write more test for others but lets move on
              })
          })
          describe("enterRaffle", () => {
              it("reverts when you dont pay enough", async () => {
                  await expect(raffle.enterRaffle()).to.be.revertedWith("Raffle__NotEnoughETHEntered")
                  // Raffle__NotEnoughETHEntered should be same revert in contract
              })
              it("records the players when they enter the Raffle", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const playerFromContract = await raffle.getPlayer(0) // the person who entered raffle
                  assert.equal(playerFromContract, deployer)
              })
              it("emits event on enter", async () => {
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.emit(raffle /**contract */, "RaffleEntered" /**event name */)
              })
              it("doesn't allow entrance when raffle is calculating", async () => {
                  /** we need to close the raffle
                   * this happens when peformUpkeep is executing
                   * for that we need to do checkUpkeep
                   * so we pretend that we are chainlink keeper network and call checkUpkeep, peformUpkeep functions...
                   * we need checkUpkeep to return true so we can peformUpkeep
                   */
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  // increasing block time
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", []) // mining one extra block
                  // await network.provider.request({ method: "evm_mine", params: [] }) same as above
                  // we pretend to be chainlink keeper
                  await raffle.performUpkeep([]) /** empty calldata */
                  // here our raffle is in calculating state as per our code
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.revertedWith("Raffle__NotOpen")
              })
          })
          describe("checkUpkeep", () => {
              it("returns false if people haven't send ETH", async () => {
                  // we will make everything in checkUpkeep "true" when no one has entered
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  // await raffle.checkUpkeep([]) this will peform transaction but we dont want to do that
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]) // without doing transaction
                  assert(!upkeepNeeded)
              })
              it("returns false if raffle isn't open", async () => {
                  // we will do everything but not open the raffle
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  await raffle.performUpkeep("0x") // as we want to set state to calculating
                  const raffleState = await raffle.getRaffleState()
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([])
                  assert.equal(raffleState.toString(), "1")
                  assert.equal(upkeepNeeded, false)
              })
              it("returns false if enough time hasen't passed", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() - 1])
                  await network.provider.send("evm_mine", [])
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x")
                  assert(!upkeepNeeded)
              })
              it("returns true if eniugh time has passed, has players, has eth, is open", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x")
                  assert(upkeepNeeded)
              })
          })
      })
