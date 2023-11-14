const express = require("express");
const middlewareDrive = require('../middleware/middlewareDrive');

const router = express.Router();

router.use(middlewareDrive);

router.use(express.json()); //setando analise de requisiçoes para Json

const criarUmDiretorio = async (nome, pai, drive) => {
         
    const response = await drive.files.create({

        resource: {
            name: nome,
            mimeType: 'application/vnd.google-apps.folder', 
            parents: [ pai ]
        },

        fields: 'id', 
    });
    
    if(response.status == 200) {
        return response.data.id;
    }

    throw new Error(+response.status);
}

const lerVariosDiretorios = async (pai, drive) => {

    // Obtém o ID da pasta 
    const response = await drive.files.list({
        q: `'${pai}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(name, id)',
        orderBy: 'createdTime asc'
    });

    if(response.data.files.length == 0) {

        throw new Error(400);
    }
    
    if(response.status == 200) {

        const listaDiretorios = JSON.stringify(response.data.files);
        return listaDiretorios;
    } 

    throw new Error(+response.status);
}

const lerUmDiretorio = async (nome, pai, drive) => {
    // Obtém o ID da pasta 

    const response = await drive.files.list({
        q: pai ? `name='${nome}' and '${pai}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false` : `name='${nome}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id)'
    });

    if(response.data.files.length == 0) {
        throw new Error(400);
    }

    if(response.status == 200) {
        const diretorioId = response.data.files[0].id;
        return diretorioId;
    } 

    throw new Error(+response.status);
}

router.post("/criar", async (req, res) => {
    
    try {

        const idDiretorio = await criarUmDiretorio(req.body.nome, req.body.pai, req.drive);        

        res.status(200).send(idDiretorio);
    
    } catch (erro) {

        res.status(erro.message).send("Erro ao criar diretorio");    
    }
    
});

// Definiçao de rotas (tratamento de erro de funçoes)

router.get("/ler", async (req, res) => {
   
    try {

        const listaDiretorios = await lerVariosDiretorios(req.query.pai, req.drive);

        res.status(200).send(listaDiretorios);
    
   } catch (erro) {
        
        res.status(erro.message).send("Erro ao ler diretorios");    
   }

});

router.get("/ler/:nome", async (req, res) => {
   
    try {

        const idDiretorio = await lerUmDiretorio(req.params.nome, req.query.pai, req.drive);
        res.status(200).send(idDiretorio);
    
   } catch (erro) { 

    res.status(erro.message).send("Erro ao ler diretorio ");    
   }

});

module.exports = {
    router,
    criarUmDiretorio,
    lerVariosDiretorios,
    lerUmDiretorio
};

