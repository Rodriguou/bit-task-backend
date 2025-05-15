import { Router } from 'express';
import taskController from '../controller/task.controller.js';

const router = Router({ mergeParams: true }); // Permite acessar parâmetros da rota pai

// Rota de criação de tarefa - CREATE
router.post('/', taskController.criar);

// Rota para leitura de todas as tarefas de um projeto
router.get('/', taskController.pegarTodos);

// Rota para leitura de tarefas com prioridade alta de um projeto
router.get('/prioridade', taskController.tarefasPrioridade);

// Rota para leitura de tarefas concluídas de um projeto
router.get('/concluidas', taskController.tarefasConcluidas);

// Rota para leitura de uma única tarefa de um projeto
router.get('/:idTarefa', taskController.pegarUnico);

// Rota de atualização de tarefas - UPDATE
router.put('/:idTarefa', taskController.atualizar);

// Rota de exclusão de tarefas - DELETE
router.delete('/:idTarefa', taskController.remover);

export default router;