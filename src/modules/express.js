//Deinindo Endpoints - crud

const express = require("express");
const UserModel = require("../models/user.model")

const app = express();

app.use(express.json()); //vamos sempre usar json no corpo das requisiçoes, tanto post qaunto get

//middleware: app.use(), recebe uma funçao que é executada antes de cada requisiçao
app.use((req,res,next) => {
    console.log("Tipo de request: " + req.method);
    console.log("Tipo de conteudo: " + req.headers["content-type"]);
    console.log("Data: " + new Date());
    next();
})

//create user
//setando resposta da requisiçao post user
//assincrona pois UserModel.create retorna promise
//para teste, informaçoes do usuario sao adicionadas no corpo da requisiçao post pelo postman
app.post("/users", async (req,res) => {
    
    try {
        
        const user = await UserModel.create(req.body);

        //status 201: criado e obtido com sucesso
        res.status(201).json(user);
        
    } catch (error) {
        
        res.status(500).send(error.message);
    }
});

//read users
//setando resposta da requisiçao get users
app.get("/users", async (req, res) => {

    try {
        //sem parametros de filtro, traz todos users
        const users = await UserModel.find({});

        //status 200: obtidos com sucesso
        res.status(200).json(users);
        
    } catch (error) {
        
        res.status(500).send(error.message);
    }
});

//read user/id
//setando resposta da requisiçao get user/id
app.get("/users/:id", async (req, res) => {

    try {
        const id = req.params.id;
        //retorna o user com o id correspondente
        const user = await UserModel.findById(id);

        //status 200: json obtido com sucesso
        res.status(200).json(user);
        
    } catch (error) {
        
        res.status(500).send(error.message);
    }

});

//update user/id
//setando resposta da requisiçao patch user/id
app.patch("/users/:id", async (req, res) => {

    try {
        const id = req.params.id;

        //recebe json do user com seu campo enviado por body atualizado (new)
        const user = await UserModel.findByIdAndUpdate(id, req.body, { new : true });

        //status 200: atualizado e json obtido com sucesso
        res.status(200).json(user);
        
    } catch (error) {
        
        res.status(500).send(error.message);
    }

});

//delete user/id
//setando resposta da requisiçao delete user/id
app.delete("/users/:id", async (req, res) => {

    try {
        const id = req.params.id;

        //remove e retorna usuario removido
        const user = await UserModel.findByIdAndRemove(id);

        //status 200: deletado e json obtido com sucesso
        res.status(200).json(user);
        
    } catch (error) {
        
        res.status(500).send(error.message);
    }

});

const port = 8080;

app.listen(port, () => {console.log(`Rodando na porta ${port}`)});