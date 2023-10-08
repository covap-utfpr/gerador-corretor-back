const express = require("express");
const { google } = require('googleapis');
const fs = require("fs");
const Questao = require("../modelos/Questao");

const router = express.Router();
const drive = google.drive('v3');

router.post("/criar", async (req, res) => {

    try {

        //monta objeto questao
        const questao = new Questao("1", req.body.nome, req.body.enunciado, req.body.imagem);

        //cria arquivo com o id correspondente
        fs.writeFileSync(questao.id, JSON.stringify(questao));

        const response = await drive.files.create({

            resource: {
                name: questao.id, // Define o nome do arquivo
                // Define o id da pasta pai onde o arquivo será criado
            },

            media: {
                mimeType: 'application/json',
                body: fs.createReadStream(questao.id), // Lê o arquivo local
            },

            fields: 'id', // Solicita apenas o ID do novo arquivo
        });

        const novoArquivo = response.data; // recupera os dados da resposta
        
        console.log(`Arquivo '${questao.nome}' criado com sucesso no Google Drive. ID: ${novoArquivo.id}`);
    
        // Exclui o arquivo local após o upload bem-sucedido
        fs.unlinkSync(questao.id);

        res.status(200).send(novoArquivo.id);

    } catch (erro) {

        res.status(500).send("Erro ao criar arquivo: " + erro.message);
    }

});

module.exports = router;