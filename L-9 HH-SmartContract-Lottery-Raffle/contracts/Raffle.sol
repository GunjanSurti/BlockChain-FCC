// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

/** get the interface so we can interact with contract  */
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";

// Custom Error
error Raffle__NotEnoughETHEntered();
error Raffle__TransferFailed();

contract Raffle is VRFConsumerBaseV2, AutomationCompatibleInterface {
    /* State variables */
    uint private immutable i_entranceFee; // this is also storage variable
    address payable[] private s_players; // in storage as we are going to add/sub alot all the time
    // payable bcz we need to pay the winners
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3; // caps and underscore for constant
    uint32 private constant NUM_WORDS = 1;

    /** Lottery Variables */
    address private s_recentWinner;
    /** Events */
    event RaffleEntered(address indexed player); // name is reversed wrt function
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    /**
     * @param vrfCoordinatorV2 is address of contract that does random no verification
     * @param entranceFee for Raffle
     * we passed VRFConsumerBaseV2's constructor too
     * here we have passed two constructor 1. for our contract and 2. VRFConsumerBaseV2 contract
     * first we pass vrfCoordinator(address) in our contract and then in VRFConsumerBaseV2's constructor
     * @param gasLane : this ensures that the gas price does not go skyrocket and revert when price is too high
     */
    constructor(address vrfCoordinatorV2, uint entranceFee, bytes32 gasLane, uint64 subscriptionId, uint32 callbackGasLimit) VRFConsumerBaseV2(vrfCoordinatorV2) {
        /** this is vrf coodrinator contract (vrfCoordinator interface , vrfCoordinator address)  */
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_entranceFee = entranceFee;
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        s_players.push(payable(msg.sender)); //payable bcz msg.sender is not payable by default

        emit RaffleEntered(msg.sender);
        //It is good to start wirting some tests in early stages so we make sure that the code is working as we want to
    }

    /**
     * @dev This is the function that chainlink Keepers nodes call
     * they look for "upkeepNeeded" to return true.
     * the following should be true in order to return true:
     * 1. Our time interval should have passed
     * 2. The lottery should have 1 player and have some ETH
     * 3. Our subscription should be funded with LINK (same as VRF but different  subscription needed)
     * 4. Lottery should be in an "open" state
     * 
     * checkData is in bytes which lets us do anything we want and  even call other function
     * @return upkeepNeeded
     * @return performData
     */

    function checkUpkeep(bytes calldata /*checkData*/) external override returns (bool upkeepNeeded, bytes memory /*performData*/) {}

    /** this is where we will use chainlink keepers and Chainlink VRF */
    // external function are cheaper than public
    // Assumes the subscription is funded sufficiently
    function requestRandomWinner() external {
        /* request random no.
         * Once we get it, do something with it
         * chainlink VRF is 2 tx process(intentional)
         * having random no in 2 tx is much betrer than having it in 1
         * bcz peolpe could brute force try "simluate calling tx" to see what they can manupulate the outcome
         */
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS // no. of rando no we want
        );
        /** this requestrandomwords returns uinque request id that defines who is requesting and other detail
         * so we save in requestId
         */

        emit RequestedRaffleWinner(requestId);
        // we will get "array" of randomNumber
    }

    /** this function is from VRFConsumerBaseV2.sol
     * which is called by Oracal
     */
    // we dont want to use requestId so we commented out
    function fulfillRandomWords(uint256 /*requestId*/, uint256[] memory randomWords) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        // [0] as we are getting only one randomWord
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        (bool success, ) = recentWinner.call{value: address(this).balance}(""); //("") we are passing no data
        if (!success) {
            revert Raffle__TransferFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    /** View / Pure function */
    /** We Want others to see what is entrance fee */
    function getEntranceFee() public view returns (uint) {
        return i_entranceFee;
    }

    /* Getting Players with index for users */
    function getPlayers(uint index) public view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }
}
