import { connect } from 'mongoose';
import { getContract } from '../config/blockchain.js';
export const getBlockchainStats = async () => {
    try {
        const contract = getContract();
        if (!contract) {
            console.log('[Blockchain Stats] Contract not available');
            return {
                connected: false,
                harvestCount: 0,
                transferCount: 0,
                leaseCount: 0
            };
        }
        console.log('[Blockchain Stats] Fetching stats from contract');
        const harvestCount = await contract.harvestCount();
        const transferCount = await contract.transferCount();
        const leaseCount = await contract.leaseCount();
        return {
            connected: true,
            harvestCount: harvestCount.toNumber(),
            transferCount: transferCount.toNumber(),
            leaseCount: leaseCount.toNumber()
        };
    } catch (error) {
        console.error('[Blockchain Stats] Error fetching stats:', error);
        return {
            connected: false,
            error: error.message
        };
    }
};
export const recordTransferOnChain = async (harvestId, fromAddress, toAddress, price) => {
    try {
        const contract = getContract();
        if (!contract) {
            throw new Error('Blockchain contract not available');
        }
        console.log(`[Blockchain] Recording transfer: HarvestID=${harvestId}, From=${fromAddress}, To=${toAddress}, Price=${price}`);
        const numericHarvestId = parseInt(harvestId.toString().slice(-8), 16);
        const tx = await contract.recordTransfer(numericHarvestId, fromAddress, toAddress, price);
        const receipt = await tx.wait();
        console.log('[Blockchain] Transfer recorded successfully:', receipt.transactionHash);
        return receipt.transactionHash;
    }
    catch (error) {
        console.error('[Blockchain] Error recording transfer:', error);
        throw error;
    }
};
export const recordLeaseOnChain = async (landId, landownerAddress, farmerAddress, leasePrice) => {
    try {
        const contract = getContract();
        if (!contract) {
            throw new Error('Blockchain contract not available');
        }
        console.log(`[Blockchain] Recording lease: LandID=${landId}, Landowner=${landownerAddress}, Farmer=${farmerAddress}, Price=${leasePrice}`);
        const numericLandId = parseInt(landId.toString().slice(-8), 16);
        const tx = await contract.recordLease(numericLandId, landownerAddress, farmerAddress, leasePrice);
        const receipt = await tx.wait();
        console.log('[Blockchain] Lease recorded successfully:', receipt.transactionHash);
        return receipt.transactionHash;
    }
    catch (error) {
        console.error('[Blockchain] Error recording lease:', error.message);
        throw error;
    }
};