// Time Lock and Governor Contract is kind of same but Time Lock is "OWNER"

// we want to wait for a new vote to be "executed"
// bcz lets say there is new proposol that says "every one has to pay 5 governance token"
// so these governanceContract give time to "get out" is user dont like governance update
// so once the proposal passes it will wait for some time

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    // minDelay is how long you have to wait before executing
    // proposers is the list of addresses that can propose
    // executors is the list of addresses that can execute
    //`admin`: optional account to be granted admin role; disable with zero address  /**
    /**
     * IMPORTANT: The optional admin can aid with initial configuration of roles after deployment
     * without being subject to delay, but this role should be subsequently renounced in favor of
     * administration through timelocked proposals. Previous versions of this contract would assign
     * this admin to the deployer automatically and should be renounced as well.
     */
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
}
