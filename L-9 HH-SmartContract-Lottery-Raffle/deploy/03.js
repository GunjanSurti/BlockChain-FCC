const { network } = require("hardhat")

module.exports = async function () {
    function hello() {
        console.log(network.config.accounts)
        // {
        //     name: 'hardhat',
        //     config: {
        //       hardfork: 'merge',
        //       blockGasLimit: 30000000,
        //       gasPrice: 'auto',
        //       chainId: 31337,
        //       throwOnTransactionFailures: true,
        //       throwOnCallFailures: true,
        //       allowUnlimitedContractSize: false,
        //       mining: { auto: true, interval: 0, mempool: [Object] },
        //       accounts: {
        //         initialIndex: 0,
        //         count: 20,
        //         path: "m/44'/60'/0'/0",
        //         passphrase: '',
        //         mnemonic: 'test test test test test test test test test test test junk',
        //         accountsBalance: '10000000000000000000000'
        //       },
        //       loggingEnabled: false,
        //       gasMultiplier: 1,
        //       minGasPrice: 0n,
        //       chains: Map(5) {
        //         1 => [Object],
        //         3 => [Object],
        //         4 => [Object],
        //         5 => [Object],
        //         42 => [Object]
        //       },
        //       blockConfirmations: 1,
        //       gas: 30000000,
        //       initialDate: '2023-09-13T07:39:03.428Z'
        //     },
        //     provider: BackwardsCompatibilityProviderAdapter {
        //       _wrapped: FixedGasProvider {
        //         _wrapped: [AutomaticSenderProvider],
        //         _wrappedProvider: [AutomaticSenderProvider],
        //         _gasLimit: 30000000
        //       },
        //       _provider: FixedGasProvider {
        //         _wrapped: [AutomaticSenderProvider],
        //         _wrappedProvider: [AutomaticSenderProvider],
        //         _gasLimit: 30000000
        //       },
        //       sendAsync: [Function: bound sendAsync],
        //       send: [Function: bound send],
        //       _sendJsonRpcRequest: [Function: bound _sendJsonRpcRequest] AsyncFunction
        //     },
        //     tags: {},
        //     deploy: [
        //       '/root/hh-fcc/BlockChain-FCC/L-9 HH-SmartContract-Lottery-Raffle/deploy'
        //     ],
        //     companionNetworks: {},
        //     live: false,
        //     saveDeployments: true,
        //     autoImpersonate: true
        //   }
    }
    hello()
}

module.exports.tags = ["03"]
