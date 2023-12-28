//middleware que redireciona usuario para rota de login caso nao esteja autenticado
const verificarAutenticacao = (req, res, next) => { 
    
    if (req.path != '/login' && req.path != '/login/callback') { //verificar quaisquer caminhos diferentes de login e login/callback

        if(req.headers['authorization']) { //se foi criada a propriedade token, o usuario esta autenticado
            console.log(req.headers['authorization'])
            next();//prosseguir para a pagina requisitada
            
        } else {
            
            res.redirect("/login"); //se nao, redirecionar para login
        }
        
    } else {

        next(); //se o caminho requisitado foi login ou login/callback, 
    }
}

module.exports = verificarAutenticacao;