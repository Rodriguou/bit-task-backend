import Project from '../model/projectModel.js';
import Task from '../model/taskModel.js';

// Cria um novo projeto
const criar = async (req, res) => {
  const { nome, categoria, descricao } = req.body;
  const usuarioId = req.user._id;

  if (!usuarioId) {
    return res.status(401).send('Não autorizado');
  }

  // Verifica se nome e categoria foram fornecidos
  if (!nome || !categoria) {
    return res.status(422).send('Algum dado obrigatório não foi inserido');
  }

  const projeto = {
    nome,
    usuario: usuarioId,
    categoria,
    descricao
  };

  try {
    // Cria o projeto no banco de dados
    await Project.create(projeto);

    res.status(201).send({ message: 'Projeto inserido com sucesso!', projeto: projeto });
  } catch (error) {
    res.status(500).send({ message: "Erro ao criar projeto.", error: error.message });
  }
};

// Obtém todos os projetos do usuário
const pegarTodos = async (req, res) => {
  const usuarioId = req.user._id;
  if (!usuarioId) {
    return res.status(401).send('Não autorizado.');
  }

  try {
    // Busca todos os projetos do usuário
    const projetos = await Project.find({ usuario: usuarioId._id });

    res.send(projetos);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar projetos.", error: error.message });
  }
};

// Obtém todas as tarefas de todos os projetos do usuário
const todasTarefas = async (req, res) => {
  const usuarioId = req.user._id;
  if (!usuarioId) {
    return res.status(401).send('Não autorizado');
  }

  try {
    // Busca todos os projetos do usuário
    const projetos = await Project.find({ usuario: usuarioId });
    const projetosIds = projetos.map(projeto => projeto._id);

    // Busca todas as tarefas desses projetos
    const tarefas = await Task.find({ projeto: { $in: projetosIds } });

    res.send(tarefas);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar tarefas dos projetos do usuário.", error: error.message });
  }
};

// Obtém todas as tarefas de alta prioridade dos projetos do usuário
const tarefasPrioridade = async (req, res) => {
  const usuarioId = req.user._id;
  if (!usuarioId) {
    return res.status(401).send('Não autorizado');
  }

  try {
    // Obtém todos os projetos do usuário
    const projetos = await Project.find({ usuario: usuarioId });

    // Extrai apenas os IDs dos projetos
    const projetosIds = projetos.map(projeto => projeto._id);

    // Obtém todas as tarefas com prioridade alta dos projetos do usuário
    const tarefas = await Task.find({ projeto: { $in: projetosIds }, prioridade: 'alta' });

    res.send(tarefas);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar tarefas com prioridade alta do usuário.", error: error.message });
  }
};

// Obtém informações de um projeto específico
const pegarUnico = async (req, res) => {
  const usuarioId = req.user._id;
  if (!usuarioId) {
    return res.status(401).send('Não autorizado');
  }

  const projetoId = req.params.idProjeto;

  try {
    // Busca o projeto no banco de dados pelo ID
    const projeto = await Project.findOne({ _id: projetoId, usuario: usuarioId });

    if (!projeto) {
      return res.status(404).send('Projeto não encontrado');
    }

    res.send(projeto);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar projeto.", error: error.message });
  }
};

// Atualiza informações de um projeto
const atualizar = async (req, res) => {
  const { nome, categoria, descricao } = req.body;
  const usuarioId = req.user._id;
  if (!usuarioId) {
    return res.status(401).send('Não autorizado');
  }

  const projetoId = req.params.idProjeto;

  try {
    // Busca o projeto no banco de dados pelo ID
    const projeto = await Project.findOne({ _id: projetoId, usuario: usuarioId });
    if (!projeto) {
      return res.status(404).send('Projeto não encontrado');
    }

    // Atualiza as informações do projeto
    projeto.nome = nome;
    projeto.categoria = categoria;
    projeto.descricao = descricao;

    const projetoAtualizado = await projeto.save();

    res.status(200).send({ message: 'Projeto atualizado com sucesso!', projeto: projetoAtualizado });
  } catch (error) {
    res.status(500).send({ message: "Erro ao atualizar projeto.", error: error.message });
  }
};

// Remove um projeto e suas tarefas associadas
const remover = async (req, res) => {
  const usuarioId = req.user._id;
  if (!usuarioId) {
    return res.status(401).send('Não autorizado');
  }

  const projetoId = req.params.idProjeto;

  try {
    // Exclui todas as tarefas relacionadas ao projeto
    await Task.deleteMany({ projeto: projetoId });

    // Exclui o próprio projeto
    const resultado = await Project.deleteOne({ _id: projetoId, usuario: usuarioId });

    if (resultado.deletedCount > 0) {
      res.status(200).send('Projeto e tarefas relacionadas removidos com sucesso!');
    } else {
      res.status(404).send('Projeto não encontrado.');
    }
  } catch (error) {
    res.status(500).send({ message: "Erro ao remover projeto.", error: error.message });
  }
};

export default { criar, pegarTodos, todasTarefas, tarefasPrioridade, pegarUnico, atualizar, remover };
