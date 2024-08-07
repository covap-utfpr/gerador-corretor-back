const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
//importando middleware de autenticaçao
const middlewareAutenticacao = require("./middleware/middlewareAutenticacao");
//importando rotas para CRUD: de autenticaçao, de diretorio, de atividade e de questao
const AuthRoutes = require("./routes/AuthRoutes");
const DirectoryRoutes = require("./routes/DirectoryRoutes");
const QuestionRoutes = require("./routes/QuestionRoutes");
const TestRoutes = require("./routes/TestRoutes");

dotenv.config(); //importando variaveis de ambiente (.env)

const app = express(); //iniciando app express

//analisar cookies enviados pelo navegador nas solicitações
app.use(cookieParser());

//Configurando o CORS para permitir solicitações do front
app.use(cors());

//lendo todas requisiçoes como json, necessario para middleware de autenticaçao
app.use(express.json());

//aplicando o middleware em TODAS as rotas da aplicaçao
app.use(middlewareAutenticacao);

const authRoutes = new AuthRoutes();
const directoryRoutes = new DirectoryRoutes();
const testRoutes = new TestRoutes();
const questionRoutes = new QuestionRoutes();

//aplicando as rotas no meu app
app.use(authRoutes.authRoute, authRoutes.router);
app.use(directoryRoutes.directoryRoute, directoryRoutes.router);
app.use(testRoutes.testRoute, testRoutes.router);
app.use(questionRoutes.questionRoute, questionRoutes.router);

//incializando servidor
app.listen(process.env.PORT, () => {console.log(`Rodando na porta ${process.env.PORT}`)});

//exportando app
module.exports = app;
 