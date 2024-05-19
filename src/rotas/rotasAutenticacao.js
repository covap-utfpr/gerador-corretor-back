//Deinindo Endpoints - crud no Drive
const express = require("express");
const { google } = require('googleapis');
const { InterfaceAutenticacao } = require("../interfaces");

class RotasAutenticacao extends InterfaceAutenticacao {
    
    oauth2Client;

    constructor() {
       
        super();

        this.router = express.Router();

        this.oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL
        );

        const obterUrl = this.obterUrl;
        const obterToken = this.obterToken;

        this.router[obterUrl.requestType](obterUrl.subrota, (req, res) => {
            
            try {

                const url = this.obterUrlAutorizacao();

                res.status(200).send(url);
            
            } catch (erro) {
        
                res.status(erro.status).send(erro.message);    
            }
            
        });

        this.router[obterToken.requestType](obterToken.subrota, async (req, res) => {
            
            try {

                const tokens = await this.obterCookieToken(req, res);

                res.cookie("token", tokens);  
                res.status(200).redirect(`${process.env.FRONT_URL}?login_success`);
            
            } catch (erro) {
        
                res.status(500).send("Erro ao autenticar: " + erro.message);
            }
            
        });

    }

    obterUrlAutorizacao = () => {

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
    
    obterCookieToken = async (req, res) => {
    
        // apos realizar login com google, usuario retorna para esta url que tem 
        //parametros fornecidos pelo google
        if (!this.oauth2Client) {
            throw new Error("Cliente oAuth nao foi gerado.");
        }

        const code = req.query.code;

        //extraindo token dos parametros enviados
        const { tokens } = await this.oauth2Client.getToken(code);

        return tokens;
    }
    
}

module.exports = RotasAutenticacao;