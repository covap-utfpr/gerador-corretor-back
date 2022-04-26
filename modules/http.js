//Modulo nativo node
const http = require('http');

const port = 8080;

//req: objeto da requisição: cliente manda requisição
//res: objeto da resposta: servidor manda resposta

//contruindo server
const server = http.createServer((req, res) => {
    if(req.url === '/home') {
        res.writeHead(200, {"Content-Type": "text/html"}) //statuscode OK | Header
        res.end('<h1>Home Page</h1>')
    }

    if(req.url === '/users') {
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

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(users));
    }
});

//rodando server
server.listen(port, () => console.log(`Rodando na porta ${port}!`));