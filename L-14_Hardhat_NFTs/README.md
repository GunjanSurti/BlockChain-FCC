# SetUp

- yarn add --dev hardhat
- yarn hardhat (empty and copy paste L-9)
- yarn (to install dependencies)
- yarn add --dev @openzeppelin/contracts
- yarn add --dev hardhat @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
- yarn add --dev @chainlink/contracts
- yarn add --dev @pinata/sdk
- yarn add --dev path
- yarn add ethers@5.7.2
- yarn add --dev base64-sol

## We will do 3 Contract

- 1.Basic Nft
- 2.Random IPFS Nft
  - Pros: Cheap
  - Cons: Someone needs to pin our data

- 3.Dynamic SVG Nft
  - Pros: The data is on chain
  - Cons: MUCH more Expensive

``
after uploding to pinata it is recomended to pin in ipfs too by importing
``

## DynamicSvg

- if you want to transact in remix then you should give lowSvg and highSvg in utf8 encoding only
- only then it will pass and get deployed
