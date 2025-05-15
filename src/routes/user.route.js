import { Router } from 'express';
import userController from '../controller/user.controller.js';

const router = Router();

// Rota de criação de usuário - CREATE
router.post('/', userController.criar);

export default router;