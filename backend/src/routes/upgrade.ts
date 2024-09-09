import express from 'express';
import { getUpgrades, purchaseUpgrade } from '../controllers/upgradeController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateUser, getUpgrades);
router.post('/purchase', authenticateUser, purchaseUpgrade);

export default router;