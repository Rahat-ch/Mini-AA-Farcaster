// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// deployed at 0xF7aB9d9c856D35C17685E50029F60B93023Fe21F
contract StorageRegistry {
    uint private nextUnitId = 1;  // Starting storage unit ID value
    mapping(address => uint) private accountStorageUnits;  // Mapping of Ethereum addresses to their storage unit IDs
    
    event StorageAllocated(address indexed account, uint unitId);

    function register() external {
        require(accountStorageUnits[msg.sender] == 0, "Address already has a storage unit");
        uint unitId = nextUnitId++;
        accountStorageUnits[msg.sender] = unitId;
        emit StorageAllocated(msg.sender, unitId);
    }

    function getUnitId(address account) external view returns (uint) {
        return accountStorageUnits[account];
    }
}
