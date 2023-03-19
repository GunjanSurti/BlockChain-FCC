// SPDX-License-Identifier: MIT
//Get funds from user
//withdraw funds
//set a minimum funding value in USD

//Always multiple then divide

pragma solidity ^0.8.7;

import "./PriceConverter.sol";

error FundMe__NotOwner();

/**
 * @title A contract for crowd funding
 * @author Gunjan Surti
 * @notice This contract is to demo a sample funding contract
 * @dev This implements price feeds as our library
 */
// you can automatically generate documentation file with natspac above method
// if we download solc we can run "solc --userdoc --devdoc 'filename.sol'"
contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 1e18;
    //miminumUsd is in terms of USD and msg.value is in terms of ETHEREUM

    // address[] public s_funders;
    address[] private s_funders; // private bcz gas eff, made function at last
    //This will store all the addresses

    // mapping(address => uint256) public s_addressToAmountFunded;
    mapping(address => uint256) private s_addressToAmountFunded; // private bcz gas eff, made function at last
    //this will tell how much amount funded of whom

    // Constructor is called immeditialy whenever you deploy the contract
    // address public immutable i_owner;
    address private immutable i_owner; // private bcz gas eff, made function at last

    // AggregatorV3Interface public s_priceFeed;
    AggregatorV3Interface private s_priceFeed; // private bcz gas eff, made function at last
    modifier OnlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    /**
     * @param priceFeedAddress it will take the address of AggregatorV3Interface contract deployed by
     * chainlink for different networks
     */

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // receive() external payable {
    //     fund();
    // }

    // //fallback()
    // fallback() external payable {
    //     fund();
    // }

    function fund() public payable {
        // want to be able to set a minimum fund amount in USD
        // How do we send ETH to this contract?

        // getConversionRate(msg.value); // same as msg.value.getConversionRate()
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "Didn't send enough"
        );

        // msg.value => 18 decimals
        //msg.value => how bitcoin or ethereum is send
        s_funders.push(msg.sender);
        //msg.sender is a global variable
        s_addressToAmountFunded[msg.sender] += msg.value;
    }

    function withDraw() public payable OnlyOwner {
        // Starting index , ending Index, step amount
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            //  s_funders[funderIndex]; => we want to access funderIndex'th element of funders's element and this is gonna return address for use
            address funder = s_funders[funderIndex]; // stored address in funder object
            // funder is an address of s_funders
            s_addressToAmountFunded[funder] = 0;
            //this will set funds to 0
        }
        //reset an array
        s_funders = new address[](0);

        (
            bool callSucess, /*bytes memory dataReturned*/

        ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSucess, "Call Failed!");
        //👆 this is how we send or receive native blockchain or token
    }

    function cheapWithDraw() public payable OnlyOwner {
        /**
         * in withDraw (in for loop particular)function we are reading from storage multiple times
         * and that costs more gas
         * So Instead what we can do, is we can read the entire array into memory
         * and read from memory (memory is temporary so less/no gas) instead constantly reading
         * from storage
         * mapping can't be in memory
         *  */
        // we saved storage variable into memory variable
        address[] memory funders = s_funders;
        // we can read and write from memory variable much cheaper and update storage variable
        // once we are done
        for (uint256 funderIndex; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool callSucess, ) = i_owner.call{value: address(this).balance}("");
        require(callSucess, "Call Failed");
    }

    /**
     * the reason for writing below getter functions is bcz we want to have s_ , i_... as a
     * develpoer but we wont want people who interract with code has to deal with s_.... stuff
     * so we made easy and readable
     */

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(address funder)
        public
        view
        returns (uint256)
    {
        return s_addressToAmountFunded[funder];
    }

    // we returned AggeratorV3Interface "type" bcz we declared with same type
    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}

// This code is from github by Patrick Collins

// // 1. Pragma
// pragma solidity ^0.8.7;
// // 2. Imports
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// import "./PriceConverter.sol";

// // 3. Interfaces, Libraries, Contracts
// error FundMe__NotOwner();

// /**@title A sample Funding Contract
//  * @author Patrick Collins
//  * @notice This contract is for creating a sample funding contract
//  * @dev This implements price feeds as our library
//  */
// contract FundMe {
//     // Type Declarations
//     using PriceConverter for uint256;

//     // State variables
//     uint256 public constant MINIMUM_USD = 50 * 10**18;
//     address private immutable i_owner;
//     address[] private s_funders;
//     mapping(address => uint256) private s_addressToAmountFunded;
//     AggregatorV3Interface private s_priceFeed;

//     // Events (we have none!)

//     // Modifiers
//     modifier onlyOwner() {
//         // require(msg.sender == i_owner);
//         if (msg.sender != i_owner) revert FundMe__NotOwner();
//         _;
//     }

//     // Functions Order:
//     //// constructor
//     //// receive
//     //// fallback
//     //// external
//     //// public
//     //// internal
//     //// private
//     //// view / pure

//     constructor(address priceFeed) {
//         s_priceFeed = AggregatorV3Interface(priceFeed);
//         i_owner = msg.sender;
//     }

//     /// @notice Funds our contract based on the ETH/USD price
//     function fund() public payable {
//         require(
//             msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
//             "You need to spend more ETH!"
//         );
//         // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
//         s_addressToAmountFunded[msg.sender] += msg.value;
//         s_funders.push(msg.sender);
//     }

//     function withdraw() public onlyOwner {
//         for (
//             uint256 funderIndex = 0;
//             funderIndex < s_funders.length;
//             funderIndex++
//         ) {
//             address funder = s_funders[funderIndex];
//             s_addressToAmountFunded[funder] = 0;
//         }
//         s_funders = new address[](0);
//         // Transfer vs call vs Send
//         // payable(msg.sender).transfer(address(this).balance);
//         (bool success, ) = i_owner.call{value: address(this).balance}("");
//         require(success);
//     }

//     function cheaperWithdraw() public onlyOwner {
//         address[] memory funders = s_funders;
//         // mappings can't be in memory, sorry!
//         for (
//             uint256 funderIndex = 0;
//             funderIndex < funders.length;
//             funderIndex++
//         ) {
//             address funder = funders[funderIndex];
//             s_addressToAmountFunded[funder] = 0;
//         }
//         s_funders = new address[](0);
//         // payable(msg.sender).transfer(address(this).balance);
//         (bool success, ) = i_owner.call{value: address(this).balance}("");
//         require(success);
//     }

//     /** @notice Gets the amount that an address has funded
//      *  @param fundingAddress the address of the funder
//      *  @return the amount funded
//      */
//     function getAddressToAmountFunded(address fundingAddress)
//         public
//         view
//         returns (uint256)
//     {
//         return s_addressToAmountFunded[fundingAddress];
//     }

//     function getVersion() public view returns (uint256) {
//         return s_priceFeed.version();
//     }

//     function getFunder(uint256 index) public view returns (address) {
//         return s_funders[index];
//     }

//     function getOwner() public view returns (address) {
//         return i_owner;
//     }

//     function getPriceFeed() public view returns (AggregatorV3Interface) {
//         return s_priceFeed;
//     }
// }
