import { Schema, model } from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { hash } from 'bcrypt';

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Por favor, insira um email válido.']
    },
    senha: {
        type: String,
        required: true,
        select: false // A senha não será retornada por padrão em consultas
    },
    nome: {
        type: String,
        required: true,
        maxLength: 30
    },
    // Campo de tokens, que armazena os tokens de autenticação
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// Função que gera um token de autenticação para o usuário
userSchema.methods.generateAuthToken = async function () {
    try {
        // Criando um token
        const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
            expiresIn: "7d"
        });

        // Adicionando o novo token à lista de tokens do usuário e salvando no banco de dados
        this.tokens = this.tokens.concat({ token });
        await this.save();

        return { token, message: 'Logado com sucesso!', usuario: this._id, usuario: this.nome };
    } catch (error) {
        throw new Error('Erro ao gerar o token.');
    }
};

// Middleware executado antes de salvar um usuário, para criptografar a senha
userSchema.pre('save', async function (next) {
    this.senha = hash(this.senha, 10);
    next();
});

const User = model('usuarios', userSchema);

export default User;