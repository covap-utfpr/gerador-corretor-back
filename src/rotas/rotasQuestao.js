const express = require("express");
const fs = require("fs");
const Questao = require("../modelos/Questao");
const middlewareDrive = require('../middleware/middlewareDrive');
const { lerUmDiretorio } = require("./rotasDiretorio");

const router = express.Router();

router.use(middlewareDrive);

router.use(express.json()); //setando analise de requisiçoes padra Json

const criarUmaQuestao = async (disciplina, titulo, enunciado, imagem, drive) => {
    console.log(disciplina)
    //obtendo id do diretorio de questoes
    const idDiretorioQuestoes = await lerUmDiretorio("Questoes", disciplina, drive);

    //monta objeto questao
    const questao = new Questao("1", titulo, enunciado, imagem);

    //cria arquivo com o id correspondente
    fs.writeFileSync(questao.id, JSON.stringify(questao));

    const response = await drive.files.create({

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

    // Exclui o arquivo local após o upload bem-sucedido
    fs.unlinkSync(questao.id);

    if(response.status == 200) {
        return response.data.id; 
    }

    throw new Error(+response.status)
}


router.post("/criar",  async (req, res) => {

    try {
    
        const idQuestao = criarUmaQuestao( req.body.disciplina, req.body.titulo, req.body.enunciado, req.body.imagem, req.drive);
        
        res.status(200).send(idQuestao);

    } catch (erro) {
        
        res.status(erro.message).send("Erro ao criar questao");
    }
} );

module.exports = {
    router, 
    criarUmaQuestao
};