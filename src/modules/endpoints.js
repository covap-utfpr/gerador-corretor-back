//Deinindo Endpoints - crud no Drive

const express = require("express");
const {google} = require('googleapis');

const app = express();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);



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
        const drive = google.drive({ version:'v3', auth:oauth2Client });

        const response = await drive.files.create({

            resource: {
                name: "Banco Gerador",
                mimeType: 'application/vnd.google-apps.folder', 
            },
            fields: 'id', 
        });

        const novaPasta = response.data;

        res.status(200).send(novaPasta.id);

    } catch (erro) {

        res.status(500).send("Erro ao criar subpasta: " + erro.message);
    }

});

app.get("/pastas", async (req, res) => {

    try {
        const drive = google.drive({ version:'v3', auth:oauth2Client });

        const response = await drive.files.create({

            resource: {
                name: "teste-gerador",
                mimeType: 'application/vnd.google-apps.folder', 
            },
            fields: 'id', 
        });

        const novaPasta = response.data;

        res.status(200).send(novaPasta.id);

    } catch (erro) {

        res.status(500).send("Erro ao criar subpasta: " + erro.message);
    }

});

const port = 8080;

app.listen(port, () => {console.log(`Rodando na porta ${port}`)});