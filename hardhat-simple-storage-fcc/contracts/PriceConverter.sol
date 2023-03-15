// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// This will be library for FuneMe.sol
//As this is library public -> internal

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    // getPrice() is an instance where we interract outside of our project so we need "ABI" and "Address"

    // Address can be taken from ChainLink Data fees docs ->Data feed -> Contract Address -> Ethereum data feed -> goerli TestNet(ETH/USD)
    // Address -> 	0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
    // The address should be of same testnet as of wallet
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        // AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e).version()
        //AggregatorV3Interface -> is an interface mentioned above
        // and providing an address means combination of these two will give AggregatorV3Interface "contract"

        // AggregatorV3Interface priceFeed = AggregatorV3Interface(
        //     0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        // );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        // "int256" as prices can be negative
        //price of ETH in terms of USD
        //and msg.value has 18 decimal places
        return uint256(price * 1e10); // 1^10  here we have "type casted" from int to uint
        //1^10 because 1ETH = 1*10^18 and price is in '10^8' form
    }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        // this will get latest price of 1 ethereum (means 1 ETH = ? USD)
        uint256 ethPrice = getPrice(priceFeed);
        // ethAmountInUsd means the msg.value we send (in Ether) is converted in USD
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        // here we divide 1e18 because ethPrice and ethAmount has 1e18 so we have to divide to make only one time 1e18
        return ethAmountInUsd;
        // always multiply before divide
        //here we want to make msg.value in trms of usd

        // ethPrice and ethAmount both have 18 decimal places so we divide one time
        // getConversionRate => value * 1e18 so we multiply 1e18 to minimumUsd
    }
}

// This code is from github by Patrick Collins

// pragma solidity ^0.8.7;

// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// library PriceConverter {
//   function getPrice(AggregatorV3Interface priceFeed)
//     internal
//     view
//     returns (uint256)
//   {
//     (, int256 answer, , , ) = priceFeed.latestRoundData();
//     // ETH/USD rate in 18 digit
//     return uint256(answer * 10000000000);
//   }

//   // 1000000000
//   // call it get fiatConversionRate, since it assumes something about decimals
//   // It wouldn't work for every aggregator
//   function getConversionRate(uint256 ethAmount, AggregatorV3Interface priceFeed)
//     internal
//     view
//     returns (uint256)
//   {
//     uint256 ethPrice = getPrice(priceFeed);
//     uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1000000000000000000;
//     // the actual ETH/USD conversation rate, after adjusting the extra 0s.
//     return ethAmountInUsd;
//   }
// }
