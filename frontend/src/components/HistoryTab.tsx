import React from 'react';

interface HistoryTabProps {
  claimedTon: number;
  minedTon: number;
  referralEarnings: number;
  quizEarnings: number;
}

const HistoryTab: React.FC<HistoryTabProps> = ({
  claimedTon,
  minedTon,
  referralEarnings,
  quizEarnings
}) => {
  const totalEarnings = claimedTon + minedTon + referralEarnings + quizEarnings;

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-white">Earnings History</h2>
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-xl mb-2 text-white">Total Earnings: {totalEarnings.toFixed(6)} TON</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Claimed TON:</span>
            <span className="text-white">{claimedTon.toFixed(6)} TON</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Mined TON:</span>
            <span className="text-white">{minedTon.toFixed(6)} TON</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Referral Earnings:</span>
            <span className="text-white">{referralEarnings.toFixed(6)} TON</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Quiz Earnings:</span>
            <span className="text-white">{quizEarnings.toFixed(6)} TON</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTab;