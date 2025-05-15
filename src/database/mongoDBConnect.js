import { connect } from 'mongoose';

// Criando uma função que se conecta ao banco de dados
async function conectarMongoDB() {
    try {
        await connect(process.env.MONGODB_URI, {
            dbName: process.env.DATABASE_NAME
        });
        console.log('Conectado ao banco de dados.');
    } catch (error) {
        console.error('Erro na conexão com o banco de dados:', error);
    }
}

export default conectarMongoDB;