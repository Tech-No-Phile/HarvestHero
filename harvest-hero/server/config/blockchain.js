import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let provider, signer, contract;
const initBlockchain = () => {
    try {
        console.log('[Blockchain] Initializing blockchain connection');
        const contractPath = path.join(__dirname, 'contract.json');
        if (!fs.existsSync(contractPath)) {
            console.error('[Blockchain] Contract configuration file not found:', contractPath);
            console.log('[Blockchain] Skipping blockchain initialization');
            return null;
        }
        const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf-8'));
        provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
        const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
        signer = new ethers.Wallet(privateKey, provider);
        contract = new ethers.Contract(contractData.address, contractData.abi, signer);
        console.log('[Blockchain] Connected to contract at address:', contractData.address);
        console.log('[Blockchain] Using signer address:', signer.address);
        return contract;
    } catch (error) {
        console.error('[Blockchain] Error initializing blockchain connection:', error);
        return null;
    }
};
const getContract = () => {
    if (!contract) {
        return initBlockchain();
    }
    return contract;
};
export { initBlockchain, getContract };