import Land from '../models/Land.js';

export const createLand = async (req, res) => {
    try {
        const {
            location, size, leasePrice } = req.body;
        if (!location || !size || !leasePrice) {
            return res.status(400).json({ message: 'Please provide location, size, and leasePrice' });
        }
        const land = await Land.create({
            location,
            size,
            leasePrice,
            ownerId: req.user._id
        });
        const populatedLand = await Land.findById(land._id).populate('ownerId', 'username email');
        res.status(201).json({ success: true, data: populatedLand });
    } catch (error) {
        console.error(`[HarvestHero] Create Land Error: ${error.message}`);
        res.status(500).json({ message: 'Server error during land creation, Creation Failed' });
    }
};
export const getLands = async (req, res) => {
    try {
        const lands = await Land.find({ status: 'available' }).populate('ownerId', 'username email').sort('-createdAt');
        res.status(200).json({ success: true, count: lands.length, data: lands });
    } catch (error) {
        console.error(`[HarvestHero] Get Lands Error: ${error.message}`);
        res.status(500).json({ message: 'Server error during fetching lands, Fetch Failed' });
    }
};
export const getMyLands = async (req, res) => {
    try {
        const lands = await Land.find({ ownerId: req.user._id }).populate('leasedTo', 'username email').sort('-createdAt');
        res.status(200).json({ success: true, count: lands.length, data: lands });
    } catch (error) {
        console.error(`[HarvestHero] Get My Lands Error: ${error.message}`);
        res.status(500).json({ message: 'Server error during fetching your lands, Fetch Failed' });
    }
};
export const requestLease = async (req, res) => {
    try {
        const land = await Land.findById(req.params.id);
        if (!land) {
            return res.status(404).json({ message: 'Land not found' });
        }
        if (land.status === 'leased') {
            return res.status(400).json({ message: 'Land is already leased' });
        }
        if (land.status === 'pending') {
            return res.status(400).json({ message: 'Lease request is already pending for this land' });
        }
        land.status = 'pending';
        land.leasedTo = req.user._id;
        await land.save();
        const updatedLand = await Land.findById(land._id).populate('ownerId', 'username email').populate('leasedTo', 'username email');
        res.status(200).json({ success: true, data: updatedLand, message: 'Lease request sent to owner, waiting for approval' });
    }
    catch (error) {
        console.error(`[HarvestHero] Request Lease Error: ${error.message}`);
        res.status(500).json({ message: 'Server error during lease request, Request Failed' });
    }
};
export const approveLease = async (req, res) => {
    try {
        const land = await Land.findById(req.params.id);
        if (!land) {
            return res.status(404).json({ message: 'Land not found' });
        }
        if (land.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not the owner of this land' });
        }
        if (land.status !== 'pending') {
            return res.status(400).json({ message: 'No pending lease request for this land' });
        }
        land.status = 'leased';
        try {
            console.log('[Approve Lease] Recording lease on blockchain...');
            const landownerAddress = '0x' + land.ownerId._id.toString().padEnd(40, '0');
            const farmerAddress = '0x' + land.leasedTo._id.toString().padEnd(40, '0');
            const txHash = await recordLeaseOnChain(land._id.toString(), landownerAddress, farmerAddress, land.leasePrice);
            land.blockchainTxHash = txHash;
            console.log('[Approve Lease] Lease recorded on blockchain with txHash:', txHash);
        } catch (blockchainError) {
            console.error('[Approve Lease] Blockchain recording failed:', blockchainError.message);
            land.blockchainTxHash = 'blockchain_error';
        }
        await land.save();

        const updatedLand = await Land.findById(land._id).populate('ownerId', 'username email').populate('leasedTo', 'username email');
        res.status(200).json({
            success: true, data: updatedLand, message: 'Lease approved, land is now leased', blockchain: {
                recorded: !!land.blockchainTxHash && land.blockchainTxHash !== 'blockchain_error',
                txHash: land.blockchainTxHash
            }
        });
    } catch (error) {
        console.error(`[HarvestHero] Approve Lease Error: ${error.message}`);
        res.status(500).json({ message: 'Server error during lease approval, Approval Failed', error: error.message });
    }
};
export const rejectLease = async (req, res) => {
    try {
        const land = await Land.findById(req.params.id);
        if (!land) {
            return res.status(404).json({ message: 'Land not found' });
        }
        if (land.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not the owner of this land' });
        }
        if (land.status !== 'pending') {
            return res.status(400).json({ message: 'Land is not in pending status, cannot reject lease' });
        }
        const isFarmer = land.leasedTo && land.leasedTo.toString() === req.user._id.toString();
        const isOwner = land.ownerId.toString() === req.user._id.toString();
        if (!isOwner && !isFarmer) {
            return res.status(403).json({ message: 'You are not authorized to reject this lease' });
        }
        land.status = 'available';
        land.leasedTo = null;
        land.blockchainTxHash = null;
        await land.save();
        const updatedLand = await Land.findById(land._id).populate('ownerId', 'username email').populate('leasedTo', 'username email');
        res.status(200).json({ success: true, data: updatedLand, message: 'Lease rejected, land is now available again' });
    } catch (error) {
        console.error(`[HarvestHero] Reject Lease Error: ${error.message}`);
        res.status(500).json({ message: 'Server error during lease rejection, Rejection Failed' });
    }
};
export const deleteLand = async (req, res) => {
    try {
        const land = await Land.findById(req.params.id);
        if (!land) {
            return res.status(404).json({ message: 'Land not found' });
        }
        if (land.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this land' });
        }
        if (land.status === 'leased') {
            return res.status(400).json({ message: 'Cannot delete leased land' });
        }
        await land.deleteOne();
        res.json({
            success: true, message: 'Land listing deleted successfully'
        });
    } catch (error) {
        console.error('[Delete Land Error]', error);
        res.status(500).json({ message: 'Failed to delete land', error: error.message });
    }
};