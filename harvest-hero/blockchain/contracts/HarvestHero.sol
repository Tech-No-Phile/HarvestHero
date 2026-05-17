// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HarvestHero {
    struct Harvest {
        uint256 harvestId;
        address farmer;
        string cropName;
        uint256 timestamp;
    }
    struct TransferRecord {
        uint256 harvestId;
        address from;
        address to;
        uint256 price;
        uint256 timestamp;
    }
    struct LeaseRecord {
        uint256 landId;
        address landowner;
        address farmer;
        uint256 leasePrice;
        uint256 timestamp;
    }
    mapping(uint256 => Harvest) public harvests;
    mapping(uint256 => TransferRecord[]) public transfers;
    mapping(uint256 => LeaseRecord[]) public leases;

    uint256 public harvestCount;
    uint256 public transferCount;
    uint256 public leaseCount;

    event HarvestRecorded(
        uint256 indexed harvestId,
        address indexed farmer,
        string cropName,
        uint256 timestamp
    );
    event TransferRecorded(
        uint256 indexed transferId,
        uint256 indexed harvestId,
        address indexed from,
        address to,
        uint256 price,
        uint256 timestamp
    );
    event LeaseRecorded(
        uint256 indexed leaseId,
        uint256 indexed landId,
        address indexed landowner,
        address farmer,
        uint256 leasePrice,
        uint256 timestamp
    );
    function recordHarvest(
        uint256 _harvestId,
        address _farmer,
        string memory _cropName
    ) public {
        require(harvests[_harvestId].timestamp == 0, "Harvest ID already exists");
        harvests[_harvestId] = Harvest({
            harvestId: _harvestId,
            farmer: _farmer,
            cropName: _cropName,
            timestamp: block.timestamp
        });
        harvestCount++;
        emit HarvestRecorded(_harvestId, _farmer, _cropName, block.timestamp);
    }
    function recordTransfer(
        uint256 _harvestId,
        address _from,
        address _to,
        uint256 _price
    ) public {
        uint256 transferId = transferCount;
        transfers[transferId].push(TransferRecord({
            harvestId: _harvestId,
            from: _from,
            to: _to,
            price: _price,
            timestamp: block.timestamp
        }));
        transferCount++;
        emit TransferRecorded(transferId, _harvestId, _from, _to, _price, block.timestamp);
    }
    function recordLease(
        uint256 _landId,
        address _landowner,
        address _farmer,
        uint256 _leasePrice
    ) public {
        uint256 leaseId = leaseCount;
        leases[leaseId].push(LeaseRecord({
            landId: _landId,
            landowner: _landowner,
            farmer: _farmer,
            leasePrice: _leasePrice,
            timestamp: block.timestamp
        }));
        leaseCount++;
        emit LeaseRecorded(leaseId, _landId, _landowner, _farmer, _leasePrice, block.timestamp);
    }
    function getHarvest(uint256 _harvestId) public view returns (Harvest memory) {
        return harvests[_harvestId];
    }
    function getTransfer(uint256 _transferId) public view returns (TransferRecord[] memory) {
        return transfers[_transferId];
    }
    function getLease(uint256 _leaseId) public view returns (LeaseRecord[] memory) {
        return leases[_leaseId];
    }
}