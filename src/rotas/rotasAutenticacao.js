//Deinindo Endpoints - crud no Drive
const express = require("express");
const fs = require('fs');
const session = require('express-session');
const { google } = require('googleapis');
const router = express.Router();

//criando objeto Cliente para autenticar com Google
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

//middlewares (funçoes invocadas antes de cada rota - keyword "use", param "next")

    // inicializando express-session
    router.use(session({
        secret: process.env.SESSION_SECRET,
        //sessoes nao modificadas nao sao salvas
        resave: false,
        //sessoes nao incializadas podem ser salvas
        saveUninitialized: true,
    }));

    //middleware que redireciona usuario para rota de login caso nao esteja autenticado
    const verificarAutenticacao = (req, res, next) => { 
        
        if (req.path != '/login' && req.path != '/login/callback') { //verificar quaisquer caminhos diferentes de login e login/callback
            
            if(req.session.hasOwnProperty('token')) { //se foi criada a propriedade token, o usuario esta autenticado
                
                next();//prosseguir para a pagina requisitada
            } else {
               
                res.redirect("/login"); //se nao, redirecionar para login
            }
        } else {

            next(); //se o caminho requisitado foi login ou login/callback, 
        }
    }

    router.use(verificarAutenticacao);

router.get("/", (req, res) => {

    res.send("Home");
})

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

        console.log(authorizationUrl);
        res.redirect(authorizationUrl);

    } catch(erro) {

        console.error("Erro de redirecionamento: " + erro);
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

        req.session.token = tokens;

        res.redirect("/");
    
    } catch (erro) {

        res.status(500).send("Erro ao autenticar: " + erro);
    }
});

router.get("/pastas", async (req, res) => {

    try {
        
        const drive = google.drive({ version:'v3', auth:oauth2Client });

        const response = await drive.files.create({

            resource: {
                name: "teste-gerador",
                mimeType: 'routerlication/vnd.google-apps.folder', 
            },
            fields: 'id', 
        });

        const novaPasta = response.data;

        res.status(200).send(novaPasta.id);

    } catch (erro) {

        res.status(500).send("Erro ao criar subpasta: " + erro.message);
    }

});

// router.get("/criar-questao", async (req, res) => {

//     try {

//         fs.writeFileSync(nomeArquivo, JSON.stringify(
//             {
//                nome: req.query.nome,
//                enunciado: req.query.enunciado, 
               
//             }
//         ));

//         const drive = google.drive({ version:'v3', auth:oauth2Client });

//         const response = await drive.files.create({

//             resource: {
//                 name: nomeArquivo,
//                 parents: diretorioDriveId, // Define a pasta pai onde o arquivo será criado
//             },
//             media: {
//                 mimeType: 'application/json',
//                 body: fs.createReadStream(nomeArquivo), // Lê o arquivo local
//             },
//             fields: 'id', // Solicita apenas o ID do novo arquivo
//         });

//         const novoArquivo = response.data;
        
//         console.log(`Arquivo '${nomeArquivo}' criado com sucesso no Google Drive. ID: ${novoArquivo.id}`);
    
//         // Exclua o arquivo local após o upload bem-sucedido
//         fs.unlinkSync(nomeArquivo);

//         res.status(200).send(novoArquivo.id);

//     } catch (erro) {

//         res.status(500).send("Erro ao criar arquivo: " + erro.message);
//     }

// });
