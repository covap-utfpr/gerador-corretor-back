const express = require("express");
const fs = require("fs");
const middlewareDrive = require('../middleware/middlewareDrive');
const ServerException = require("../utils/ServerException");
const Test = require("../modelos/Test");
const QuestionRoutes = require("./QuestionRoutes");
const DirectoryRoutes = require("./DirectoryRoutes");
const { TestInterface } = require("../interfaces");

class TestRoutes extends TestInterface {

    questionObj;
    directoryObj;

    constructor() {
        super();

        this.router = express.Router();
        this.router.use(middlewareDrive);
        this.router.use(express.json());

        this.questionObj = new QuestionRoutes();
        this.directoryObj = new DirectoryRoutes();

        this.setupRoute(this.create, this.createTest.bind(this));
        this.setupRoute(this.read, this.readMultipleTests.bind(this));
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

    async createTest(questions, header, configs, drive) {
        const test = new Test(questions, header, configs);

        let testDirectoryId;

        try {
            testDirectoryId = await this.directoryObj.lerUmDiretorio("Tests", header.subject, drive);
        } catch (error) {
            throw new ServerException(error.message, error.code);
        }

        try {
            const questionList = await Promise.all(questions.map(async (question) => {
                const returnedQuestion = await this.questionObj.lerUmaQuestao(question.idQuestion, drive);
                return returnedQuestion;
            }));

            test.questions = questionList;
        } catch (error) {
            throw new ServerException(error.message, error.code);
        }

        const fileName = header.title.replace(/[^\w\-_.]/g, '');

        fs.writeFileSync(fileName, JSON.stringify(test, null, '\t'));

        let response;

        try {
            response = await drive.files.create({
                resource: {
                    name: `${fileName}`,
                    parents: [testDirectoryId]
                },
                media: {
                    mimeType: 'application/json',
                    body: fs.createReadStream(fileName),
                },
                fields: 'id',
            });
        } catch (error) {
            throw new ServerException(error.message, 500);
        }

        fs.unlinkSync(fileName);

        if (response.status == 200) {
            return response.data.id;
        }

        throw new ServerException("Error creating test", 500);
    }

    async readMultipleTests(parent, qnt, start, drive) {
        const testDirectoryId = await this.directoryObj.lerUmDiretorio("Tests", parent, drive);

        let response;

        try {
            response = await drive.files.list({
                q: `'${testDirectoryId}' in parents and mimeType='application/json' and trashed=false`,
                fields: 'files(name, id)',
                orderBy: 'createdTime asc',
                pageSize: qnt,
                pageToken: start ? undefined : ''
            });
        } catch (error) {
            throw new ServerException(error.message, 500);
        }

        if (response.data.files.length == 0) {
            throw new ServerException("No tests", 400);
        }

        if (response.status == 200) {
            let list = response.data.files.map((test) => {
                return {
                    name: test.name,
                    id: test.id
                }
            });

            const testList = JSON.stringify(list);
            return testList;
        }

        throw new ServerException("Error retrieving tests", 500);
    }
}

module.exports = TestRoutes;
