const http = require("http");

const port = 8080;

// cliente: navegador web

//recebe como argumento uma arrow function callback (executa a toda nova request)
//a qual recebe como argumento os objetos req e res a serem construidos dentro da arrow function;
const server = http.createServer((req, res) => {

    //se a request url do cliente no server for /home
    if (req.url === "/home") {
        // e se a response do servidor for 200, envia-se um conteudo html 
        res.writeHead(200, { 'Content-Type': 'text/html' });
        //conteudo html
        res.end("<h1> Home </h1>");
    }

    if(req.url === "/users") {

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

        res.writeHead(200, { 'Content-Type': 'application/json'});
        res.end(JSON.stringify(users));
    }
});

//rodando servidor na porta port
server.listen(port, () => console.log(`Rodando na porta ${port}`)); 