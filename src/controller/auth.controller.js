import User from "../model/userModel.js";
import { compare } from "bcrypt";

const logar = async (req, res) => {
    try {
        // Busca um usuário no banco de dados com base no email fornecido
        const user = await User.findOne({ email: req.body.email }).select("+senha");
        if (!user) {
            return res.status(401).send({ message: "Insira um email cadastrado." });
        }

        // Compara a senha fornecida com a senha armazenada no banco de dados
        const validPassword = await compare(
            req.body.senha,
            user.senha
        );
        // Se a senha não for válida, retorna uma resposta de não autorizado
        if (!validPassword) {
            return res.status(401).send({ message: "Email ou senha incorretas!" });
        }

        // Gera um token de autenticação para o usuário
        const token = await user.generateAuthToken();
        res.status(200).send(token);
    } catch (error) {
        res.status(500).send({ message: "Erro ao realizar o login.", error: error.message });
    }
};

export default { logar };