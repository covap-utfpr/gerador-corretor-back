const express = require("express");
const fs = require("fs");
const Questao = require("../modelos/Questao");
const middlewareDrive = require('../middleware/middlewareDrive');
const { lerUmDiretorio } = require("./rotasDiretorio");
const ServerException = require("../utils/ServerException");

const router = express.Router();

router.use(middlewareDrive);

router.use(express.json()); //setando analise de requisiçoes padra Json


const criarUmaQuestao = async (disciplina, titulo, enunciado, imagem, drive) => {
    
    let idDiretorioQuestoes;
    //obtendo id do diretorio de questoes
    try {

        idDiretorioQuestoes = await lerUmDiretorio("Questoes", disciplina, drive);

    } catch(erro) {

        throw new ServerException(erro.message, erro.code);
    }
    //monta objeto questao
    const questao = new Questao("1", titulo, enunciado, imagem);

    //cria arquivo com o id correspondente
    fs.writeFileSync(questao.id, JSON.stringify(questao));

    let response;

    try {

        response = await drive.files.create({

            resource: {
                name: `${questao.id} - ${questao.titulo}`, // Define o nome do arquivo
                parents: [ idDiretorioQuestoes ]
            },
    
            media: {
                mimeType: 'application/json',
                body: fs.createReadStream(questao.id), // Lê o arquivo local
            },
    
            fields: 'id', // Solicita apenas o ID do novo arquivo
        });

    } catch (erro) {

        throw new ServerException(erro.message, 500);
    }

    // Exclui o arquivo local após o upload bem-sucedido
    fs.unlinkSync(questao.id);

    if(response.status == 200) {
        return response.data.id; 
    }

    throw new ServerException("Erro ao criar questao", 500);
}


const lerVariasQuestoes = async (disciplina, diretorioRaiz, drive) => {

    //obtendo id do diretorio de questoes
    let idDisciplina;

    try {

        idDisciplina = await lerUmDiretorio(disciplina, diretorioRaiz,  drive);  

    } catch (erro) {

        throw new ServerException("Diretorio inxistente", 400);
    }

    const idDiretorioQuestoes = await lerUmDiretorio("Questoes", idDisciplina, drive);
   
    let response;
    
    try {

        response = await drive.files.list({
            q: `'${idDiretorioQuestoes}' in parents and mimeType='application/json' and trashed=false`,
            fields: 'files(name, id)',
            orderBy: 'createdTime asc'
        });  

    } catch (erro) {
        
        throw new ServerException(erro.message, 500);
    }

    if(response.data.files.length == 0) {

        throw new ServerException("Sem questoes", 400);
    } 
    
    if(response.status == 200) {

        const listaQuestoes = JSON.stringify(response.data.files);
        return listaQuestoes;
    } 

    throw new ServerException("Erro ao recuperar questoes", 500);
}


router.post("/criar",  async (req, res) => {

    try {
    
        const idQuestao = await criarUmaQuestao( req.body.disciplina, req.body.titulo, req.body.enunciado, req.body.imagem, req.drive);

        res.status(200).send(idQuestao);

    } catch (erro) {
        
        res.status(erro.code).send(erro.message);
    }
});


router.get("/ler",  async (req, res) => { 

    try {
    
        const listaQuestoes = await lerVariasQuestoes( req.query.disciplina, req.query.diretorioRaiz, req.drive);

        res.status(200).send(listaQuestoes);

    } catch (erro) {

        res.status(erro.code).send(erro.message);
    }
});


module.exports = {
    router, 
    criarUmaQuestao,
    lerVariasQuestoes
};