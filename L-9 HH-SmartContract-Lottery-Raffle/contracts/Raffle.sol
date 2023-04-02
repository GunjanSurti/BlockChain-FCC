// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

// Custom Error
error Raffle__NotEnoughETHEntered();

contract Raffle {
    /* State variables */
    uint private immutable i_entranceFee; // this is also storage variable
    address payable[] private s_players; // in storage as we are going to add/sub alot all the time

    // payable bcz we need to pay the winners

    constructor(uint entranceFee) {
        i_entranceFee = entranceFee;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        s_players.push(payable(msg.sender)); //payable bcz msg.sender is not payable by default
        /**
         * Events
         * When ever update any dynamic entities like array / mapping we should emmit "events"
         * Events alloes you to "print" stuff to this log (type of special data structure)
         * Events and Logs live in special data structure that is not accessible by Smart Contracts
         * so it is cheaper
         * so we can print some stuff which are important to us w/o having to store in storage
         * variable which take much more gas
         * each one of the events are tied to smart contract or account address that emitted that
         * events in these transactions, listening for these events is helpful
         * events have two keyword 1.Indexed parameters 2.NonIndexed parameters
         * you can have Upto "3" Indexed Parameters , also known as "Topics"
         * so when we see Tpoic then it will be Indexed parameters
         * Indexed parameters are searchable
         * NonIndexed parameters are harder to search as they are abi encoded so you need abi to decode * them
         * "emit" the event, this will store data into logging Data Structure 
         * NonIndexed parameters will be data in etherScan, cost less gas 
         * we can see after we verify in etherScan 
         *   */
    }

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

/*
 * Skeleton (We know where we are going)
 *
 * Raffle COntract
 *
 * 1. Enter the lottery (paying some amt)
 * 2. Pick Random Winner (Verifiably random)
 * 3. Winner to be selected every X minites/months -> completely automated/no maintance
 *    automatically run forever
 * ChainLink oracles -> Randomness, Automated Execution (ChainLink Keepers)
 */
