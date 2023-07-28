// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "hardhat/console.sol";

// Errors
error RandomIpfsNft__RangeOutOfBounds();

// contract RandomIpfsNft is VRFConsumerBaseV2, ConfirmedOwner {
contract RandomIpfsNft is ERC721URIStorage, VRFConsumerBaseV2, Ownable {
    // when we mint Nft, we will trigger Chainlink VRF call to get us a random number
    // users have to pay to mint Nft
    // the owner of contract can withdraw the ETH

    // user defined variables
    enum Breed {
        PUG, // 0
        SHIBA_INU, // 1
        ST_BERNARD // 2
    }

    // Chainlink VRF Variables

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    // VRF Helpers
    mapping(uint256 => address) public s_requestIdToSender;

    // NFT Variables
    uint256 private immutable i_mintFee;
    uint256 private s_tokenCounter;
    uint256 internal constant MAX_CHANCE_VALUE = 100;
    string[] internal s_dogTokenUris; // this will hold different uri for dogs
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
        uint32 callbackGasLimit,
        string[3] memory dogTokenUris
    ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("Random IPFS NFT", "RIN") {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_mintFee = mintFee;
        i_callbackGasLimit = callbackGasLimit;
        // _initializeContract(dogTokenUris);
        s_dogTokenUris = dogTokenUris;
        s_tokenCounter = 0;
    }

    // It will be in two transaction 1st-requestNft and 2nd-fulfillRandomWords

    /**@dev this function is requestRandomWords */
    function requestNft() public returns (uint256 requestId) {
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        // making sure that random words reaches to correct request Id
        s_requestIdToSender[requestId] = msg.sender;
    }

    /**@dev this function will be called by Chainlink Oracal
     * here we cant use msg.sender as it will be chainlink node as it is calling this function
     */
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal virtual override {
        // we are setting dog owner to sender not to oracle
        address dogOwner = s_requestIdToSender[requestId];
        uint256 newTokenId = s_tokenCounter;
        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE; // this will be 0-99
        Breed dogBreed = getBreedFromModdedRng(moddedRng);
        _safeMint(dogOwner, newTokenId);
        _setTokenURI(newTokenId, s_dogTokenUris[uint256(dogBreed)]); /**that breed's tokenURI */
    }

    /**0-9(1st) , 10-29(2nd), 30-100 (3rd)*/

    function getBreedFromModdedRng(uint256 moddedRng) public pure returns (Breed) {
        uint256 cumulativeSum = 0;
        uint256[3] memory chanceArray = getChanceArray();
        for (uint i = 0; i < chanceArray.length; i++) {
            if (moddedRng >= cumulativeSum && moddedRng < cumulativeSum + chanceArray[i]) {
                return Breed(i);
            }
            cumulativeSum += chanceArray[i];
        }
        // for some reason if no breed id chosen then
        revert RandomIpfsNft__RangeOutOfBounds();
    }

    // selecting different dog
    function getChanceArray() public pure returns (uint256[3] memory) {
        /** chance of happening
         * index - 0 => 10%
         *       - 1 => 20% (30-10)
         *       - 2 => 60% (100-30-10) chance of happening
         */
        return [10, 30, MAX_CHANCE_VALUE];
    }

    // _setTokenURI is not gas efficient but has most customization
    function tokenURI(uint256) public view override returns (string memory) {}
}
