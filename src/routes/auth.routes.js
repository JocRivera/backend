import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/register', authController.Register);
authRoutes.post('/login', authController.Login);
authRoutes.post('/logout', authController.Logout);
authRoutes.get('/verify', authController.verifyToken)
export default authRoutes;