const express = require("express");
const fs = require("fs");
const Questao = require("../modelos/Questao");
const middlewareDrive = require('../middleware/middlewareDrive');
const { lerUmDiretorio } = require("./rotasDiretorio");
const ServerException = require("../utils/ServerException");
const { InterfaceQuestao } = require("../interfaces");
const RotasDiretorio = require("./rotasDiretorio");

class RotasQuestao extends InterfaceQuestao {
    
    diretorioObj;

    constructor() {

        super();

        this.router = express.Router();
        this.router.use(middlewareDrive);
        this.router.use(express.json()); 

        this.diretorioObj = new RotasDiretorio();

        const criar = this.criar; 
        const ler = this.ler; 
        const lerUma = this.lerUma; 
        const deletar = this.deletar;
        
        this.router[criar.requestType](criar.subrota,  async (req, res) => {
            
            try {
    
                const idQuestao = await this.criarUmaQuestao(    
                                                    req[criar.localParametros][criar.parametros[0]],
                                                    req[criar.localParametros][criar.parametros[1]],
                                                    req[criar.localParametros][criar.parametros[2]],
                                                    req[criar.localParametros][criar.parametros[3]],
                                                    req[criar.localParametros][criar.parametros[4]],
                                                    req[criar.localParametros][criar.parametros[5]],
                                                    req[criar.parametros[6]],
                                                );
        
                res.status(200).send(idQuestao);
        
            } catch (erro) {
                
                res.status(erro.status).send(erro.message);
            }
        });

        this.router[ler.requestType](ler.subrota,  async (req, res) => {

            try {
                const listaQuestoes = await this.lerVariasQuestoes(  
                                                        req[ler.localParametros][ler.parametros[0]],
                                                        req[ler.localParametros][ler.parametros[1]],
                                                        req[ler.localParametros][ler.parametros[2]],
                                                        req[ler.parametros[3]],
                                                    );
        
                res.status(200).send(listaQuestoes);
        
            } catch (erro) {
                
        
                res.status(erro.status).send(erro.message);
            }
        });

        this.router[deletar.requestType](deletar.subrota,  async (req, res) => {

            try {
                
                await this.deletarUmaQuestao(
                                                req.params[deletar.parametros[0]],
                                                req[deletar.localParametros][deletar.parametros[1]], 
                                                req[deletar.parametros[2]],  
                )
        
                res.status(200).send(req.params[deletar.parametros[0]]);
        
            } catch (erro) {
                res.status(erro.status).send(erro.message);
            }
        });
    }

    criarUmaQuestao = async (idDisciplina, titulo, enunciado, alternativas, imagem, correta, drive) => {
  
        const questao = new Questao(titulo,enunciado,alternativas,imagem, correta);

        let idDiretorioQuestoes;
    
        try {
    
            idDiretorioQuestoes = await this.diretorioObj.lerUmDiretorio("Questoes", idDisciplina, drive);
    
        } catch(erro) {
    
            throw new ServerException(erro.message, erro.code);
        }
    
        //cria arquivo com o id correspondente
        fs.writeFileSync(titulo, JSON.stringify(questao, null, '\t'));
    
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
    
    
    lerVariasQuestoes = async (idDisciplina, quantidade, inicial, drive) => {

        const idDiretorioQuestoes = await this.diretorioObj.lerUmDiretorio("Questoes", idDisciplina, drive);

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
    
    lerUmaQuestao = async (idQuestao, drive) => {
        console.log()
        let response;
        
        try {
    
            response = await drive.files.get({
                fileId: idQuestao,
                alt: 'media',
                q: `trashed=false`
            });       
    
        } catch (erro) {
    
            throw new ServerException(erro.message, 500);
        }
        
        if(response.status == 200) {
    
            return response.data;
        } 
    
        throw new ServerException("Erro ao recuperar questoes", 500);
    }

    deletarUmaQuestao = async (idQuestao, IDdiretorioPai, drive) => {
        let response;
        
        try {
    
            response = await drive.files.delete({
                fileId: idQuestao,
            });       
    
        } catch (erro) {
    
            throw new ServerException(erro.message, 500);
        }
        
        /*if(response.status == 200) {
    
            return response.data;
        } 
    
        throw new ServerException("Erro ao recuperar questoes", 500);*/
    }
}

module.exports = RotasQuestao;