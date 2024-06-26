const express = require("express");
const middlewareDrive = require('../middleware/middlewareDrive');
const ServerException = require('../utils/ServerException');
const { InterfaceDiretorio } = require("../interfaces");
const deletar = require('../rotas/rotasGerais');
class RotasDiretorio extends InterfaceDiretorio {

    constructor() {
        
        super();

        this.router = express.Router();
        this.router.use(middlewareDrive);
        this.router.use(express.json()); 

        const criar = this.criar; 
        const ler = this.ler; 
        const lerUm = this.lerUm; 
        const deletar = this.deletar;
        
        this.router[criar.requestType](criar.subrota, async (req, res) => {
            
            try {

                const idDiretorio = await this.criarUmDiretorio(
                                                        req[criar.localParametros][criar.parametros[0]],
                                                        req[criar.localParametros][criar.parametros[1]], 
                                                        req[criar.parametros[2]]
                                                      );
        
                res.status(200).send(idDiretorio);
            
            } catch (erro) {
        
                res.status(erro.status).send(erro.message);    
            }
            
        });
    

        this.router[ler.requestType](ler.subrota,  async (req, res) => {


            
            try {
                const listaDiretorios = await this.lerVariosDiretorios(
                                                            req[ler.localParametros][ler.parametros[0]],
                                                            req[ler.localParametros][ler.parametros[1]], 
                                                            req[ler.localParametros][ler.parametros[2]], 
                                                            req[ler.parametros[3]], 
                                                        );

                res.status(200).send(listaDiretorios);

            } catch (erro) {

                res.status(erro.status).send(erro.message);   
            }
        });

        this.router[lerUm.requestType](lerUm.subrota,  async (req, res) => {

            try {

                const idDiretorio = await this.lerUmDiretorio(
                                                            req.params[lerUm.parametros[0]],
                                                            req[lerUm.localParametros][lerUm.parametros[1]], 
                                                            req[lerUm.parametros[2]], 
                                                        );

                res.status(200).send(idDiretorio);

            } catch (erro) {

                res.status(erro.status).send(erro.message);   
            }
           
        });

        this.router[deletar.requestType](deletar.subrota,  async (req, res) => {
            
            try {

                await this.deletarUmDiretorio(
                                                req.params[deletar.parametros[0]],
                                                req[deletar.localParametros][deletar.parametros[1]], 
                                                req[deletar.parametros[2]], 
                                            );

                res.status(200).send(req.params[deletar.parametros[0]]);

            } catch (erro) {

                res.status(erro.code).send(erro.message);   
            }
           
        });
    }

    criarUmDiretorio = async (nome, IDdiretorioPai, drive) => {

        let response;
        try {
    
            response = await drive.files.create({
    
                resource: {
                    name: nome,
                    mimeType: 'application/vnd.google-apps.folder', 
                    parents: [ IDdiretorioPai ]
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

    lerVariosDiretorios = async (IDdiretorioPai, quantidade, inicial, drive) => {

        // Obtém o ID da pasta 
        let response;
    
        try {
    
            response = await drive.files.list({
                q: `'${IDdiretorioPai}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
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

    lerUmDiretorio = async (nome, IDdiretorioPai, drive) => {
        
        // Obtém o ID da pasta 
        let response;
    
        try {
    
            response = await drive.files.list({
                q: IDdiretorioPai ? `name='${nome}' and '${IDdiretorioPai}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false` 
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

    deletarUmDiretorio = async (id, IDdiretorioPai, drive) => {
        await deletar(id, IDdiretorioPai, drive);
    };
}

module.exports = RotasDiretorio;

