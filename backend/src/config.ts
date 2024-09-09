import dotenv from 'dotenv';

dotenv.config();

export default {
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramBotUsername: process.env.TELEGRAM_BOT_USERNAME || '',
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/crypto_mining_bot',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
};