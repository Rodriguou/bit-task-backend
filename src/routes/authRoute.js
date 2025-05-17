import { Router } from 'express';
import authController from '../controller/authController.js'

const router = Router();

// Rota de login
router.post('/', authController.logar);

// Rota de logout
router.post('/logout', authController.logout);

export default router;