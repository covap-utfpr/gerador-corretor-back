const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config(); //importando variaveis de ambiente (.env)

const app = express(); //iniciando app express

//analisar cookies enviados pelo navegador nas solicitações
app.use(cookieParser());

//Configurando o CORS para permitir solicitações do front
app.use(cors());

//importando middleware de autenticaçao
const middlewareAutenticacao = require("./middleware/middlewareAutenticacao");

//lendo todas requisiçoes como json, necessario para middleware de autenticaçao
app.use(express.json());

//aplicando o middleware em TODAS as rotas da aplicaçao
app.use(middlewareAutenticacao);

app.get("/home", (req, res) => {
    res.send("Home");
});
 
//importando rotas para CRUD: de autenticaçao, de diretorio, de atividade e de questao
const rotasAutenticacao = require("./rotas/rotasAutenticacao");
const rotasDiretorio = require("./rotas/rotasDiretorio");
// const rotasAtividade = require("./rotas/rotasAtividade");
const rotasQuestao = require("./rotas/rotasQuestao");

//aplicando as rotas no meu app
app.use("/", rotasAutenticacao.router);
app.use("/diretorio", rotasDiretorio.router);
// app.use("/atividade", rotasAtividade);
app.use("/questao", rotasQuestao.router);
//incializando servidor
app.listen(process.env.PORT, () => {console.log(`Rodando na porta ${process.env.PORT}`)});

//exportando app
module.exports = app;
