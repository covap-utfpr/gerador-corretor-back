const express = require("express");
const { google } = require('googleapis');

const router = express.Router();

// rota para criar um novo diretorio
router.get("/criar", async (req, res) => {

    try {
        
        const drive = google.drive('v3');

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

module.exports = router;

