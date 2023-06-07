const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")

// running unit test on developmentChains only
// making sure that we are on testnet not "hardhat", "localhost"
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Test", function () {
          let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer, interval
          const chainId = network.config.chainId
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"]) // deploying everything (means tags, deploy sctipts)
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
                  /**
                   * Emmiting Event
                   **/
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
          describe("peformUpkeep", () => {
              it("can only run when checkUpkeep is true", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  const tx = await raffle.performUpkeep([])
                  assert(tx)
              })
              it("reverts when checkUpkeep is false", async () => {
                  await expect(raffle.performUpkeep([])).to.be.revertedWith("Raffle__UpKeepNotNeeded")
                  // our test is smart enough to know that only name is enough, we dont need the paramaters but we can be specific and
                  // get parameters by ``(backticks) and all
                  // eg `Raffle__UpKeepNotNeeded()` need more thing to work
              })
              it("updates the raffle state, emits event and call vrf coordinator", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  const txReponse = await raffle.performUpkeep([])
                  const txReceipt = await txReponse.wait(1)
                  /**geting request Id (form oracal)
                   * from vrfCoordinatorV2Mock
                   * emit RandomWordsRequested(_keyHash,requestId,preSeed,_subId,_minimumRequestConfirmations,_callbackGasLimit,_numWords,msg.sender);
                   */
                  const requestId = txReceipt.events[1].args.requestId
                  /** events[1] bcz i_vrfCoordinator.requestRandomWords(){form VRFCoordinatorV2Mock contract} will emit event first
                   *  then our event  */
                  const raffleState = await raffle.getRaffleState()
                  assert(requestId.toNumber() > 0)
                  assert(raffleState.toString() == "1")
              })
          })
          describe("fulfillRandomWords", () => {
              // we already want someone to have in raffle so...
              beforeEach(async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
              })
              // fulfillRandomWords can only be call when there is requestId (requestRandomWords has been called)
              it("can only be called after peformUpkeep", async () => {
                  // revert on request that dont exist
                  /**
                 *   function fulfillRandomWords(uint256 _requestId, address _consumer) external {
                         fulfillRandomWordsWithOverride(_requestId, _consumer, new uint256[](0));
                     }
                 */
                  await expect(vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.address)).to.be.revertedWith("nonexistent request")
                  await expect(vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address)).to.be.revertedWith("nonexistent request")
                  // we cannot check for every requestId now, but we can by fuzz testing
              })
              it("picks a winner, resets the raffle and sends money", async () => {
                  const additionalEntrace = 3 //fake people
                  const startingAccountIndex = 1 // deployer = 0
                  const accounts = await ethers.getSigners()

                  for (let i = startingAccountIndex; i < startingAccountIndex + additionalEntrace; i++) {
                      /** ethersjs
                         * contract.connect( providerOrSigner ) ⇒ Contractsource
                         Returns a new instance of the Contract, but connected to providerOrSigner.

                         By passing in a Provider, this will return a downgraded Contract which only has read-only access (i.e. constant calls).

                         By passing in a Signer. this will return a Contract which will act on behalf of that signer
                       */
                      // connecting new accounts to our raffle contract
                      // by connecting account to contract we can directly call function
                      const accConnectedRaffle = await raffle.connect(accounts[i])
                      // enter into raffle
                      await accConnectedRaffle.enterRaffle({ value: raffleEntranceFee })
                      // we have 4 people in raffle
                  }
                  const startingTimeStamp = await raffle.getLastTimeStamp()
                  // peformUpkeep (mock being chainlink keepers)
                  // fulfillRandomWords (mock being chainlink VRF)
                  // in real testnet we have to wait for fulfillRandomWords
                  await new Promise(async (resolve, reject) => {
                      // once event is emited(WinnerPicked) do some stuff
                      // this is our listner
                      raffle.once("WinnerPicked", async () => {
                          // we dont want to listen for forever so we set timeout in hardhat.config (mocha...)
                          console.log("Found the Event!!!")

                          try {
                              const recentWinner = await raffle.getRecentWinner()
                              console.log(`Recent Winner : ` + recentWinner) // from event
                              // try to find who the random winner is

                              const raffleState = await raffle.getRaffleState()
                              const endingTimeStamp = await raffle.getLastTimeStamp()
                              const numPlayers = await raffle.getNumberOfPlayers()
                              const winnerEndingBalacnce = await accounts[1].getBalance()
                              assert.equal(numPlayers.toString(), "0")
                              assert.equal(raffleState.toString(), "0")
                              assert(endingTimeStamp > startingTimeStamp)
                              assert(winnerEndingBalacnce.toString(), winnerStratingBalance.add(raffleEntranceFee).mul(additionalEntrace).add(raffleEntranceFee).toString())
                          } catch (e) {
                              reject(e)
                          }
                          resolve()
                      })

                      // first we are setting up listner(Promise) so our listener can listen for events to be emitted
                      // and then all things like peformUpkeep, fulfillRandomWords will be called here
                      // so we are writing inside of promise but outside of event listner
                      // if we write outside of promise then the code will not reach others as the promise is not resolve
                      // so below we will fire event and this listner will pick it up and resolve
                      // chainlink  keepers
                      const tx = await raffle.performUpkeep([])
                      const txReceipt = await tx.wait(1)
                      const winnerStratingBalance = await accounts[1].getBalance()
                      // chainlink VRF
                      // this function should emit WinnerPicked event
                      await vrfCoordinatorV2Mock.fulfillRandomWords(txReceipt.events[1].args.requestId, raffle.address /**consumer address is contract  */)
                  })
              })
          })
      })
