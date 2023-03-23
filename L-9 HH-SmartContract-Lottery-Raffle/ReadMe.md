# Steps

 -yarn add --dev hardhat
 -yarn hardhat (create empty hardhat.config.js)
 -Generally we install dependencies one by one as we need but here we install all.
 -yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv
 -(in order for these dependencies to actually work we have to add in hardhat.config.js).
 -add this in hardhat.config
 require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()