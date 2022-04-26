//Modulo externo instalado (npm install)
const express = require('express');

const app = express();

//Req = GET
app.get('/home', (req, res) => {
    //res.contentType('application/html');
    res.status(200).send('<h1>Home Page</h1>')
});

app.get('/users', (req, res) => {
    const users = [
        {
            nome: 'John Doe',
            email: 'john@doe.com'
        },

        {
            nome: 'Jane Doe',
            email: 'jane@doe.com'
        }
    ]
    res.status(200).json(users);
})

const port = 8080;

app.listen(port, () => console.log(`Rodando com express na porta ${port}!`))

//npm run start:dev