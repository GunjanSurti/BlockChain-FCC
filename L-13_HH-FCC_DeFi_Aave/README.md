# Steps

- yarn add --dev hardhat
- yarn hardhat
- use previous hardhatConfig
- yarn add ethers@5.7.2

## Programmatically

- Deposit Collateral : ETH / WETH
- Borrow another asset: DAI (stable coin pegged with 1 dollar)
- Repay the DAI

## Mainnet Forking

- It will simulate same state as mainnet but it will run locally development network
- It is alternate to deploying mocks so we can test directly
- We are running local hardhat node thats pretending to be mainnet node bu updating hardhatConfig

- Pros
  - Quick, easy and resembels what is on mainnet

- Cons
  - We need an API, some contracts are complex to work with

- left at 19:47:38
