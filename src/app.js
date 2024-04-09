const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
//importando middleware de autenticaçao
const middlewareAutenticacao = require("./middleware/middlewareAutenticacao");
//importando rotas para CRUD: de autenticaçao, de diretorio, de atividade e de questao
const RotasAutenticacao = require("./rotas/rotasAutenticacao");
const RotasDiretorio = require("./rotas/rotasDiretorio");
const RotasAvaliacao = require("./rotas/rotasAvaliacao");
const RotasQuestao = require("./rotas/rotasQuestao");

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

const rotasAutenticacao = new RotasAutenticacao();
const rotasDiretorio = new RotasDiretorio();
const rotasAvaliacao = new RotasAvaliacao();
const rotasQuestao = new RotasQuestao();

//aplicando as rotas no meu app
app.use(rotasAutenticacao.rotaAutenticacao, rotasAutenticacao.router);
app.use(rotasDiretorio.rotaDiretorio, rotasDiretorio.router);
app.use(rotasAvaliacao.rotaAvaliacao, rotasAvaliacao.router);
app.use(rotasQuestao.rotaQuestao, rotasQuestao.router);

//incializando servidor
app.listen(process.env.PORT, () => {console.log(`Rodando na porta ${process.env.PORT}`)});

//exportando app
module.exports = app;
 