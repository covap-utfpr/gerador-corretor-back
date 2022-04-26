//Modulo externo instalado (npm install)
const express = require('express');

const app = express();

//Req = GET
app.get('/home', (req, res) => {
    res.status(200).send('<h1>Home Page</h1>')
});

const port = 8080;

app.listen(port, () => console.log(`Rodando com express na porta ${port}!`))

//npm run start:dev