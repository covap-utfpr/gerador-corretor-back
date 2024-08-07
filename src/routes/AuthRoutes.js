//Deinindo Endpoints - crud no Drive
const express = require("express");
const { google } = require('googleapis');
const { AuthInterface } = require("../interfaces");

class AuthRoutes extends AuthInterface {
    
    oauth2Client;

    constructor() {
       
        super();

        this.router = express.Router();

        this.oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL
        );

        const getUrl = this.getUrl;
        const getToken = this.getToken;
        const revogueToken = this.revogueToken;

        this.router[getUrl.requestType](getUrl.subroute, (req, res) => {

            try {

                const url = this.getUrlAutorizacao();

                res.status(200).send(url);
            
            } catch (erro) {
        
                res.status(erro.status).send(erro.message);    
            }
            
        });

        this.router[getToken.requestType](getToken.subroute, async (req, res) => {

            try {
                const tokens = await this.obterCookieToken(req.query.code);
                res.cookie("token", tokens);  
                res.status(200).redirect(`${process.env.FRONT_URL}?login_success`);
            
            } catch (erro) {
        
                res.status(500).send("Erro ao autenticar: " + erro.message);
            }
            
        });

        this.router[revogueToken.requestType](revogueToken.subroute, async (req, res) => {
            
            try {

                const result = await this.revogarCookieToken(req.headers['authorization']);

                res.status(200).send(result);
            
            } catch (erro) {
        
                res.status(500).send("Erro ao deslogar: " + erro.message);
            }
            
        });

    }

    getUrlAutorizacao = () => {

        //definindo escopo de acesso ao drive
        const scopes = [
            'https://www.googleapis.com/auth/drive.file'
        ];
        
        //criar url de dominio do google para o usuario realizar login
        const authorizationUrl = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true
        });

        return authorizationUrl;

    }
    
    obterCookieToken = async (code) => {
        // apos realizar login com google, usuario retorna para esta url que tem 
        //parametros fornecidos pelo google
        if (!this.oauth2Client) {
            throw new Error("Cliente oAuth nao foi gerado.");
        }

        //extraindo token dos parametros enviados
        const { tokens } = await this.oauth2Client.getToken(code);
        return tokens;
    }
    
    revogarCookieToken = async (authToken) => {

        const oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL
        );
    
        let tokens = authToken;
            
        //cortando caracteres "j:" do token e convertendo em objeto
        tokens = JSON.parse(tokens.slice(2));
    
        oauth2Client.setCredentials(tokens);
        
        await oauth2Client.revokeCredentials();

        return true;
    }
}

module.exports = AuthRoutes;