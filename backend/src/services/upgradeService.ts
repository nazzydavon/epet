import User from '../models/user';

const upgrades = [
  { id: 1, name: 'Basic Miner', cost: 100, powerIncrease: 1 },
  { id: 2, name: 'Advanced Miner', cost: 500, powerIncrease: 5 },
  { id: 3, name: 'Super Miner', cost: 2000, powerIncrease: 20 },
];

export const getAvailableUpgrades = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  return upgrades.filter(upgrade => upgrade.cost <= user.coins);
};

export const purchaseUserUpgrade = async (userId: string, upgradeId: number) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const upgrade = upgrades.find(u => u.id === upgradeId);
  if (!upgrade) {
    throw new Error('Upgrade not found');
  }

  if (user.coins < upgrade.cost) {
    throw new Error('Not enough coins to purchase this upgrade');
  }

  user.coins -= upgrade.cost;
  user.miningPower += upgrade.powerIncrease;
  await user.save();

  return { message: 'Upgrade purchased successfully', newMiningPower: user.miningPower };
};