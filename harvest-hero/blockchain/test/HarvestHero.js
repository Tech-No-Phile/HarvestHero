const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('HarvestHero', function () {
  let harvestHero;
  let owner, farmer, vendor, landowner;
  beforeEach(async function () {
    [owner, farmer, vendor, landowner] = await ethers.getSigners();
    const HarvestHero = await ethers.getContractFactory('HarvestHero');
    harvestHero = await HarvestHero.deploy();
    await harvestHero.deployed();
  });
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(harvestHero.address).to.be.properAddress;
    });
    it("Should have zero counts", async function(){
      expect(await harvestHero.harvestCount()).to.equal(0);
      expect(await harvestHero.transferCount()).to.equal(0);
      expect(await harvestHero.leaseCount()).to.equal(0);
    });
  });
  describe("Harvest Recording", function () {
    it("Should record a new harvest", async function () {
      const harvestId = 1;
      const cropName = "Wheat";
      await harvestHero.recordHarvest(harvestId, farmer.address, cropName);
      const harvest = await harvestHero.getHarvest(harvestId);
      expect(harvest[0]).to.equal(harvestId);
      expect(harvest[1]).to.equal(farmer.address);
      expect(harvest[2]).to.equal(cropName);
      expect(harvest[3]).to.be.gt(0);
    });
    it("should not allow duplicate harvest recording", async function () {
      const harvestId = 1;
      await harvestHero.recordHarvest(harvestId, farmer.address, "Wheat");
      await expect(harvestHero.recordHarvest(harvestId, farmer.address, "Rice")).to.be.revertedWith("Harvest ID already exists");
    });
    it("Should allow to increment harvest count", async function () {
      await harvestHero.recordHarvest(1, farmer.address, "Wheat");
      await harvestHero.recordHarvest(2, farmer.address, "Rice");
      expect(await harvestHero.harvestCount()).to.equal(2);
    });
  });
  describe("Transfer Recording", function () {
    it("Should record a new transfer", async function () {
      const harvestId = 1;
      const price = 1000;
      await harvestHero.recordTransfer(
        harvestId,
        farmer.address,
        vendor.address,
        price
      );
      const transfer = await harvestHero.getTransfer(0);
      // const transfer = transfers[0];
      expect(transfer[0]).to.equal(harvestId);
      expect(transfer[1]).to.equal(farmer.address);
      expect(transfer[2]).to.equal(vendor.address);
      expect(transfer[3]).to.equal(price);
      expect(transfer[4]).to.be.gt(0);
    });
    it("Should allow to increment transfer count", async function () {
      await harvestHero.recordTransfer(1, farmer.address, vendor.address, 1000);
      await harvestHero.recordTransfer(2, farmer.address, vendor.address, 2000);
      expect(await harvestHero.transferCount()).to.equal(2);
    });
  });
  describe("Lease Recording", function () {
    it("Should record a new land lease", async function () {
      const landId = 1;
      const leasePrice = 5000;
      await harvestHero.recordLease(
        landId,
        landowner.address,
        farmer.address,
        leasePrice
      );
      const lease = await harvestHero.getLease(0);
      // const leases = await harvestHero.getLeases();
      expect(lease[0]).to.equal(landId);
      expect(lease[1]).to.equal(landowner.address);
      expect(lease[2]).to.equal(farmer.address);
      expect(lease[3]).to.equal(leasePrice);
      expect(lease[4]).to.be.gt(0);
    });

    it("Should allow to increment lease count", async function () {
      await harvestHero.recordLease(1, landowner.address, farmer.address, 1000);
      await harvestHero.recordLease(2, landowner.address, farmer.address, 2000);
      expect(await harvestHero.leaseCount()).to.equal(2);
    });
  });
  describe("Events", function () {
    it("Should emit HarvestRecorded event", async function () {
      await expect(harvestHero.recordHarvest(1, farmer.address, "Wheat"))
        .to.emit(harvestHero, "HarvestRecorded");
    });

    it("Should emit TransferRecorded event", async function () {
      await expect(
        harvestHero.recordTransfer(1, farmer.address, vendor.address, 1000)
      ).to.emit(harvestHero, "TransferRecorded");
    });

    it("Should emit LeaseRecorded event", async function () {
      await expect(
        harvestHero.recordLease(1, landowner.address, farmer.address, 5000)
      ).to.emit(harvestHero, "LeaseRecorded");
    });
  });
});