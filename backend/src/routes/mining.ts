import express from 'express';
import { startMining, stopMining, getMiningStatus } from '../controllers/miningController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

router.post('/start', authenticateUser, startMining);
router.post('/stop', authenticateUser, stopMining);
router.get('/status', authenticateUser, getMiningStatus);

export default router;