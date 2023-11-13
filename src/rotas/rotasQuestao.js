const express = require("express");
const fs = require("fs");
const Questao = require("../modelos/Questao");
const middlewareDrive = require('../middleware/middlewareDrive');
const { lerUmDiretorio } = require("./rotasDiretorio");

const router = express.Router();

router.use(middlewareDrive);

router.use(express.json()); //setando analise de requisiçoes padra Json

const criarUmaQuestao = async (req, res) => {

    try {
        const drive = req.drive;
        //monta objeto questao
        const questao = new Questao("1", req.body.titulo, req.body.enunciado, req.body.imagem);
    
        //cria arquivo com o id correspondente
        fs.writeFileSync(questao.id, JSON.stringify(questao));

        const response = await drive.files.create({

            resource: {
                name: `${questao.id} - ${questao.titulo}`, // Define o nome do arquivo
                parents: [req.body.diretorio]
            },

            media: {
                mimeType: 'application/json',
                body: fs.createReadStream(questao.id), // Lê o arquivo local
            },

            fields: 'id', // Solicita apenas o ID do novo arquivo
        });

        const novoArquivo = response.data; // recupera os dados da resposta
            
        // Exclui o arquivo local após o upload bem-sucedido
        fs.unlinkSync(questao.id);

        res.status(200).send(novoArquivo.id);

    } catch (erro) {

        res.status(500).send("Erro ao criar arquivo: " + erro.message);
    }

}

const lerVariasQuestoes = async (req, res) => {

    try {
        const drive = req.drive;
        // Obtém o ID da pasta 
        const questoes = await drive.files.list({
            q: `'${req.query.pai}' in parents and mimeType='application/json' and trashed=false`,
            fields: 'files(name, id)',
            orderBy: 'createdTime asc'
        });
        
        if (questoes.data.files.length === 0) {
            res.status(404).send(`questoes nao encontradas`);
            return;
        }

        const questoessNomes = JSON.stringify(questoes.data.files);

        res.status(200).send(questoessNomes);

    } catch (erro) {

        res.status(500).send("Erro ao recuperar pastas: " + erro.message);
    }

}

router.post("/criar", criarUmaQuestao);

router.get("/ler", lerVariasQuestoes);

module.exports = {
    router, 
    criarUmaQuestao
};