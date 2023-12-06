const express = require("express");
const middlewareDrive = require('../middleware/middlewareDrive');
const ServerException = require('../utils/ServerException');
const router = express.Router();

router.use(middlewareDrive);

router.use(express.json()); //setando analise de requisiçoes para Json

const criarUmDiretorio = async (nome, pai, drive) => {

    let response;
    try {

        response = await drive.files.create({

            resource: {
                name: nome,
                mimeType: 'application/vnd.google-apps.folder', 
                parents: [ pai ]
            },
    
            fields: 'id', 
        });   

    } catch (erro) {

        throw new ServerException(erro.message, 500);
    }
    
    if(response.status == 200) {
        return response.data.id;
    }
    
    throw new ServerException("Erro ao criar questao", 500);
}


const lerVariosDiretorios = async (pai, quantidade, inicial, drive) => {

    // Obtém o ID da pasta 
    let response;

    try {

        response = await drive.files.list({
            q: `'${pai}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            fields: 'files(name, id)',
            orderBy: 'createdTime asc',
            pageSize: quantidade,
            pageToken: inicial ? undefined : ''
        });
          
    } catch (erro) {
        
        throw new ServerException(erro.message, 500);
    }
  
    if(response.data.files.length == 0) {
        
        throw new ServerException("Sem diretorios", 400);
    } 
    
    if(response.status == 200) {

        let listaDiretorios = response.data.files.map((pasta) => {

            return {
                nome: pasta.name,
                id: pasta.id
            }
        });

        listaDiretorios = JSON.stringify(listaDiretorios);

        return listaDiretorios;
    } 

    throw new ServerException("Erro ao recuperar diretorios", 500);
}


const lerUmDiretorio = async (nome, pai, drive) => {
    // Obtém o ID da pasta 
    let response;

    try {

        response = await drive.files.list({
            q: pai ? `name='${nome}' and '${pai}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false` 
                    : `name='${nome}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            fields: 'files(id)'
        });    

    } catch (erro) {

        throw new ServerException(erro.message, 500);
    }
    

    if(response.data.files.length == 0) {

        throw new ServerException("Diretorio Inexistente", 400);
    }

    if(response.status == 200) {
        const diretorioId = response.data.files[0].id;
        return diretorioId;
    } 

    throw new ServerException("Erro ao recuperar diretorio", 500);
}


router.post("/criar", async (req, res) => {
    
    try {

        const idDiretorio = await criarUmDiretorio(req.body.nome, req.body.pai, req.drive);        

        res.status(200).send(idDiretorio);
    
    } catch (erro) {

        res.status(erro.code).send(erro.message);    
    }
    
});


// Definiçao de rotas (tratamento de erro de funçoes)
router.get("/ler", async (req, res) => {
   
    try {

        const listaDiretorios = await lerVariosDiretorios(  req.query.pai, 
                                                            req.query.quantidade, 
                                                            req.query.inicial,
                                                            req.drive
                                                        );
        res.status(200).send(listaDiretorios);
    
   } catch (erro) {

        res.status(erro.code).send(erro.message);   
   }

});


router.get("/ler/:nome", async (req, res) => {
   
    try {

        const idDiretorio = await lerUmDiretorio(req.params.nome, req.query.pai, req.drive);
        res.status(200).send(idDiretorio);
    
   } catch (erro) { 

        res.status(erro.code).send(erro.message);    
   }

});


module.exports = {
    router,
    criarUmDiretorio,
    lerVariosDiretorios,
    lerUmDiretorio
};

