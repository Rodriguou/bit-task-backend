import { Router } from 'express';
import authController from '../controller/authController.js'

const router = Router();

// Rota de login
router.post('/', authController.logar);

export default router;