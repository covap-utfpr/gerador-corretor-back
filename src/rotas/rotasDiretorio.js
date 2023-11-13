const express = require("express");
const middlewareDrive = require('../middleware/middlewareDrive');

const router = express.Router();

router.use(middlewareDrive);

router.use(express.json()); //setando analise de requisiçoes para Json

const criarUmDiretorio = async (req, res) => {

    try {
        const drive = req.drive;
        
        const response = await drive.files.create({

            resource: {
                name: req.body.nome,
                mimeType: 'application/vnd.google-apps.folder', 
                parents: [req.body.pai]
            },

            fields: 'id', 
        });
       
        const novoDiretorio = response.data;

        res.status(200).send(novoDiretorio.id);

    } catch (erro) {

        res.status(500).send("Erro ao criar diretorio: " + erro.message);
    }

}

const lerVariosDiretorios = async (req, res) => {

    try {
        const drive = req.drive;
        // Obtém o ID da pasta 
        const diretorios = await drive.files.list({
            q: `'${req.query.pai}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            fields: 'files(name, id)',
            orderBy: 'createdTime asc'
        });
        
        if (diretorios.data.files.length === 0) {
            res.status(404).send(`diretorios nao encontradas`);
            return;
        }

        const diretoriosNomes = JSON.stringify(diretorios.data.files);

        res.status(200).send(diretoriosNomes);

    } catch (erro) {

        res.status(500).send("Erro ao recuperar diretorios: " + erro.message);
    }
}

const lerUmDiretorio = async (req, res) => {

    try {
        const drive = req.drive;
        // Obtém o ID da pasta 
        const diretorio = await drive.files.list({
            q: `name='${req.params.nome}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            fields: 'files(id)'
        });

        if (diretorio.data.files.length === 0) {
            res.status(404).send(`Diretorio '${req.params.nome}' não encontrada.`);
            return;
        }

        const diretorioId = diretorio.data.files[0].id;
        res.status(200).send(diretorioId);

    } catch (erro) {

        res.status(500).send("Erro ao recuperar diretorio: " + erro.message);
    }
}

router.post("/criar", criarUmDiretorio);

router.get("/ler", lerVariosDiretorios);

router.get("/ler/:nome", lerUmDiretorio);

module.exports = {
    router,
    criarUmDiretorio,
    lerVariosDiretorios,
    lerUmDiretorio
};

