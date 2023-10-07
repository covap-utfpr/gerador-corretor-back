const dotenv = require("dotenv");
const express = require("express");

dotenv.config();

const app = express();

const rotasAutenticacao = require("./rotas/rotasAutenticacao");
// const rotasDiretorio = require("./rotas/rotasDiretorio");
// const rotasAtividade = require("./rotas/rotasAtividade");
// const rotasQuestao = require("./rotas/rotasQuestao");

app.use(rotasAutenticacao);
// app.use(rotasDiretorio);
// app.use(rotasAtividade);
// app.use(rotasQuestao);

const port = 8080;

app.listen(port, () => {console.log(`Rodando na porta ${port}`)});

module.exports = app;
