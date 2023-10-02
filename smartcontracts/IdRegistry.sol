// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// deployed at 0x007ec325d80d64887281c453F641e6703ac6A3a9
contract IdRegistry {
    uint private nextId = 1;  
    mapping(address => Account) private accounts;  

    struct Account {
        uint fid; 
        address recoveryAddress;  
        string fname; 
    }

    modifier onlyOwnerOrRecovery(address accountAddress) {
        require(
            msg.sender == accountAddress || msg.sender == accounts[accountAddress].recoveryAddress,
            "Caller is not the owner or the recovery address"
        );
        _;
    }

    function register(address _recoveryAddress, string memory _fname) external {
        require(accounts[msg.sender].fid == 0, "Address already has a fid");
        accounts[msg.sender] = Account(nextId, _recoveryAddress, _fname);
        nextId++;
    }

    function transfer(address from, address to) external onlyOwnerOrRecovery(from) {
        require(accounts[to].fid == 0, "Recipient already has a fid");
        require(accounts[from].fid != 0, "Sender does not have a fid");
        accounts[to] = accounts[from];
        delete accounts[from];
    }

    function updateRecoveryAddress(address newRecoveryAddress) external onlyOwnerOrRecovery(msg.sender) {
        accounts[msg.sender].recoveryAddress = newRecoveryAddress;
    }

    function getFid(address accountAddress) external view returns (uint) {
        return accounts[accountAddress].fid;
    }

    function getFname(address accountAddress) external view returns (string memory) {
        return accounts[accountAddress].fname;
    }

    function getRecoveryAddress(address accountAddress) external view returns (address) {
        return accounts[accountAddress].recoveryAddress;
    }
}
