import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import projectController from '../controller/project.controller.js';
import taskRoutes from './task.route.js';

const router = Router();

// Aplica o middleware de autenticação a todas as rotas relacionadas a projetos
router.use(authMiddleware);

// Rota de criação de projeto - CREATE
router.post('/', projectController.criar);

// Rota para leitura de todos os projetos - READ
router.get('/', projectController.pegarTodos);

// Rota para leitura de todas as tarefas com prioridade alta iterando sobre os projetos - READ
router.get('/tarefas/prioridade', projectController.tarefasPrioridade);

// Rota para leitura de um único projeto - READ
router.get('/:idProjeto', projectController.pegarUnico);

// Rota de atualização de projeto - UPDATE
router.put('/:idProjeto', projectController.atualizar);

// Rota de exclusão de projeto - DELETE
router.delete('/:idProjeto', projectController.remover);

// Rota para as tarefas, aninhadas sob a rota do projeto
router.use('/:idProjeto/tarefas', taskRoutes);

export default router;