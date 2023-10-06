//Deinindo Endpoints - crud no Drive

const express = require("express");
const fs = require('fs');
const {google} = require('googleapis');

const app = express();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

let diretorioDriveId;

app.get("/", (req, res) => {

    try {
        const scopes = [
            'https://www.googleapis.com/auth/drive.file'
        ];
    
        const authorizationUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true
        });
        console.log(authorizationUrl);

        res.redirect(authorizationUrl);

    } catch(erro) {

        console.error("Erro de redirecionamento: " + erro);
    }

});

app.get("/autenticar", async (req,res) => {

    try {

        const url = require('url');

        let q = url.parse(req.url, true).query;

        let { tokens } = await oauth2Client.getToken(q.code);

        oauth2Client.setCredentials(tokens);

        res.status(200).send("Autenticado com sucesso!");
    
    } catch (erro ){

        res.status(500).send("Erro ao autenticar: " + erro);
    }
});

app.get("/pastas", async (req, res) => {

    try {
        if (diretorioDriveId) {
            throw new Error("Diretorio ja existe no drive!");
        }
        const drive = google.drive({ version:'v3', auth:oauth2Client });

        const response = await drive.files.create({

            resource: {
                name: "teste-gerador",
                mimeType: 'application/vnd.google-apps.folder', 
            },
            fields: 'id', 
        });

        const novaPasta = response.data;

        diretorioDriveId = novaPasta.id;

        res.status(200).send(novaPasta.id);

    } catch (erro) {

        res.status(500).send("Erro ao criar subpasta: " + erro.message);
    }

});

app.get("/criar-questao", async (req, res) => {

    try {

        const nomeArquivo = "questao1.json";

        fs.writeFileSync(nomeArquivo, JSON.stringify(
            {
               nome: "questao1",
               enunciado: "hduoh2i32hdip2jd23", 
            }
        ));

        const drive = google.drive({ version:'v3', auth:oauth2Client });

        const response = await drive.files.create({

            resource: {
                name: nomeArquivo,
                parents: diretorioDriveId, // Define a pasta pai onde o arquivo será criado
            },
            media: {
                mimeType: 'application/json',
                body: fs.createReadStream(nomeArquivo), // Lê o arquivo local
            },
            fields: 'id', // Solicita apenas o ID do novo arquivo
        });

        const novoArquivo = response.data;
        
        console.log(`Arquivo '${nomeArquivo}' criado com sucesso no Google Drive. ID: ${novoArquivo.id}`);
    
        // Exclua o arquivo local após o upload bem-sucedido
        fs.unlinkSync(nomeArquivo);

        res.status(200).send(novoArquivo.id);

    } catch (erro) {

        res.status(500).send("Erro ao criar arquivo: " + erro.message);
    }

});



const port = 8080;

app.listen(port, () => {console.log(`Rodando na porta ${port}`)});