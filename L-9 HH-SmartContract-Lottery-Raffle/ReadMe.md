
# Steps

- yarn add --dev hardhat
- yarn hardhat (create empty hardhat.config.js)
- Generally we install dependencies one by one as we need but here we install all.
- yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv
- (in order for these dependencies to actually work we have to add in hardhat.config.js).
- yarn add ethers@5.7.2
- yarn add --dev @chainlink/contracts
- yarn global add hardhat-shorthand

now runnig hh = yarn hardhat

#

## Add this in hardhat.config

```javascript
require("@nomiclabs/hardhat-waffle")
require("hardhat-deploy")
require("@nomiclabs/hardhat-etherscan")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()
```

## Prettier

- add .prettierrc file in root and copy paste

```js
 {
    "tabWidth": 4,
    "useTabs": false,
    "semi": false,
    "singleQuote": false,
    "printWidth": 500
}
```

# Raffle.sol Setup

- contracts >> Raffle.sol

> We will use Chainlink VRF for verifiable Random number and Chainlink Keepers to automatically trigger to pick winner when the time interval is Up!!
