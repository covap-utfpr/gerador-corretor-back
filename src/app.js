const dotenv = require("dotenv");
const express = require("express");
const session = require('express-session');

dotenv.config(); //importando variaveis de ambiente (.env)

const app = express(); //inciando app express

// inicializando express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    //sessoes nao modificadas nao sao salvas
    resave: false,
    //sessoes nao incializadas podem ser salvas
    saveUninitialized: true,
}));

//importando middleware de autenticaçao
const middlewareAutenticacao = require("./middleware/middlewareAutenticacao");

//aplicando o middleware em TODAS as rotas da aplicaçao
app.use(middlewareAutenticacao);

app.get("/", (req, res) => {

    res.send("Home");
})

//importando rotas para CRUD: de autenticaçao, de diretorio, de atividade e de questao
const rotasAutenticacao = require("./rotas/rotasAutenticacao");
const rotasDiretorio = require("./rotas/rotasDiretorio");
// const rotasAtividade = require("./rotas/rotasAtividade");
const rotasQuestao = require("./rotas/rotasQuestao");

//aplicando as rotas no meu app
app.use("/", rotasAutenticacao);
app.use("/diretorio", rotasDiretorio);
// app.use("/atividade", rotasAtividade);
app.use("/questao", rotasQuestao);

//incializando servidor
app.listen(process.env.PORT, () => {console.log(`Rodando na porta ${process.env.PORT}`)});

//exportando app
module.exports = app;
