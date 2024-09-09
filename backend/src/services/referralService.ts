import User from '../models/user';
import crypto from 'crypto';

export const getUserReferralCode = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.referralCode) {
    user.referralCode = generateReferralCode();
    await user.save();
  }

  return user.referralCode;
};

export const submitUserReferralCode = async (userId: string, referralCode: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.hasUsedReferralCode) {
    throw new Error('User has already used a referral code');
  }

  const referrer = await User.findOne({ referralCode });
  if (!referrer) {
    throw new Error('Invalid referral code');
  }

  if (referrer._id.toString() === userId) {
    throw new Error('Cannot use your own referral code');
  }

  // Reward both the referrer and the referred user
  const referralBonus = 100; // You can adjust this value
  user.coins += referralBonus;
  user.hasUsedReferralCode = true;
  await user.save();

  referrer.coins += referralBonus;
  referrer.referralCount += 1;
  await referrer.save();

  return { message: 'Referral code applied successfully', bonusEarned: referralBonus };
};

export const handleReferralClickService = async (username: string) => {
  const referrer = await User.findOne({ username });
  if (!referrer) {
    throw new Error('Invalid referral link');
  }

  // Here you can implement any logic you want when someone clicks on a referral link
  // For example, you could store this information in a separate collection
  // or update some statistics for the referrer

  return { message: 'Referral link clicked', referrerUsername: username };
};

const generateReferralCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};