import express from 'express';
import { getReferralCode, submitReferralCode, handleReferralClick } from '../controllers/referralController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

router.get('/code', authenticateUser, getReferralCode);
router.post('/submit', authenticateUser, submitReferralCode);
router.get('/click/:username', handleReferralClick);

export default router;