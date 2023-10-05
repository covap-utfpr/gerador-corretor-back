const fs = require('fs');
const path = require('path');

async function manipularArquivos() {
    
    //criar pasta
    await fs.mkdir(path.join(__dirname, "/teste"), (error) => { 
        if(error) {
            throw new Error("Erro ao criar pasta: " + error) 
        }
        console.log("pasta criada");
    });
}

manipularArquivos().then(() => {

    fs.writeFile(path.join(__dirname, "teste", "teste.html"), "ola!", (error) => {
        if(error) {
            throw new Error("Erro ao escrever arquivo: " + error);
        }
        console.log("arquivo criado com sucesso");
    });
}).then(() => {

    fs.appendFile(path.join(__dirname, "teste", "teste.html"), "ola!", (error) => {
        if(error) {
            throw new Error("Erro ao atualizar arquivo: " + error);
        }
        console.log("arquivo atualizado com sucesso");
    });

}).then(() => {

    fs.readFile(path.join(__dirname, "teste", "teste.html"), "utf8", (error, data) => {
        
        if(error) {

            throw new Error("Erro ao ler o arquivo: " + error);
        }    

        console.log(data);
    });

}).catch((error) => {
    console.log("erro: " + error.message);
});

// //criar pasta
// fs.mkdir(path.join(__dirname, "/teste"), (error) => {

//     if (error) {
//         console.log("Erro: " + error);
//         return;
//     }

//     console.log("pasta criada com sucesso");
// });

// //criar arquivo
// fs.writeFile(path.join(__dirname, "teste", "teste.html"), "ola!", (error) => {
//     if (error) {
//         console.log("Erro: " + error);
//         return;
//     }

//     console.log("pasta criada com sucesso");
// });

// //append
// fs.appendFile(path.join(__dirname, "teste", "teste.html"), "ola!", (error) => {
//     if (error) {
//         console.log("Erro: " + error);
//         return;
//     }

//     console.log("pasta criada com sucesso");
// });

// //ler arquivo
// fs.readFile(path.join(__dirname, "teste", "teste.html"), "utf8", (error, data) => {
//     if (error) {
//         console.log("Erro: " + error);
//         return;
//     }

//     console.log(data);
// });