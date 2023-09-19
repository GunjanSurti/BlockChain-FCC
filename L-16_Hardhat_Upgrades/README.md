# SetUp

- yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv
- paste hardhat.config and .prettier and .prettierignore etc
- yarn add --dev @openzeppelin/hardhat-upgrades
- yarn add @openzeppelin/contracts

## Ways to deploy Proxy

1. deploy proxy manually
2. Hardhat deploy also comes proxies (we are doing this )
3. Openzeppline "upgrades" plugin (in scripts folder)
