import User from '../model/userModel.js';
import { genSalt, hash } from 'bcrypt';

const criar = async (req, res) => {
	try {
		// Verifica se o email já existe no banco de dados
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			return res.status(409).send({ message: "Email já cadastrado!" });
		}

		const senha = req.body.senha;
		// Valida o comprimento da senha
		if (senha.length < 8 || senha.length > 16) {
			return res.status(400).send({ message: 'A senha deve ter entre 8 e 16 caracteres.' });
		}

		// Gera o salt
		const salt = await genSalt(Number(process.env.SALT));
		// Tenta criptografar a senha utilizando o salt
		const hashedPassword = await hash(senha, salt);
		// Verifica se a criptografia da senha foi gerada corretamente
		if (!hashedPassword) {
			throw new Error("Erro ao criptografar a senha.");
		}

		// Cria um novo usuário com a senha criptografada
		const newUser = new User({ ...req.body, senha: hashedPassword });
		// Salva o novo usuário no banco de dados
		await newUser.save();

		res.status(201).send({ message: "Usuário criado com sucesso!" });
	} catch (error) {
		res.status(500).send({ message: "Erro ao criar usuário.", error: error.message });
	}
};

export default { criar };