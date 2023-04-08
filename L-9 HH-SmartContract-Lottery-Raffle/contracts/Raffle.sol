// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

// Custom Error
error Raffle__NotEnoughETHEntered();

contract Raffle {
    /* State variables */
    uint private immutable i_entranceFee; // this is also storage variable
    address payable[] private s_players; // in storage as we are going to add/sub alot all the time
    // payable bcz we need to pay the winners

    /** Events */
    event RaffleEntered(address indexed player); // name is reversed wrt function

    constructor(uint entranceFee) {
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

    // function pickRandomWinner(){}

    /** We Want others to see what is entrance fee */
    function getEntranceFee() public view returns (uint) {
        return i_entranceFee;
    }

    /* Getting Players with index for users */
    function getPlayers(uint index) public view returns (address) {
        return s_players[index];
    }
}

