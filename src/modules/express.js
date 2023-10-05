const express = require("express");

const app = express();

//setando callback para requisiçao get em 
app.get("/", (req, res) => {
    res.status(200).send("<h1> Home </h1>");
});

app.get("/users", (req, res) => {

    const users = [
        {
            nome: "John Doe",
            email: "john@gmail.com"
        },
        {
            nome: "Ana Doe",
            email: "ana@gmail.com"
        },
        {
            nome: "Paul Richards",
            email: "paul@gmail.com"
        }
    ]

    res.status(200).json(users);
});

const port = 8080;

app.listen(port, () => {console.log(`Rodando na porta ${port}`)});