import Project from '../model/projectModel.js';
import Task from '../model/taskModel.js';

// Cria uma nova tarefa
const criar = async (req, res) => {
  const { nome, status, prioridade, descricao } = req.body;
  const projetoId = req.params.idProjeto;
  const usuarioId = req.user._id;

  if (!projetoId || !usuarioId) {
    return res.status(401).send('Não autorizado');
  }

  if (!nome || !prioridade) {
    return res.status(422).send('Algum dado obrigatório não foi inserido');
  }

  try {
    // Verificando se o usuário é o criador do projeto
    const projeto = await Project.findOne({ _id: projetoId, usuario: usuarioId });

    if (!projeto) {
      return res.status(401).send('Não autorizado');
    }

    const tarefa = {
      nome,
      projeto: projetoId,
      status,
      prioridade,
      descricao
    };

    // Cria a tarefa no banco de dados
    await Task.create(tarefa);

    res.status(201).send({ message: 'Tarefa inserida com sucesso!', tarefa: tarefa});
  } catch (error) {
    res.status(500).send({ message: "Erro ao criar tarefa.", error: error.message });
  }
};

// Obtém todas as tarefas do projeto
const pegarTodos = async (req, res) => {
  const projetoId = req.params.idProjeto;
  const usuarioId = req.user._id;

  if (!projetoId || !usuarioId) {
    return res.status(401).send('Não autorizado');
  }

  try {
    // Verificando se o usuário é o criador do projeto
    const projeto = await Project.findOne({ _id: projetoId, usuario: usuarioId });

    if (!projeto) {
      return res.status(401).send('Não autorizado');
    }

    // Busca todas as tarefas do projeto
    const tarefas = await Task.find({ projeto: projetoId });
    res.send(tarefas);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar tarefas.", error: error.message });
  }
};

// Obtém todas as tarefas de alta prioridade do projeto
const tarefasPrioridade = async (req, res) => {
  const projetoId = req.params.idProjeto;
  const usuarioId = req.user._id;

  if (!projetoId || !usuarioId) {
    return res.status(401).send('Não autorizado');
  }

  try {
    // Verificando se o usuário é o criador do projeto
    const projeto = await Project.findOne({ _id: projetoId, usuario: usuarioId });

    if (!projeto) {
      return res.status(401).send('Não autorizado');
    }

    // Obtém todas as tarefas com prioridade alta do projeto
    const tarefas = await Task.find({ projeto: projetoId, prioridade: 'alta' });
    res.send(tarefas);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar tarefas com prioridade alta do projeto.", error: error.message });
  }
};

// Obtém todas as tarefas concluídas do projeto
const tarefasConcluidas = async (req, res) => {
  const projetoId = req.params.idProjeto;
  const usuarioId = req.user._id;

  if (!projetoId || !usuarioId) {
    return res.status(401).send('Não autorizado');
  }

  try {
    // Verificando se o usuário é o criador do projeto
    const projeto = await Project.findOne({ _id: projetoId, usuario: usuarioId });
    if (!projeto) {
      return res.status(401).send('Não autorizado');
    }

    // Obtém todas as tarefas concluídas do projeto
    const tarefas = await Task.find({ projeto: projetoId, status: 'concluída' });

    res.send(tarefas);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar tarefas concluídas.", error: error.message });
  }
};

// Obtém informações de uma tarefa específica do projeto
const pegarUnico = async (req, res) => {
  const projetoId = req.params.idProjeto;
  const usuarioId = req.user._id;

  if (!projetoId || !usuarioId) {
    return res.status(401).send('Não autorizado');
  }

  const tarefaId = req.params.idTarefa;

  try {
    // Verificando se o usuário é o criador do projeto
    const projeto = await Project.findOne({ _id: projetoId, usuario: usuarioId });
    if (!projeto) {
      return res.status(401).send('Não autorizado');
    }

    // Busca a tarefa no banco de dados pelo ID
    const tarefa = await Task.findOne({ _id: tarefaId, projeto: projetoId });
    if (!tarefa) {
      return res.status(404).send('Tarefa não encontrada');
    }

    res.send(tarefa);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar tarefa.", error: error.message });
  }
};

// Atualiza informações de uma tarefa do projeto
const atualizar = async (req, res) => {
  const { nome, status, prioridade, descricao } = req.body;
  const projetoId = req.params.idProjeto;
  const usuarioId = req.user._id;

  if (!projetoId || !usuarioId) {
    return res.status(401).send('Não autorizado');
  }

  const tarefaId = req.params.idTarefa;

  try {
    // Verificando se o usuário é o criador do projeto
    const projeto = await Project.findOne({ _id: projetoId, usuario: usuarioId });
    if (!projeto) {
      return res.status(401).send('Não autorizado');
    }

    // Busca a tarefa no banco de dados pelo ID
    const tarefa = await Task.findOne({ _id: tarefaId, projeto: projetoId });
    if (!tarefa) {
      return res.status(404).send('Tarefa não encontrada');
    }

    // Atualiza as informações da tarefa
    tarefa.nome = nome;
    tarefa.status = status;
    tarefa.prioridade = prioridade;
    tarefa.descricao = descricao;

    const tarefaAtualizada = await tarefa.save();

    res.status(200).send({ message: 'Tarefa atualizada com sucesso!', tarefa: tarefaAtualizada });
  } catch (error) {
    res.status(500).send({ message: "Erro ao atualizar tarefa.", error: error.message });
  }
};

// Remove uma tarefa do projeto
const remover = async (req, res) => {
  const projetoId = req.params.idProjeto;
  const usuarioId = req.user._id;

  if (!projetoId || !usuarioId) {
    return res.status(401).send('Não autorizado');
  }

  const tarefaId = req.params.idTarefa;

  // Busca a tarefa no banco de dados pelo ID
  const tarefa = await Task.findOne({ _id: tarefaId, projeto: projetoId });

  if (tarefa) {
    try {
      // Exclui a tarefa
      await Task.deleteOne({ _id: tarefaId, projeto: projetoId });

      res.status(200).send('Tarefa removida com sucesso!');
    } catch (error) {
      res.status(500).send({ message: "Erro ao remover tarefa.", error: error.message });
    }
  } else {
    res.status(404).send('Tarefa não encontrada.');
  }
};

export default { criar, pegarTodos, tarefasPrioridade, tarefasConcluidas, pegarUnico, atualizar, remover };