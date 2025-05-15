import { Schema, model } from 'mongoose';
import Project from './projectModel.js';

const taskSchema = new Schema({
    nome: {
        type: String,
        required: true,
        maxLength: 30
    },
    // Campo para referenciar o projeto associado à tarefa usando o modelo Project
    projeto: {
        type: Schema.Types.ObjectId,
        ref: Project,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['a fazer', 'em progresso', 'concluída'],
        default: 'a fazer'
    },
    prioridade: {
        type: String,
        required: true,
        enum: ['baixa', 'média', 'alta']
    },
    descricao: {
        type: String,
        maxLength: 250
    }
});

const Task = model('tarefas', taskSchema);

export default Task;