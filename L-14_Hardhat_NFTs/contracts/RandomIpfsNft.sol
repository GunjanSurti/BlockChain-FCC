// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "hardhat/console.sol";

// contract RandomIpfsNft is VRFConsumerBaseV2, ConfirmedOwner {
contract RandomIpfsNft is ERC721URIStorage, VRFConsumerBaseV2, Ownable {
    // when we mint Nft, we will trigger Chainlink VRF call to get us a random number
    // users have to pay to mint Nft
    // the owner of contract can withdraw the ETH

    // Chainlink VRF Variables

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    // NFT Variables
    uint256 private immutable i_mintFee;
    uint256 private s_tokenCounter;
    uint256 internal constant MAX_CHANCE_VALUE = 100;
    string[] internal s_dogTokenUris;
    bool private s_initialized;

    // Two steps so no one can manipulate it
    // VRFConsumerBaseV2 => fulfillRandomWords
    // VRFCoordinatorV2Interface => requestRandomWords
    //The Chainlink VRF Coordinator is a contract that is deployed to a blockchain that will check the randomness of each random number returned from a random node

    // constructor(address vrfCoordinatorV2) VRFConsumerBaseV2(vrfCoordinatorV2) ConfirmedOwner(msg.sender) {
    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint256 mintFee,
        uint32 callbackGasLimit
    )
        // string[3] memory dogTokenUris
        VRFConsumerBaseV2(vrfCoordinatorV2)
        ERC721("Random IPFS NFT", "RIN")
    {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_mintFee = mintFee;
        i_callbackGasLimit = callbackGasLimit;
        // _initializeContract(dogTokenUris);
        s_tokenCounter = 0;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal virtual override {}
}
