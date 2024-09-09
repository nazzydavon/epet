import { Request, Response } from 'express';
import { getUserReferralCode, submitUserReferralCode, handleReferralClickService } from '../services/referralService';

export const getReferralCode = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const referralCode = await getUserReferralCode(userId);
    res.json({ referralCode });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const submitReferralCode = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { referralCode } = req.body;
    const result = await submitUserReferralCode(userId, referralCode);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const handleReferralClick = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const result = await handleReferralClickService(username);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};