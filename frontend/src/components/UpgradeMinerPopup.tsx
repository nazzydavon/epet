import React, { useState } from 'react';
import { UpgradePlan } from '../types';

interface UpgradeMinerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: UpgradePlan) => void;
  currentPlan: UpgradePlan;
  upgradeData: UpgradePlan[];
}

const UpgradeMinerPopup: React.FC<UpgradeMinerPopupProps> = ({ isOpen, onClose, onSelectPlan, currentPlan, upgradeData }) => {
  const [selectedPlan, setSelectedPlan] = useState<UpgradePlan | null>(null);

  if (!isOpen) return null;

  const handleSelectPlan = (plan: UpgradePlan) => {
    setSelectedPlan(plan);
  };

  const handleConfirm = () => {
    if (selectedPlan) {
      onSelectPlan(selectedPlan);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-white text-center">Upgrade Miner</h2>
        <p className="text-sm text-gray-400 text-center mb-4">
          You will be able to earn approximately 12% profit per day and 1700% profit in 30 days by renting a Turbo.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {upgradeData.map((plan, index) => (
            <button
              key={index}
              onClick={() => handleSelectPlan(plan)}
              className={`p-2 rounded-lg text-left ${
                selectedPlan === plan ? 'bg-blue-600' : 'bg-gray-800'
              }`}
            >
              <div className="font-bold text-white">{plan.name}</div>
              <div className="text-yellow-500">{plan.hashrate}</div>
            </button>
          ))}
        </div>
        {selectedPlan && (
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Mining Power</span>
              <span className="text-white">{selectedPlan.hashrate}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Rent Period</span>
              <span className="text-white">{selectedPlan.rentPeriod} days</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">30 Days Profit</span>
              <span className="text-yellow-500">{(selectedPlan.dailyReturn * 30).toFixed(2)} TON</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Daily</span>
              <span className="text-yellow-500">{selectedPlan.dailyReturn.toFixed(2)} TON</span>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-400">Total Renting Price</span>
          <span className="text-white text-xl font-bold">
            {selectedPlan ? selectedPlan.rentPrice.toFixed(2) : '0'} TON
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-700 text-white px-4 py-2 rounded flex-1 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-500 text-white px-4 py-2 rounded flex-1 text-sm"
            disabled={!selectedPlan}
          >
            Start Mining
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeMinerPopup;