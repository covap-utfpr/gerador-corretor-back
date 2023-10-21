const express = require("express");
const fs = require("fs");
const Questao = require("../modelos/Questao");
const middlewareDrive = require('../middleware/middlewareDrive');
const { google } = require('googleapis');

const router = express.Router();

router.use(middlewareDrive);

router.use(express.json()); //setando analise de requisiçoes padra Json

router.post("/criar", async (req, res) => {

    try {
        const drive = req.drive;
        //monta objeto questao
        const questao = new Questao("1", req.body.titulo, req.body.enunciado, req.body.imagem);
    
        //cria arquivo com o id correspondente
        fs.writeFileSync(questao.id, JSON.stringify(questao));

        const response = await drive.files.create({

            resource: {
                name: questao.id, // Define o nome do arquivo
                parents: [req.body.diretorio]
            },

            media: {
                mimeType: 'application/json',
                body: fs.createReadStream(questao.id), // Lê o arquivo local
            },

            fields: 'id', // Solicita apenas o ID do novo arquivo
        });

        const novoArquivo = response.data; // recupera os dados da resposta
        
        console.log(`Arquivo '${questao.titulo}' criado com sucesso no Google Drive. ID: ${novoArquivo.id}`);
    
        // Exclui o arquivo local após o upload bem-sucedido
        fs.unlinkSync(questao.id);

        res.status(200).send(novoArquivo.id);

    } catch (erro) {

        res.status(500).send("Erro ao criar arquivo: " + erro.message);
    }

});

module.exports = router;