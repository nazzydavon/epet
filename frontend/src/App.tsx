import React, { useState, useEffect, useCallback } from 'react';
import HomeTab from './components/HomeTab';
import ReferralTab from './components/ReferralTab';
import MissionTab from './components/MissionTab';
import HistoryTab from './components/HistoryTab';
import UpgradeMinerPopup from './components/UpgradeMinerPopup';
import { UpgradePlan } from './types';
import * as api from './api';
import { AxiosResponse } from 'axios';

interface MiningStatus {
  minedTon: number;
  currentTon: number;
  isMining: boolean;
}

interface UserData {
  username: string;
  referralLink: string;
}

const upgradeData: UpgradePlan[] = [
  { name: "Free", hashrate: "2 GH/s", rentPeriod: 90, rentPrice: 0, dailyReturn: 0.02 },
  { name: "TON Silver", hashrate: "20 GH/s", rentPeriod: 90, rentPrice: 1, dailyReturn: 0.2 },
  { name: "TON Gold", hashrate: "100 GH/s", rentPeriod: 90, rentPrice: 5, dailyReturn: 1 },
  { name: "TON Diamond", hashrate: "600 GH/s", rentPeriod: 90, rentPrice: 25, dailyReturn: 6 },
  { name: "TON Platinum", hashrate: "1300 GH/s", rentPeriod: 90, rentPrice: 50, dailyReturn: 13 },
  { name: "TON VIP", hashrate: "3000 GH/s", rentPeriod: 90, rentPrice: 100, dailyReturn: 30 },
];

const CryptoMiningApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('Home');
  const [currentTon, setCurrentTon] = useState(0);
  const [minedTon, setMinedTon] = useState(0);
  const [shib, setShib] = useState(0);
  const [taps, setTaps] = useState(0);
  const [currentPlan, setCurrentPlan] = useState(upgradeData[0]);
  const [isMining, setIsMining] = useState(false);
  const [showCoinDrop, setShowCoinDrop] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isUpgradePopupOpen, setIsUpgradePopupOpen] = useState(false);
  const [claimedTon, setClaimedTon] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);
  const [quizEarnings, setQuizEarnings] = useState(0);
  const [username, setUsername] = useState('');
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const miningResponse: AxiosResponse<MiningStatus> = await api.getMiningStatus();
      setMinedTon(miningResponse.data.minedTon);
      setCurrentTon(miningResponse.data.currentTon);
      setIsMining(miningResponse.data.isMining);

      const userResponse: AxiosResponse<UserData> = await api.getUserData();
      setUsername(userResponse.data.username);
      setReferralLink(userResponse.data.referralLink);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const updateMinedTon = useCallback((newMinedTon: number) => {
    setMinedTon(newMinedTon);
  }, []);

  const updateCurrentTon = useCallback((newCurrentTon: number) => {
    setCurrentTon(newCurrentTon);
  }, []);

  const claimTon = async (amount: number) => {
    try {
      const response = await api.stopMining();
      setCurrentTon(prevTon => prevTon + amount);
      setClaimedTon(prevClaimed => prevClaimed + amount);
      setIsMining(false);
    } catch (error) {
      console.error('Error claiming TON:', error);
    }
  };

  const handleTap = async () => {
    setTaps(prevTaps => prevTaps + 1);
    setShowCoinDrop(true);
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 100);
    setTimeout(() => {
      setShowCoinDrop(false);
    }, 1000);

    try {
      if (!isMining) {
        await api.startMining();
        setIsMining(true);
      }
    } catch (error) {
      console.error('Error starting mining:', error);
    }
  };

  const handleUpgrade = async (plan: UpgradePlan) => {
    try {
      const response = await api.purchaseUpgrade(plan.rentPrice);
      setCurrentTon(response.data.currentTon);
      setCurrentPlan(plan);
      setIsUpgradePopupOpen(false);
    } catch (error) {
      console.error('Error upgrading plan:', error);
    }
  };

  const updateTONBalance = (amount: number) => {
    setCurrentTon(prevTon => prevTon + amount);
  };

  const updateQuizEarnings = (amount: number) => {
    setQuizEarnings(prevEarnings => prevEarnings + amount);
  };

  const updateReferralEarnings = (amount: number) => {
    setReferralEarnings(prevEarnings => prevEarnings + amount);
    setCurrentTon(prevTon => prevTon + amount);
  };

  const TabButton: React.FC<{ icon: React.FC, label: string }> = ({ icon: Icon, label }) => (
    <button
      onClick={() => setCurrentTab(label)}
      className={`flex flex-col items-center justify-center w-1/4 py-2 ${
        currentTab === label ? 'text-blue-500' : 'text-gray-500'
      }`}
    >
      <Icon />
      <span className="text-xs mt-1">{label}</span>
    </button>
  );

  const HomeIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );

  const UsersIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );

  const ClipboardIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg>
  );

  const FileTextIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );

  return (
    <div className="bg-black text-white h-full flex flex-col relative">
      <div className="flex-1 overflow-y-auto">
        {currentTab === 'Home' && (
          <HomeTab
            currentTon={currentTon}
            minedTon={minedTon}
            currentPlan={currentPlan}
            taps={taps}
            handleTap={handleTap}
            claimTon={claimTon}
            setIsUpgradePopupOpen={setIsUpgradePopupOpen}
            isMining={isMining}
            isShaking={isShaking}
            showCoinDrop={showCoinDrop}
            updateMinedTon={updateMinedTon}
            updateCurrentTon={updateCurrentTon}
          />
        )}
        {currentTab === 'Referral' && (
          <ReferralTab
            updateReferralEarnings={updateReferralEarnings}
            username={username}
            referralLink={referralLink}
          />
        )}
        {currentTab === 'Mission' && <MissionTab updateTONBalance={updateTONBalance} updateQuizEarnings={updateQuizEarnings} />}
        {currentTab === 'History' && (
          <HistoryTab
            claimedTon={claimedTon}
            minedTon={minedTon}
            referralEarnings={referralEarnings}
            quizEarnings={quizEarnings}
          />
        )}
      </div>
      <div className="flex border-t border-gray-800">
        <TabButton icon={HomeIcon} label="Home" />
        <TabButton icon={UsersIcon} label="Referral" />
        <TabButton icon={ClipboardIcon} label="Mission" />
        <TabButton icon={FileTextIcon} label="History" />
      </div>
      <UpgradeMinerPopup
        isOpen={isUpgradePopupOpen}
        onClose={() => setIsUpgradePopupOpen(false)}
        onSelectPlan={handleUpgrade}
        currentPlan={currentPlan}
        upgradeData={upgradeData}
      />
    </div>
  );
};

// Main App component
const App: React.FC = () => (
  <div className="h-screen w-screen bg-black flex items-center justify-center">
    <div className="w-full max-w-md h-full bg-black text-white overflow-hidden">
      <CryptoMiningApp />
    </div>
  </div>
);

export default App;