//Deinindo Endpoints - crud no Drive
const express = require("express");
const { google } = require('googleapis');

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

const obterUrlAutorizacao = (req, res) => {

    try {

        //definindo escopo de acesso ao drive
        const scopes = [
            'https://www.googleapis.com/auth/drive.file'
        ];
        
        //criar url de dominio do google para o usuario realizar login
        const authorizationUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true
        });
        
        res.status(200).send(authorizationUrl);

    } catch(erro) {

        req.status(400).send("Erro de redirecionamento: " + erro.message);
    }

}

const obterCookieToken = async (req, res) => {

    try {

        // apos realizar login com google, usuario retorna para esta url que tem 
        //parametros fornecidos pelo google
        if (!oauth2Client) {
            throw new Error("Cliente oAuth nao foi gerado.");
        }

        const code = req.query.code;

        //extraindo token dos parametros enviados
        const { tokens } = await oauth2Client.getToken(code);

        res.cookie("token", tokens);  
        res.status(200).redirect(process.env.FRONT_URL);

    } catch (erro) {

        res.status(500).send("Erro ao autenticar: " + erro.message);
    }
}

router.get("/login", obterUrlAutorizacao);

router.get("/login/callback", obterCookieToken);

module.exports = {
    router,
    obterUrlAutorizacao,
    obterCookieToken
};