import { Router } from 'express';
import { login, logout, register, verifyToken } from '../controllers/auth/auth.controller.js';

const router = Router();

router.post('/register', register);

router.post('/login', login);

router.get('/logout', logout);

router.get('/verify', verifyToken);

export default router;