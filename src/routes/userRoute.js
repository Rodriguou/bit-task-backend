import { Router } from 'express';
import userController from '../controller/userController.js';

const router = Router();

// Rota de criação de usuário - CREATE
router.post('/', userController.criar);

export default router;