import React, { useState, useEffect } from 'react';
import * as api from '../api';

interface ReferralTabProps {
  updateReferralEarnings: (amount: number) => void;
  username: string;
  referralLink: string;
}

const ReferralTab: React.FC<ReferralTabProps> = ({ updateReferralEarnings, username, referralLink }) => {
  const [showReferralPopup, setShowReferralPopup] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [referrals, setReferrals] = useState(0);
  const [earnedRewards, setEarnedRewards] = useState(0);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await api.getReferralCode();
      // Assuming the backend returns referral count and earned rewards along with the code
      setReferrals(response.data.referralCount || 0);
      setEarnedRewards(response.data.earnedRewards || 0);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    }
  };

  const handleInvite = () => {
    setShowReferralPopup(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const referralTiers = [
    { friends: 5, reward: 0.5 },
    { friends: 10, reward: 3 },
    { friends: 25, reward: 8 },
    { friends: 50, reward: 25 },
    { friends: 100, reward: 60 },
  ];

  const simulateReferralReward = async () => {
    try {
      const response = await api.submitReferralCode('SIMULATED_CODE');
      const reward = response.data.bonusEarned;
      setEarnedRewards(prevRewards => prevRewards + reward);
      updateReferralEarnings(reward);
      setReferrals(prevReferrals => prevReferrals + 1);
    } catch (error) {
      console.error('Error simulating referral reward:', error);
    }
  };

  return (
    <div className="p-4 bg-black h-full">
      <div className="mb-4 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-bold mb-2">Welcome, {username}!</h3>
        <p className="text-sm text-gray-400">Share your referral link and earn rewards!</p>
      </div>
      <div className="flex justify-between mb-4">
        <button
          onClick={handleInvite}
          className="bg-blue-500 text-white px-4 py-2 rounded flex-1 mr-2 text-sm hover:bg-blue-600"
        >
          Invite Friends
        </button>
        <button className="bg-gray-700 text-white px-4 py-2 rounded flex-1 text-sm">
          Reward: {earnedRewards.toFixed(2)} TON
        </button>
      </div>
      <div className="mb-4 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-bold mb-2">Your Referrals</h3>
        <p className="text-sm text-gray-400">Total Referrals: {referrals}</p>
        <p className="text-sm text-gray-400">Total Earned: {earnedRewards.toFixed(2)} TON</p>
      </div>
      <div className="text-sm mb-2 text-gray-400">Referral Tiers</div>
      {referralTiers.map((tier, index) => (
        <div key={index} className="flex items-center mb-2 bg-gray-800 rounded p-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full mr-2 flex items-center justify-center text-white">
            {tier.friends}
          </div>
          <div className="flex-1 text-sm">Invite {tier.friends} Friends - Earn {tier.reward} TON</div>
        </div>
      ))}
      {showReferralPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-white">Your Referral Link</h2>
            <div className="bg-gray-700 p-2 rounded mb-4 flex items-center">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="bg-transparent text-white flex-1 outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="ml-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Share this link with your friends. When they sign up and start mining, you'll earn rewards!
            </p>
            <button
              onClick={() => setShowReferralPopup(false)}
              className="bg-gray-700 text-white px-4 py-2 rounded w-full text-sm hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Temporary button to simulate referral reward */}
      <button
        onClick={simulateReferralReward}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full text-sm hover:bg-green-600"
      >
        Simulate Referral Reward
      </button>
    </div>
  );
};

export default ReferralTab;