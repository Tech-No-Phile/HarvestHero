import express from 'express';
import { getBlockchainStats } from '../controllers/blockchainController.js';
const router = express.Router();
router.get('/stats', async (req, res) => {
    try {
        console.log('[Blockchain Routes] GET /stats called');
        const stats = await getBlockchainStats();
        res.json({
            success: true,
            data: stats,
        });    
    } catch (error) {
        console.error('[Blockchain Routes] Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blockchain stats',
            error: error.message
        });
    }
});
export default router;

