import React, { useEffect, useState, useCallback } from 'react';
import CoinDrop from '../NeonThunder';
import { UpgradePlan } from '../types';
import * as api from '../api';

interface HomeTabProps {
  currentTon: number;
  minedTon: number;
  currentPlan: UpgradePlan;
  taps: number;
  handleTap: () => void;
  claimTon: (amount: number) => void;
  setIsUpgradePopupOpen: (isOpen: boolean) => void;
  isMining: boolean;
  isShaking: boolean;
  showCoinDrop: boolean;
  updateMinedTon: (ton: number) => void;
  updateCurrentTon: (ton: number) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({
  currentTon,
  minedTon,
  currentPlan,
  taps,
  handleTap,
  claimTon,
  setIsUpgradePopupOpen,
  isMining,
  isShaking,
  showCoinDrop,
  updateMinedTon,
  updateCurrentTon,
}) => {
  const [displayedTon, setDisplayedTon] = useState(minedTon + 0.000001);
  const [miningRate, setMiningRate] = useState(currentPlan.dailyReturn / (24 * 60 * 60));

  const updateDisplayedTon = useCallback(() => {
    setDisplayedTon(prevTon => {
      const newTon = Number((prevTon + miningRate).toFixed(6));
      updateMinedTon(newTon);
      return newTon;
    });
  }, [miningRate, updateMinedTon]);

  useEffect(() => {
    updateDisplayedTon(); // Start counting immediately
    const interval = setInterval(updateDisplayedTon, 1000);
    return () => clearInterval(interval);
  }, [updateDisplayedTon]);

  useEffect(() => {
    setDisplayedTon(minedTon + 0.000001);
  }, [minedTon]);

  useEffect(() => {
    setMiningRate(currentPlan.dailyReturn / (24 * 60 * 60));
  }, [currentPlan]);

  const handleTapLocal = () => {
    handleTap();
    const tapBonus = miningRate * 10; // Each tap gives 10 seconds worth of mining
    const newTon = Number((displayedTon + tapBonus).toFixed(6));
    setDisplayedTon(newTon);
    updateMinedTon(newTon);
    setMiningRate(prevRate => prevRate * 1.01); // Increase mining rate by 1% for each tap
  };

  const handleClaimTon = () => {
    const amountToClaim = displayedTon;
    claimTon(amountToClaim);
    setDisplayedTon(0.000001);
    updateMinedTon(0.000001);
    updateCurrentTon(currentTon + amountToClaim);
  };

  const handleWithdraw = async () => {
    try {
      const response = await api.stopMining();
      console.log('Withdrawal successful:', response.data);
    } catch (error) {
      console.error('Error withdrawing:', error);
    }
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold">TON Balance</div>
            <div className="text-xs text-gray-400">{currentTon.toFixed(6)} TON</div>
          </div>
        </div>
        <button onClick={handleWithdraw} className="bg-blue-500 text-white px-4 py-1 rounded text-sm">Withdraw</button>
      </div>
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white mr-2">
            <span className="text-xs">SHIB</span>
          </div>
          <div>
            <div className="text-sm font-bold">SHIB</div>
            <div className="text-xs text-gray-400">0.00 SHIB</div>
          </div>
        </div>
        <button className="bg-blue-500 text-white px-4 py-1 rounded text-sm">Withdraw</button>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center relative">
        <div className="relative w-48 h-48 mb-4">
          <div className="absolute inset-0 bg-blue-900 rounded-full"></div>
          <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center">
            <svg 
              viewBox="0 0 200 200" 
              width="100%" 
              height="100%" 
              className="fan animate-spin" 
              style={{animationDuration: '3s'}}
            >
              <g>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation, index) => (
                  <path key={index} d="M100 100 L85 15 A70 70 0 0 1 115 15 Z" fill="url(#blade-gradient)" transform={`rotate(${rotation} 100 100)`} />
                ))}
              </g>
              <circle cx="100" cy="100" r="20" fill="url(#hub-gradient)" />
              <circle cx="100" cy="100" r="98" stroke="#3182CE" strokeWidth="4" fill="none" />
              <defs>
                <radialGradient id="blade-gradient">
                  <stop offset="0%" stopColor="#718096" />
                  <stop offset="100%" stopColor="#2D3748" />
                </radialGradient>
                <radialGradient id="hub-gradient">
                  <stop offset="0%" stopColor="#A0AEC0" />
                  <stop offset="100%" stopColor="#4A5568" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="text-center mb-4">
          <div className="text-2xl font-bold">{displayedTon.toFixed(6)} TON</div>
          <div className="text-sm text-gray-400">Mined (Unclaimed)</div>
          <div className="text-sm text-gray-400">Hashrate: {currentPlan.hashrate}</div>
          <div className="text-sm text-gray-400">Taps: {taps}</div>
          <div className="text-sm text-gray-400">Daily Return: {(miningRate * 24 * 60 * 60).toFixed(2)} TON</div>
          <div className="text-sm text-gray-400">Current Plan: {currentPlan.name}</div>
        </div>
        <button
          onClick={handleTapLocal}
          className={`bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-bold mb-4 hover:bg-blue-600 transition-colors ${isMining ? 'bg-blue-600' : ''} ${isShaking ? 'shake' : ''}`}
        >
          TAP TO MINE
        </button>
        <div className="absolute inset-0 pointer-events-none">
          <CoinDrop isActive={showCoinDrop} />
        </div>
      </div>
      <div className="flex space-x-2">
        <button onClick={handleClaimTon} className="bg-blue-900 text-blue-300 px-4 py-2 rounded flex-1 text-sm">CLAIM TON</button>
        <button 
          onClick={() => setIsUpgradePopupOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded flex-1 text-sm hover:bg-blue-600"
        >
          UPGRADE MINER
        </button>
      </div>
    </div>
  );
};

export default HomeTab;