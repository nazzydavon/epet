import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const startMining = () => api.post('/mining/start');

export const stopMining = () => api.post('/mining/stop');

export const getMiningStatus = () => api.get('/mining/status');

export const getUpgrades = () => api.get('/upgrade');

export const purchaseUpgrade = (upgradeId: number) =>
  api.post('/upgrade/purchase', { upgradeId });

export const getReferralCode = () => api.get('/referral/code');

export const submitReferralCode = (referralCode: string) =>
  api.post('/referral/submit', { referralCode });

export const getQuestion = () => api.get('/quiz/question');

export const submitAnswer = (questionId: string, answerIndex: number) =>
  api.post('/quiz/answer', { questionId, answerIndex });

export const getUserData = () => api.get('/user/data');

export default api;