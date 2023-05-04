// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

// Custom Error
error Raffle__NotEnoughETHEntered();

contract Raffle is VRFConsumerBaseV2 {
    /* State variables */
    uint private immutable i_entranceFee; // this is also storage variable
    address payable[] private s_players; // in storage as we are going to add/sub alot all the time
    // payable bcz we need to pay the winners

    /** Events */
    event RaffleEntered(address indexed player); // name is reversed wrt function

    /**
     * @param vrfCoordinator is address of VRFCoordinator contract , that does random no. verification
     */
    constructor(address vrfCoordinator, uint entranceFee) VRFConsumerBaseV2(vrfCoordinator) {
        i_entranceFee = entranceFee;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        s_players.push(payable(msg.sender)); //payable bcz msg.sender is not payable by default

        emit RaffleEntered(msg.sender);
        //It is good to start wirting some tests in early stages so we make sure that the code is working as we want to
    }

    /** this is where we will use chainlink keepers and Chainlink VRF */
    // external function are cheaper than public
    function requestRandomWinner() external {
        /* request random no.
         * Once we get it, do something with it
         * chainlink VRF is 2 tx process(intentional)
         * having random no in 2 tx is much betrer than having it in 1
         * bcz peolpe could brute force try "simluate calling tx" to see what they can manupulate the outcome
         */
    }

    /** this function is from VRFConsumerBaseV2.sol */
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {}

    /** We Want others to see what is entrance fee */
    function getEntranceFee() public view returns (uint) {
        return i_entranceFee;
    }

    /* Getting Players with index for users */
    function getPlayers(uint index) public view returns (address) {
        return s_players[index];
    }
}
