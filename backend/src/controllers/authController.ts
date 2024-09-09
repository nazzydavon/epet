import { Request, Response } from 'express';
import { loginUser, registerUser, getUserData } from '../services/authService';
import { generateReferralLink } from '../telegramBot';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await loginUser(username, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await registerUser(username, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // Assuming you have authentication middleware that adds user info to the request
    const user = await getUserData(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const referralLink = generateReferralLink(user.referralCode);
    
    res.json({
      username: user.username,
      referralLink,
      // Add any other user data you want to include
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user data' });
  }
};