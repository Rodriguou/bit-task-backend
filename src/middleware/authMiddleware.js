import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';

// Middleware de autenticação
const authMiddleware = async (req, res, next) => {

    // Verificando se o cabeçalho de autorização está presente
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).send('Token de autorização não fornecido.');
    }

    // Obtendo o token do cabeçalho da requisição
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Token não fornecido.');
    }

    try {
        // Verificando e decodificando o token usando a chave privada do JWT
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);

        // Buscando o usuário no banco de dados com base no ID do token
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
          throw new Error();
        }

        // Armazenando o usuário no objeto de requisição para uso posterior
        req.user = user;

        // Se a autenticação for bem-sucedida, permite que a execução prossiga
        next();
    } catch (error) {
        res.status(401).send(`Por favor, faça login: ${error.message}`);
    }
};

export default authMiddleware;