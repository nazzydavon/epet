import { Request, Response } from 'express';
import { startUserMining, stopUserMining, getUserMiningStatus } from '../services/miningService';

export const startMining = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const result = await startUserMining(userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const stopMining = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const result = await stopUserMining(userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMiningStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const result = await getUserMiningStatus(userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};