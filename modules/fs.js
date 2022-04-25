//Módulo nativo node
const fs = require('fs');
//importando path
const path = require('path');

//criar uma pasta
            //usa join do path          callback
 fs.mkdir(path.join(__dirname, '/test'), (error) => {
     if (error) {
         return console.log('Erro: ', error)
     }

     console.log('Pasta criada com sucesso')
 });

//criar arquivo
            //usa join do path                              conteúdo do arquivo
fs.writeFile(path.join(__dirname, '/test', 'test.html'), '<h1>Hello World</h1>', (error) => {
    if(error) {
        return console.log('Erro: ', error)
    }

    console.log('Arquivo criado com sucesso!')

    //adicionar mais conteudo (repetir codigo acima sobrescreve)
    fs.appendFile(path.join(__dirname, '/test', 'test.html'), '<br><p>primeiro parágrafo</p>', (erro) => {
        if(erro) {
            return console.log('Erro: ', erro)
        }
        console.log('Conteúdo adicionado com sucesso!')
    });

    //ler arquivo
    fs.readFile(path.join(__dirname, '/test', 'test.html'), 'utf8', (erro, data) => {
        if(erro) {
            return console.log('Erro: ', erro)
        }
        console.log(data)
    });
});


