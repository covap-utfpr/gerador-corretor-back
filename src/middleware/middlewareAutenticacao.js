const express = require("express");
const session = require('express-session');
const router = express.Router();

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