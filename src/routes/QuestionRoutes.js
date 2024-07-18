const express = require("express");
const fs = require("fs");
const middlewareDrive = require('../middleware/middlewareDrive');
const Question = require("../modelos/Question");
const ServerException = require("../utils/ServerException");
const DirectoryRoutes = require("./DirectoryRoutes");
const { QuestionInterface } = require("../interfaces");
const deleteOne = require("./globalRoutes");

class QuestionRoutes extends QuestionInterface {
    
    directoryObj;

    constructor() {
        super();

        this.router = express.Router();
        this.router.use(middlewareDrive);
        this.router.use(express.json());

        this.directoryObj = new DirectoryRoutes();

        this.setupRoute(this.create, this.createOneQuestion);
        this.setupRoute(this.read, this.readMultipleQuestions);
        this.setupRoute(this.readOne, this.readOneQuestion);
        this.setupRoute(this.edit, this.editOneQuestion);
        this.setupRoute(this.delete, this.deleteOneQuestion);
    }

    setupRoute(routeConfig, handlerFunction) {
        const { requestType, subroute, params } = routeConfig;
        
        this.router[requestType](subroute, async (req, res) => {
            try {
                const args = this.collectParams(req, params);
                args.push(req.drive); // Add drive to the end of the arguments list
                const result = await handlerFunction(...args);
                res.status(200).send(result);
            } catch (error) {
                res.status(error.status || 500).send(error.message);
            }
        });
    }

    collectParams(req, params) {
        let args = [];
        for (const source in params) {
            const keys = params[source];
            for (const key of keys) {
                args.push(req[source][key]);
            }
        }
        return args;
    }

    async createOneQuestion(subject, title, stem, alternatives, picture, correct, parent, drive) {
        
        const question = new Question(title, stem, alternatives, picture, correct);

        let questionDirectoryId;
    
        try {
            questionDirectoryId = await this.directoryObj.lerUmDiretorio("Questoes", parent, drive);
        } catch (error) {
            throw new ServerException(error.message, error.code);
        }
    
        fs.writeFileSync(title, JSON.stringify(question, null, '\t'));
    
        let response;
       
        try {
            response = await drive.files.create({
                resource: {
                    name: `${title}`, // Define o nome do arquivo
                    parents: [ questionDirectoryId ]
                },
                media: {
                    mimeType: 'application/json',
                    body: fs.createReadStream(title), // Lê o arquivo local
                },
                fields: 'id', // Solicita apenas o ID do novo arquivo
            });
        } catch (error) {
            throw new ServerException(error.message, 500);
        }
    
        fs.unlinkSync(title);
    
        if (response.status == 200) {
            return response.data.id; 
        }
    
        throw new ServerException("Erro ao criar questao", 500);
    }
    
    async readMultipleQuestions(parent, qnt, start, drive) {
       
        const questionDirectoryId = await this.directoryObj.lerUmDiretorio("Questoes", parent, drive);

        let response;
        
        try {
            response = await drive.files.list({
                q: `'${questionDirectoryId}' in parents and mimeType='application/json' and trashed=false`,
                fields: 'files(name, id)', 
                orderBy: 'createdTime asc',
                pageSize: qnt,
                pageToken: start ? undefined : ''
            });       
        } catch (error) {
            throw new ServerException(error.message, 500);
        }
        
        if (response.data.files.length == 0) {
            throw new ServerException("Sem questoes", 400);
        } 
        
        if (response.status == 200) {
            let list = response.data.files.map((question) => ({
                name: question.name,
                id: question.id
            }));
    
            const questionList = JSON.stringify(list);
            return questionList;
        } 
    
        throw new ServerException("Erro ao recuperar questoes", 500);
    }
    
    async readOneQuestion(id, drive) {
        let response;
        
        try {
            response = await drive.files.get({
                fileId: id,
                alt: 'media',
                q: `trashed=false`
            });       
        } catch (error) {
            throw new ServerException(error.message, 500);
        }
        
        if (response.status == 200) {
            return response.data;
        } 
    
        throw new ServerException("Erro ao recuperar questao", 500);
    }

    async editOneQuestion(id, subject, title, stem, alternatives, picture, correct, parent, drive) {
        const question = new Question(title, stem, alternatives, picture, correct);

        fs.writeFileSync(title, JSON.stringify(question, null, '\t'));

        let response;
       
        try {
            response = await drive.files.update({
                fileId: id,
                resource: {
                    name: `${title}`, // Define o nome do arquivo
                    parents: [ parent ]
                },
                media: {
                    mimeType: 'application/json',
                    body: fs.createReadStream(title), // Lê o arquivo local
                },
                fields: 'id', // Solicita apenas o ID do novo arquivo
            });
        } catch (error) {
            throw new ServerException(error.message, 500);
        }
    
        fs.unlinkSync(title);
    
        if (response.status == 200) {
            return response.data.id; 
        }
    
        throw new ServerException("Erro ao editar questao", 500);
    }

    async deleteOneQuestion(id, drive) {
        await deleteOne(id, drive);
    }
}

module.exports = QuestionRoutes;
