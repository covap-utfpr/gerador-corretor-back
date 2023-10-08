const express = require("express");
const { google } = require('googleapis');

const router = express.Router();

const drive = google.drive('v3');

router.use(express.json());

// rota para criar um novo diretorio
router.get("/criar", async (req, res) => {

    try {
        
        const response = await drive.files.create({

            resource: {
                name: "TESTE-helena",
                mimeType: 'application/vnd.google-apps.folder', 
            },
            fields: 'id', 
        });

        const novaPasta = response.data;

        res.status(200).send(novaPasta.id);

    } catch (erro) {

        res.status(500).send("Erro ao criar pasta: " + erro.message);
    }

});

// rota para recuperar diretorio raiz
router.get("/ler/:nome", async (req, res) => {

    try {
        
        // Obtém o ID da pasta 
        const pasta = await drive.files.list({
            q: `name='${req.params.nome}' and mimeType='application/vnd.google-apps.folder'`,
            fields: 'files(id)'
        });

        if (pasta.data.files.length === 0) {
            res.status(404).send(`Pasta '${req.params.nome}' não encontrada.`);
            return;
        }

        const pastaId = pasta.data.files[0].id;

        res.status(200).send(pastaId);

    } catch (erro) {

        res.status(500).send("Erro ao recuperar pasta: " + erro.message);
    }

});

module.exports = router;

