const express = require("express");
const middlewareDrive = require('../middleware/middlewareDrive');
const ServerException = require('../utils/ServerException');
const { DirectoryInterface } = require("../interfaces");
const deleteOne = require("./globalRoutes");

class DirectoryRoutes extends DirectoryInterface {

    constructor() {
        super();

        this.router = express.Router();
        this.router.use(middlewareDrive);
        this.router.use(express.json());

        this.setupRoute(this.create, this.createOneDirectory);
        this.setupRoute(this.read, this.readMultipleDirectories);
        this.setupRoute(this.readOne, this.readOneDirectory);
        this.setupRoute(this.delete, this.deleteOneDirectory);

    }

    setupRoute = (routeConfig, handlerFunction) => {

        const { requestType, subroute, params } = routeConfig;

        this.router[requestType](subroute, async (req, res) => {
            try {
                const args = this.collectParams(req, params);
                args.push(req.drive);
                const result = await handlerFunction(...args);
                res.status(200).send(result);
            } catch (error) {
                res.status(error.status || 500).send(error.message);
            }
        });
    }
    
    collectParams = (req, params) => {
        let args = []; 
        for (const source in params) {
            const keys = params[source];
            for (const key of keys) {
                args.push(req[source][key]);
            }
        }
        return args;
    }
    
    async createOneDirectory(name, parentId, drive) {
        console.log(name, parentId)
        try {
            const res = await drive.files.create({
                resource: {
                    name,
                    mimeType: 'application/vnd.google-apps.folder', 
                    parents: [parentId]
                },
                fields: 'id'
            });
            if (res.status === 200) {
                return res.data.id;
            }
            throw new ServerException("Erro ao criar questão", 500);
        } catch (error) {
            throw new ServerException(error.message, 500);
        }
    }

    async readMultipleDirectories(parentId, qnt, start, drive) {

        try {

            const res = await drive.files.list({
                q: `'${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
                fields: 'files(name, id)',
                orderBy: 'createdTime asc',
                pageSize: qnt,
                pageToken: start
            });
            
            console.log(res.data.files);
            if (res.data.files.length === 0) {
                throw new ServerException("Sem diretorios", 400);
            }
            if (res.status === 200) {
                return JSON.stringify(res.data.files.map(folder => ({
                    nome: folder.name,
                    id: folder.id
                })));
            }
            throw new ServerException("Erro ao recuperar diretorios", 500);
        } catch (error) {
            throw new ServerException(error.message, 500);
        }
    }

    async readOneDirectory(name, parentId, drive) {

        try {
            const res = await drive.files.list({
                q: parentId 
                    ? `name='${name}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false` 
                    : `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
                fields: 'files(id)'
            });
            
            if (res.data.files.length === 0) {
                throw new ServerException("Diretorio Inexistente", 400);
            }
            if (res.status === 200) {

                return res.data.files[0].id;
            }
            throw new ServerException("Erro ao recuperar diretorio", 500);
        } catch (error) {
            throw new ServerException(error.message, 500);
        }
    }

    async deleteOneDirectory(id, parentId, drive) {
        await deletar(id, parentId, drive);
    }
}

module.exports = DirectoryRoutes;
