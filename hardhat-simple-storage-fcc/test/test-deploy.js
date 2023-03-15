// Mocha framework(js)
// rekt.news/leaderboard/ provides all info about attack/ potential exploits in deFi world
// writing tests is our first line of defence
//hardhat testing works with Mocha framework which is javaScript based framework
// you can write "test" in main code itself also

//describe(string,function) is a key word
// it can be nested also

// describe("SimpleStorge", () => {})

// before()/after() runs once before/after "all" the tests in a "describe"
// beforeEach()/afterEach() is run before/after "each" test in "describe"

const { ethers } = require("hardhat")
const { expect, assert } = require("chai")
describe("SimpleStorge", function () {
    // before running each tests we need to deploy our samrt contract first (in beforeEach()) so we have a brand new contract to interract with

    // let simpleStorageFactory
    // let simpleStorage

    let simpleStorage, simpleStorageFactory
    // we have globally assigned these variables so every tests( "it()" ) can use
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })
    //we will write "tests" in "it"
    it("Should start with favourite number of 0", async function () {
        const currentValue = await simpleStorage.retrieve()
        // here currentValue is a BigNumber so we have to convert to string
        const expectedValue = "0"
        // we can use "assert" or "expect" by installing "chai" pacakage

        // assert.equal(currentValue.toString(), expectedValue)
        // this will compare currentValue and expectedValue
        expect(currentValue.toString()).to.equal(expectedValue)
    })
    it("Should update when we call store ", async function () {
        const expectedValue = "14"
        const transactionResopnse = await simpleStorage.store(expectedValue)
        await transactionResopnse.wait(1)

        const currentValue = await simpleStorage.retrieve()
        assert.equal(currentValue.toString(), expectedValue)
    })
    // it("Should add person", async function () {
    //     const expectedPerson = "Gunjan"
    //     const expectedNumber = "13"

    //     const updatePerson = await simpleStorage.addPerson(
    //         expectedPerson,
    //         expectedNumber
    //     )
    //     await updatePerson.wait(1)
    //     console.log(`number is :${People}`)

    // const addedPerson =
    // const addedNumber = "13"

    // assert.equal(addedPerson, expectedPerson)
    // assert.equal(expectedNumber, addedNumber)
    // })
})
// we can test only one "test" by writing it().only
// another way is "yarn hardhat test --grep (by typing unique keyword without "")
