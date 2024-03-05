const express = require("express");
const fs = require("fs");
const Questao = require("../modelos/Questao");
const middlewareDrive = require('../middleware/middlewareDrive');
const { lerUmDiretorio } = require("./rotasDiretorio");
const ServerException = require("../utils/ServerException");

const router = express.Router();

router.use(middlewareDrive);

router.use(express.json()); //setando analise de requisiçoes padra Json


const criarUmaQuestao = async (questao, drive) => {

    const { idDisciplina, titulo, enunciado, alternativas, imagem, correta } = questao;

    let idDiretorioQuestoes;
    //obtendo id do diretorio de questoes
    try {

        idDiretorioQuestoes = await lerUmDiretorio("Questoes", idDisciplina, drive);

    } catch(erro) {

        throw new ServerException(erro.message, erro.code);
    }

    //cria arquivo com o id correspondente
    fs.writeFileSync(titulo, JSON.stringify(questao));

    let response;
   
    try {

        response = await drive.files.create({

            resource: {
                name: `${titulo}`, // Define o nome do arquivo
                parents: [ idDiretorioQuestoes ]
            },
    
            media: {
                mimeType: 'application/json',
                body: fs.createReadStream(titulo), // Lê o arquivo local
            },
    
            fields: 'id', // Solicita apenas o ID do novo arquivo
        });

    } catch (erro) {

        throw new ServerException(erro.message, 500);
    }

    // Exclui o arquivo local após o upload bem-sucedido
    fs.unlinkSync(titulo);

    if(response.status == 200) {
        return response.data.id; 
    }

    throw new ServerException("Erro ao criar questao", 500);
}


const lerVariasQuestoes = async (idDisciplina, quantidade, inicial, drive) => {

    const idDiretorioQuestoes = await lerUmDiretorio("Questoes", idDisciplina, drive);

    let response;
    
    try {

        response = await drive.files.list({
            q: `'${idDiretorioQuestoes}' in parents and mimeType='application/json' and trashed=false`,
            fields: 'files(name, id)', 
            orderBy: 'createdTime asc',
            pageSize: quantidade,
            pageToken: inicial ? undefined : ''
        });       

    } catch (erro) {
        throw new ServerException(erro.message, 500);
    }
    
    if(response.data.files.length == 0) {
        

        throw new ServerException("Sem questoes", 400);
    } 
    
    if(response.status == 200) {

        let lista = response.data.files.map((questao) => {

            return {
                nome: questao.name,
                id: questao.id
            }
        });

        const listaQuestoes = JSON.stringify(lista);
        return listaQuestoes;
    } 

    throw new ServerException("Erro ao recuperar questoes", 500);
}


router.post("/criar",  async (req, res) => {

    try {
    
        const idQuestao = await criarUmaQuestao(    req.body.questao,
                                                    req.drive
                                                );

        res.status(200).send(idQuestao);

    } catch (erro) {
        
        res.status(erro.code).send(erro.message);
    }
});


router.get("/ler",  async (req, res) => { 

    try {
        const listaQuestoes = await lerVariasQuestoes(  req.query.idDisciplina, 
                                                        req.query.quantidade, 
                                                        req.query.inicial,
                                                        req.drive
                                                    );

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