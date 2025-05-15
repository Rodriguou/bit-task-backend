import { Router } from 'express';
import authController from '../controller/auth.controller.js'

const router = Router();

// Rota de login
router.post('/', authController.logar);

export default router;