// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/proxy/Proxy.sol";

contract SmallProxy is Proxy {
    // this is storage slot to store implementation contract address which then used to delegatecall
    // This is the keccak-256 hash of "eip1967.proxy.implementation" subtracted by 1
    // bytes32(uint256(keccak256('eip1967.proxy.implementation')) - 1) = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc
    bytes32 private constant _IMPLEMENTATION_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    // openzeppelin
    // storing implementation address to storage slot  _IMPLEMENTATION_SLOT
    function setImplementation(address newImplementation) public {
        assembly {
            sstore(_IMPLEMENTATION_SLOT, newImplementation)
        }
    }

    // openzeppelin (node_modules/@openzeppelin/contracts/proxy/Proxy.sol)
    function _implementation() internal view override returns (address implementationAddress) {
        assembly {
            implementationAddress := sload(_IMPLEMENTATION_SLOT)
        }
    }

    // helper function
    // passing 14 as parameter we get  0x55241077000000000000000000000000000000000000000000000000000000000000000e
    // pass above bytes to CALLDATA in remix and transact then it will call fallback function from
    // openzeppline proxies and call implimentationA/B contract depending upon which address is set
    // using setImplementationof SmallProxy
    function getDataToTransact(uint256 numberToUpdate) public pure returns (bytes memory) {
        return abi.encodeWithSignature("setValue(uint256)", numberToUpdate);
    }

    // this function reads from storage slot "0", as there is no variable to hold
    function readStorage() public view returns (uint256 valueAtStorageSlotZero) {
        assembly {
            valueAtStorageSlotZero := sload(0)
        }
    }
}

contract ImplementationA {
    uint256 public value;

    function setValue(uint256 newValue) public {
        value = newValue;
    }
}

contract ImplementationB {
    uint256 public value;

    function setValue(uint256 newValue) public {
        value = newValue + 2;
    }
}

// function setImplementation(){}
// Transparent Proxy -> Ok, only admins can call functions on the proxy
// anyone else ALWAYS gets sent to the fallback contract.

// UUPS -> Where all upgrade logic is in the implementation contract, and
// you can't have 2 functions with the same function selector.
