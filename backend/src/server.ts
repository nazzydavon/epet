import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import { initializeBot } from './telegramBot';

import authRoutes from './routes/auth';
import miningRoutes from './routes/mining';
import upgradeRoutes from './routes/upgrade';
import referralRoutes from './routes/referral';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

connectDB();
initializeBot();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/mining', miningRoutes);
app.use('/api/upgrade', upgradeRoutes);
app.use('/api/referral', referralRoutes);

app.get('/', (req, res) => {
  res.send('Telegram Mini App Backend');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});