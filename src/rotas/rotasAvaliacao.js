const express = require("express");
const fs = require("fs");
const middlewareDrive = require('../middleware/middlewareDrive');
const { lerUmDiretorio } = require("./rotasDiretorio");
const ServerException = require("../utils/ServerException");
const Avaliacao = require("../modelos/Avaliacao");

const router = express.Router();

router.use(middlewareDrive);

router.use(express.json()); //setando analise de requisiçoes padra Json

const criarUmaAvaliacao = async (cabecalho, configuracoes, questoes, drive) => {

    let idDiretorioAvaliacoes;
    //obtendo id do diretorio de Avaliacoes
    try {

        idDiretorioAvaliacoes = await lerUmDiretorio("Avaliacoes", cabecalho.disciplina, drive);

    } catch(erro) {

        throw new ServerException(erro.message, erro.code);
    }
    //monta objeto questao
    const avaliacao = new Avaliacao(cabecalho.tipo, cabecalho.titulo, cabecalho.imagem, cabecalho.data, cabecalho.instituicao, questoes);
    console.log("aqui" + cabecalho.titulo)
    //cria arquivo com o id correspondente
    fs.writeFileSync(avaliacao.titulo, JSON.stringify(avaliacao));
    let response;

    try {

        response = await drive.files.create({

            resource: {
                name: `${avaliacao.titulo}`, // Define o nome do arquivo
                parents: [ idDiretorioAvaliacoes ]
            },
    
            media: {
                mimeType: 'application/json',
                body: fs.createReadStream(avaliacao.titulo), // Lê o arquivo local
            },
    
            fields: 'id', // Solicita apenas o ID do novo arquivo
        });

    } catch (erro) {

        throw new ServerException(erro.message, 500);
    }

    // Exclui o arquivo local após o upload bem-sucedido
    fs.unlinkSync(avaliacao.titulo);

    if(response.status == 200) {
        return response.data.id; 
    }

    throw new ServerException("Erro ao criar avaliacao", 500);
}


// const lerVariasAvaliacoes = async (disciplina, diretorioRaiz, drive) => {

//     //obtendo id do diretorio de questoes
//     let idDisciplina;

//     try {

//         idDisciplina = await lerUmDiretorio(disciplina, diretorioRaiz,  drive);  

//     } catch (erro) {

//         throw new ServerException("Diretorio inxistente", 400);
//     }

//     const idDiretorioQuestoes = await lerUmDiretorio("Questoes", idDisciplina, drive);
   
//     let response;
    
//     try {

//         response = await drive.files.list({
//             q: `'${idDiretorioQuestoes}' in parents and mimeType='application/json' and trashed=false`,
//             fields: 'files(name, id)',
//             orderBy: 'createdTime asc'
//         });  

//     } catch (erro) {
        
//         throw new ServerException(erro.message, 500);
//     }

//     if(response.data.files.length == 0) {

//         throw new ServerException("Sem questoes", 400);
//     } 
    
//     if(response.status == 200) {

//         const listaQuestoes = JSON.stringify(response.data.files);
//         return listaQuestoes;
//     } 

//     throw new ServerException("Erro ao recuperar questoes", 500);
// }


router.post("/criar",  async (req, res) => {

    try {
       
        const idAvaliacao = await criarUmaAvaliacao(    req.body.cabecalho,
                                                        req.body.configuracoes, 
                                                        req.body.questoes,
                                                        req.drive
                                                    );

        res.status(200).send(idAvaliacao);

    } catch (erro) {
        
        res.status(erro.code).send(erro.message);
    }
});



module.exports = {
    router, 
    criarUmaAvaliacao,
};