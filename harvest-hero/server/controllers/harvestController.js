import Harvest from "../models/Harvest.js";
import { recordTransferOnChain } from "./blockchainController.js";

export const createHarvest = async (req, res) => {
    try {
        const { cropName, quantity, price } = req.body;
        if (!cropName || !quantity || !price) {
            return res.status(400).json({
                message: 'Please provide cropName, quantity, and price'
            });
        }
        const harvest = await Harvest.create({
            cropName,
            quantity,
            price,
            farmerId: req.user._id
        });
        const populatedHarvest = await Harvest.findById(harvest._id).populate('farmerId', 'username email');
        res.status(201).json({ success: true, data: populatedHarvest });
    } catch (error) {
        console.error(`[HarvestHero] Create Harvest Error: ${error.message}`);
        res.status(500).json({ message: 'Server error during harvest creation, Creation Failed' });
    }
};
export const getHarvests = async (req, res) => {
    try {
        const harvests = await Harvest.find({ status: 'available' }).populate('farmerId', 'username email');
        res.json({ success: true, count: harvests.length, data: harvests });
    } catch (error) {
        console.error(`[HarvestHero] Get My Harvests Error: ${error.message}`);
        res.status(500).json({ message: 'Server error fetching your harvests, Fetch Failed' });
    }
};
export const getAllHarvests = async (req, res) => {
    try {
        const harvests = await Harvest.find({ farmerId: req.user._id }).populate('buyerId', 'username email').sort('-createdAt');
        res.json({ success: true, count: harvests.length, data: harvests });
    } catch (error) {
        console.error(`[HarvestHero] Get All Harvests Error: ${error.message}`);
        res.status(500).json({ message: 'Server error fetching all your harvests, Fetch Failed' });
    }
};
export const purchaseHarvest = async (req, res) => {
    try {
        const harvest = await Harvest.findById(req.params.id);
        if (!harvest) {
            return res.status(404).json({ message: 'Harvest not found' });
        }
        if (harvest.status === 'sold') {
            return res.status(400).json({ message: 'harvest is not available for purchase since it is already sold or unavailable' });
        }
        harvest.status = 'sold';
        harvest.buyerId = req.user._id;
        try {
            console.log('[Purchase] Recording transfer on blockchain...');
            const farmerAddress = '0x' + harvest.farmerId._id.toString().padEnd(40, '0');
            const vendorAddress = '0x' + req.user._id.toString().padEnd(40, '0');
            const txHash = await recordTransferOnChain(harvest._id.toString(), farmerAddress, vendorAddress, harvest.price);
            harvest.blockchainTxHash = txHash;
            console.log('[Purchase] Transfer recorded on blockchain with txHash:', txHash);
        } catch (blockchainError) {
            console.error('[Purchase] Blockchain recording failed:', blockchainError.message);
            harvest.blockchainTxHash = 'blockchain_error';
        }

        await harvest.save();
        const updatedHarvest = await Harvest.findById(harvest._id).populate('farmerId', 'username email').populate('buyerId', 'username email');
        res.json({
            success: true, data: updatedHarvest, message: 'Harvest purchased successfully, Purchase Successful', blockchain: {
                recorded: harvest.blockchainTxHash && harvest.blockchainTxHash !== 'blockchain_error',
                txHash: harvest.blockchainTxHash
            }
        });
    } catch (error) {
        console.error(`[HarvestHero] Purchase Harvest Error: ${error.message}`);
        res.status(500).json({ message: 'Server error during harvest purchase, Purchase Failed' });
    }
};

export const deleteHarvest = async (req, res) => {
    try {
        const harvest = await Harvest.findById(req.params.id);
        if (!harvest) {
            return res.status(404).json({ message: 'Harvest not found' });
        }
        if (harvest.farmerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this harvest' });
        }
        if (harvest.status === 'sold') {
            return res.status(400).json({ message: 'Cannot delete a sold harvest' });
        }

        await harvest.deleteOne();
        res.json({ success: true, message: 'Harvest deleted successfully, Deletion Successful' });
    } catch (error) {
        console.error(`[HarvestHero] Delete Harvest Error: ${error.message}`);
        res.status(500).json({ message: 'Server error during harvest deletion, Deletion Failed' });
    }
};
