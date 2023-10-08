//Deinindo Endpoints - crud no Drive
const express = require("express");
const { google } = require('googleapis');

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

router.get("/login", (req, res) => {

    try {

        const scopes = [
            'https://www.googleapis.com/auth/drive.file'
        ];
    
        const authorizationUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true
        });

        res.redirect(authorizationUrl);

    } catch(erro) {

        console.error("Erro de redirecionamento: " + erro.message);
    }

});

router.get("/login/callback", async (req,res) => {

    try {

        if (!oauth2Client) {
            throw new Error("Cliente oAuth nao foi gerado.");
        }

        const code = req.query.code;

        const { tokens } = await oauth2Client.getToken(code);
      
        oauth2Client.setCredentials(tokens);

        google.options({
            auth: oauth2Client
        })

        req.session.autenticado = true;

        res.redirect("/");
    
    } catch (erro) {

        res.status(500).send("Erro ao autenticar: " + erro.message);
    }
});

module.exports = router;