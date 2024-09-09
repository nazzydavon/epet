import { Request, Response } from 'express';
import { getAvailableUpgrades, purchaseUserUpgrade } from '../services/upgradeService';

export const getUpgrades = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const upgrades = await getAvailableUpgrades(userId);
    res.json(upgrades);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const purchaseUpgrade = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { upgradeId } = req.body;
    const result = await purchaseUserUpgrade(userId, upgradeId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};