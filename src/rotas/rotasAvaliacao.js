const express = require("express");
const fs = require("fs");
const middlewareDrive = require('../middleware/middlewareDrive');
const { lerUmDiretorio } = require("./rotasDiretorio");
const ServerException = require("../utils/ServerException");
const Avaliacao = require("../modelos/Avaliacao");
const { lerUmaQuestao } = require("./rotasQuestao");

const router = express.Router();

router.use(middlewareDrive);

router.use(express.json()); //setando analise de requisiçoes padra Json

const criarUmaAvaliacao = async (avaliacao, drive) => {

    const { questoes, cabecalho, configuracoes } = avaliacao;

    console.log(avaliacao)
    let idDiretorioAvaliacoes;

    //obtendo id do diretorio de Avaliacoes
    try {

        idDiretorioAvaliacoes = await lerUmDiretorio("Avaliacoes", cabecalho.disciplina, drive);

    } catch(erro) {

        throw new ServerException(erro.message, erro.code);
    }

    try {
        
        const listaQuestoes = await Promise.all(questoes.map( async (questao) => {
            const questaoRetornada = await lerUmaQuestao(questao.idQuestao, drive);
            return questaoRetornada;
        }));

        console.log(listaQuestoes)
        avaliacao.questoes = listaQuestoes;

    } catch (erro) {

        throw new ServerException(erro.message, erro.code);
    }

    //cria arquivo com o id correspondente

    fs.writeFileSync(cabecalho.titulo, JSON.stringify(avaliacao, null, '\t' ));

    let response;

    try {

        response = await drive.files.create({

            resource: {
                name: `${cabecalho.titulo}`, // Define o nome do arquivo
                parents: [ idDiretorioAvaliacoes ]
            },
    
            media: {
                mimeType: 'application/json',
                body: fs.createReadStream(cabecalho.titulo), // Lê o arquivo local
            },
    
            fields: 'id', // Solicita apenas o ID do novo arquivo
        });

    } catch (erro) {

        throw new ServerException(erro.message, 500);
    }

    // Exclui o arquivo local após o upload bem-sucedido
    fs.unlinkSync(cabecalho.titulo);

    if(response.status == 200) {
        return response.data.id; 
    }

    throw new ServerException("Erro ao criar avaliacao", 500);
}


const lerVariasAvaliacoes = async (idDisciplina, quantidade, inicial, drive) => {

    const idDiretorioAvaliacoes = await lerUmDiretorio("Avaliacoes", idDisciplina, drive);

    let response;
    
    try {

        response = await drive.files.list({
            q: `'${idDiretorioAvaliacoes}' in parents and mimeType='application/json' and trashed=false`,
            fields: 'files(name, id)', 
            orderBy: 'createdTime asc',
            pageSize: quantidade,
            pageToken: inicial ? undefined : ''
        });       

    } catch (erro) {
        throw new ServerException(erro.message, 500);
    }
    
    if(response.data.files.length == 0) {
        

        throw new ServerException("Sem avaliacoes", 400);
    } 
    
    if(response.status == 200) {

        let lista = response.data.files.map((avaliacao) => {

            return {
                nome: avaliacao.name,
                id: avaliacao.id
            }
        });

        const listaAvalicoes = JSON.stringify(lista);
        return listaAvalicoes;
    } 

    throw new ServerException("Erro ao recuperar avaliacoes", 500);
}


router.post("/criar",  async (req, res) => {

    try {
       
        const idAvaliacao = await criarUmaAvaliacao(    
                                                        req.body.avaliacao,
                                                        req.drive
                                                    );

        res.status(200).send(idAvaliacao);

    } catch (erro) {
        
        res.status(erro.code).send(erro.message);
    }
});

router.get("/ler",  async (req, res) => { 

    try {
        const listaAvalicoes = await lerVariasAvaliacoes(  req.query.idDisciplina, 
                                                        req.query.quantidade, 
                                                        req.query.inicial,
                                                        req.drive
                                                    );

        res.status(200).send(listaAvalicoes);

    } catch (erro) {

        res.status(erro.code).send(erro.message);
    }
});



module.exports = {
    router, 
    criarUmaAvaliacao,
    lerVariasAvaliacoes,
};