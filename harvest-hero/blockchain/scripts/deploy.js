//import { ethers } from 'hardhat';
const hre = require('hardhat');
const fs = require('fs');
const path = require('path');
async function main() {

  console.log('HarvestHero deployment started...');
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);
  // const HarvestHero = await hre.ethers.getContractFactory('HarvestHero');
  const balance = await deployer.getBalance();
  console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH`);
  const HarvestHero = await ethers.getContractFactory('HarvestHero');
  const harvestHero = await HarvestHero.deploy();
  await harvestHero.deployed();
  console.log(`HarvestHero deployed to: ${harvestHero.address}`);
  const artifactPath = path.join(
    __dirname, '../artifacts/contracts/HarvestHero.sol/HarvestHero.json'
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  const contractData = {
    address: harvestHero.address,
    abi: artifact.abi
  };
  const serverConfigDir = path.join(__dirname, '../../server/config');
  if(!fs.existsSync(serverConfigDir)){
    fs.mkdirSync(serverConfigDir, { recursive: true });
  }
  const configPath = path.join(serverConfigDir, "contract.json");
  fs.writeFileSync(configPath, JSON.stringify(contractData, null, 2));
  console.log(`Contract address and ABI saved to ${configPath}`);
  console.log("HarvestHero deployment completed successfully.");
  console.log("Contract Stats: ");
  console.log(`- Address: ${harvestHero.address}`);
  console.log(`- Deployer: ${deployer.address}`);
  console.log("Network: Localhost (Hardhat)");
  console.log("Chain ID: 31337");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

