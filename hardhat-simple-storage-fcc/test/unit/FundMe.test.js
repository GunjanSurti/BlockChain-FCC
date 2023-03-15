// unit test are done locally , minimal piece of code
// done by using local hardhat or forked hardhat
// before any testing write good deploy scripts
//
// this is the larger scope will be for entire FundMe contract
const { assert, expect } = require("chai") // expect is from waffle, chai over written by waffle
const { deployments, ethers, getNamedAccounts } = require("hardhat") // for deployments.fixture
describe("FundMe", function () {
    // before we start any test let's deploy our fundMe contract using hardhat-deploy
    // scince we are using hardhat-deploy, our fundMe contract will come with Mocks and everything
    let fundMe
    let deployer // this is name
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1") // 1 ETH, hard coded value
    /*
     *  Deploy our Contract
     */
    beforeEach(async function () {
        // deploy our FundMe contract
        //using hardhat-deploy
        // const { deployer } = await getNamedAccounts()
        deployer /* assign */ = (await getNamedAccounts()).deployer // this is object
        /**
         * another way to get different accounts from hardhat config
         * const accounts = await ethers.getSigners() 
         * const accountZero = accounts[0]
         * // ethers.getSigners() will return whatever is in accounts section in networks in hardhat.config.js (get accounts in network(local,test, main))
          //if in hardhat it will get 10 fake acc
         */
        await deployments.fixture("all")
        /* "all" is tag we wrote in deploy scripts
         * this line allows us to run WHOLE deploy folder with as many tags as we want
         *this will run deploy scripts having "all" tag
         */
        fundMe = await ethers.getContract("FundMe", deployer)
        /** hardhat-deploy wraps "ethers" with functions
         * getContract() function will get most recent deployed contract we tell it
         * getContract("FundMe") this will give us most recently deployed "FundMe" contract
         * "deployer" => whenever we call a function with  "fundMe" it will be from that "deployer" account (for transaction)
         */
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    /**
     * Constructor
     */

    describe("constructor" /**name of function */, async function () {
        it("sets the aggerator address correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    /*
     * Inside Fund Function
     */

    describe("fund", async function () {
        /**
         *  require statement
         */
        it("Fails if you don't send enougn ETH", async () => {
            // except is from waffle
            // it is used bcz we want to do transactions to be "reverted" and "to fail"
            // we can expect things o fail
            await expect(fundMe.fund()).to.be.reverted
            // await expect(fundMe.fund()).to.be.revertedWith(
            //     "You need to spend more ETH!"
            // ) this didn't work
            //expect(fundMe.fund()).to.be.reverted() same but dont have custom error
        })
        /**
         * addressToAmountFunded Updated
         */
        it("Updates the addressToAmountFunded data structure", async () => {
            await fundMe.fund({ value: sendValue }) // this will definitly gonna more than MINIMUM_USD
            // we called fund function with 1 ETH
            const response = await fundMe.addressToAmountFunded(deployer) // addressToAmountFunded(deployer) this will give the amount ,address has funded
            assert.equal(
                response.toString() /**BigNumber value*/,
                sendValue.toString()
            )
            // here we checked that the amount funded is ACTUALLY  funded or not
        })
        /**
         * Add funder in array
         */
        it("Adds funder to array of funders", async () => {
            await fundMe.fund({ value: sendValue })
            // here we did transaction so deployer will automatically be added in array as per code, bcz require statement is there
            const response = await fundMe.funders(0) // we took first funder from funders array
            assert.equal(response, deployer)
        })
    })
    /**
     *  Withdraw Function , it has OnlyOwner Modifier
     */
    describe("withDraw", async () => {
        // before we with draw , we need to fund the contract
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })
        it.only("withdraw ETH from a single founder", async () => {})
    })
})

/**
 *
 *
 *
 *
 *
 *
 *
 */

/*const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let fundMe
          let mockV3Aggregator
          let deployer
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async () => {
              // const accounts = await ethers.getSigners()
              // deployer = accounts[0]
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("constructor", function () {
              it("sets the aggregator addresses correctly", async () => {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })

          describe("fund", function () {
              // https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
              // could also do assert.fail
              it("Fails if you don't send enough ETH", async () => {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })
              // we could be even more precise here by making sure exactly $50 works
              // but this is good enough for now
              it("Updates the amount funded data structure", async () => {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("Adds funder to array of funders", async () => {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getFunder(0)
                  assert.equal(response, deployer)
              })
          })
          describe("withdraw", function () {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue })
              })
              it("withdraws ETH from a single funder", async () => {
                  // Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait()
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Assert
                  // Maybe clean up to understand the testing
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })
              // this test is overloaded. Ideally we'd split it into multiple tests
              // but for simplicity we left it as one
              it("is allows us to withdraw with multiple funders", async () => {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  for (i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  // Let's comapre gas costs :)
                  // const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait()
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const withdrawGasCost = gasUsed.mul(effectiveGasPrice)
                  console.log(`GasCost: ${withdrawGasCost}`)
                  console.log(`GasUsed: ${gasUsed}`)
                  console.log(`GasPrice: ${effectiveGasPrice}`)
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  // Assert
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(withdrawGasCost).toString()
                  )
                  // Make a getter for storage variables
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("Only allows the owner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const fundMeConnectedContract = await fundMe.connect(
                      accounts[1]
                  )
                  await expect(
                      fundMeConnectedContract.withdraw()
                  ).to.be.revertedWith("FundMe__NotOwner")
              })
          })
      })
*/
