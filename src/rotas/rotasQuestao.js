const express = require("express");
const fs = require("fs");
const { google } = require('googleapis');

const router = express.Router();

router.get("/criar", async (req, res) => {

    try {

        const nomeArquivo = "arquivo-teste-API";

        fs.writeFileSync(nomeArquivo, JSON.stringify(
            {
               nome: "TESTE de arquivo",
               enunciado: "TESTE de enunciado",   
            }
        ));

        const drive = google.drive('v3');

        const response = await drive.files.create({

            resource: {
                name: nomeArquivo,
                parents: "/TESTE-helena", // Define a pasta pai onde o arquivo será criado
            },

            media: {
                mimeType: 'application/json',
                body: fs.createReadStream(nomeArquivo), // Lê o arquivo local
            },

            fields: 'id', // Solicita apenas o ID do novo arquivo
        });

        const novoArquivo = response.data;
        
        console.log(`Arquivo '${nomeArquivo}' criado com sucesso no Google Drive. ID: ${novoArquivo.id}`);
    
        // Exclua o arquivo local após o upload bem-sucedido
        fs.unlinkSync(nomeArquivo);

        res.status(200).send(novoArquivo.id);

    } catch (erro) {

        res.status(500).send("Erro ao criar arquivo: " + erro.message);
    }

});

module.exports = router;