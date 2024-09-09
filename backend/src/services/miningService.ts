import User from '../models/user';

export const startUserMining = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.isMining = true;
  user.lastMiningStart = new Date();
  await user.save();

  return { message: 'Mining started successfully' };
};

export const stopUserMining = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.isMining) {
    throw new Error('User is not currently mining');
  }

  const miningDuration = (new Date().getTime() - user.lastMiningStart.getTime()) / 1000; // in seconds
  const earnedCoins = calculateEarnedCoins(miningDuration, user.miningPower);

  user.isMining = false;
  user.coins += earnedCoins;
  await user.save();

  return { message: 'Mining stopped successfully', earnedCoins };
};

export const getUserMiningStatus = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  return {
    isMining: user.isMining,
    miningPower: user.miningPower,
    lastMiningStart: user.lastMiningStart,
    coins: user.coins
  };
};

const calculateEarnedCoins = (duration: number, miningPower: number) => {
  // Implement your coin calculation logic here
  // This is a simple example, you may want to adjust it based on your game's economy
  return Math.floor(duration * miningPower / 100);
};