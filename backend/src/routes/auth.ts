import express from 'express';
import { login, register, getUserInfo } from '../controllers/authController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/user', authenticateUser, getUserInfo);

export default router;