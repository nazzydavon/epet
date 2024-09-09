import TelegramBot from 'node-telegram-bot-api';
import config from './config';
import User from './models/user';

const bot = new TelegramBot(config.telegramBotToken, { polling: true });

export const initializeBot = () => {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from?.id;
    const username = msg.from?.username || `user${userId}`;

    try {
      let user = await User.findOne({ telegramId: userId });

      if (!user) {
        user = new User({
          telegramId: userId,
          username: username,
          referralCode: generateReferralCode(),
        });
        await user.save();
        bot.sendMessage(chatId, `Welcome to the Crypto Mining Bot, ${username}! Your account has been created.`);
      } else {
        bot.sendMessage(chatId, `Welcome back, ${username}!`);
      }

      const referralLink = generateReferralLink(user.referralCode);
      bot.sendMessage(chatId, `Your referral link is: ${referralLink}`);
    } catch (error) {
      console.error('Error handling /start command:', error);
      bot.sendMessage(chatId, 'Sorry, there was an error processing your request. Please try again later.');
    }
  });

  // Add more bot commands and event handlers here
};

export const generateReferralCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const generateReferralLink = (referralCode: string): string => {
  return `https://t.me/${config.telegramBotUsername}?start=${referralCode}`;
};

export default bot;