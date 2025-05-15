import { Schema, model } from 'mongoose';
import User from './userModel.js';

const projectSchema = new Schema({
    nome: {
        type: String,
        required: true,
        maxLength: 30
    },
    // Campo para referenciar o usuário associado ao projeto usando o modelo User
    usuario: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    categoria: {
        type: String,
        required: true,
        enum: ['pessoal', 'acadêmico', 'profissional'],
        default: 'pessoal'
    },
    descricao: {
        type: String,
        maxLength: 250
    }
});

const Project = model('projetos', projectSchema);

export default Project;