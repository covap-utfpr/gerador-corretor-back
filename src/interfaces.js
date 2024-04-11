class InterfaceAutenticacao {

    rotaAutenticacao = "/";

    obterUrl = {
        subrota : '/login',
        requestType : 'get',
        localParametros : 'query',
        parametros: [],
        funcao : 'obterUrlAutorizacao',
    }

    obterToken = {
        subrota : '/login/callback',
        requestType : 'get',
        localParametros : 'query',
        parametros: ['code'],
        funcao : 'obterCookieToken',
    }
}

class InterfaceDiretorio {
    
    rotaDiretorio = '/diretorio';
    /**
     * Cria um diretorio no diretorio pai designado
    */
    criar = {
        subrota : '/criar',
        requestType : 'post',
        localParametros : 'body',
        parametros: ['nome', 'IDdiretorioPai', 'drive'],
        funcao : 'criarUmDiretorio',
    }

    /**
     * Ler uma quantidade de diretorios no diretorio pai designado, partindo de um index inicial 
    */
    ler = {
        subrota : '/ler',
        requestType : 'get',
        localParametros : 'query',
        parametros: ['IDdiretorioPai', 'quantidade', 'inicial', 'drive'],
        funcao : 'lerVariosDiretorios',
    }
    
    /**
     * Ler um diretorio
    */
    lerUm = {
        subrota : '/ler/:nome',
        requestType : 'get',
        localParametros : 'query',
        parametros: ['nome', 'IDdiretorioPai', 'drive'],
        funcao : 'lerUmDiretorio',
    }

    /**
     * Deletar um diretorio
    */
    deletar = {
        subrota : '/deletar/:id',
        requestType : 'delete',
        localParametros : 'query',
        parametros: ['id', 'IDdiretorioPai', 'drive'],
        funcao : 'deletarUmDiretorio',
    }
}

class InterfaceQuestao {
    
    rotaQuestao = '/questao';
    /**
     * Cria uma questao no diretorio pai designado
    */
    criar = {
        subrota : '/criar',
        requestType : 'post',
        localParametros : 'body',
        parametros: ['idDisciplina', 'titulo', 'enunciado', 'alternativas', 'imagem', 'correta', 'drive'],
        funcao : 'criarUmaQuestao',
    }

    /**
     * Ler varias questoes
    */
    ler = {
        subrota : '/ler',
        requestType : 'get',
        localParametros : 'query',
        parametros: ['idDisciplina', 'quantidade', 'inicial', 'drive'],
        funcao : 'lerVariasQuestoes',
    }
    
    /**
     * Ler uma questao
    */
    lerUma = {
        subrota : '/ler/:id',
        requestType : 'get',
        localParametros : 'query',
        parametros: ['idQuestao', 'drive'],
        funcao : 'lerUmaQuestao',
    }
}

class InterfaceAvaliacao {
    
    rotaAvaliacao = '/avaliacao';
    
    /**
     * Cria uma questao no diretorio pai designado
    */
    criar = {
        subrota : '/criar',
        requestType : 'post',
        localParametros : 'body',
        parametros: ['questoes', 'cabecalho', 'configuracoes', 'drive'],
        funcao : 'criarUmaAvaliacao',
    }

    /**
     * Ler varias avaliacoes
    */
    ler = {
        subrota : '/ler',
        requestType : 'get',
        localParametros : 'query',
        parametros: ['idDisciplina', 'quantidade', 'inicial', 'drive'],
        funcao : 'lerVariasQuestoes',
    }
}

module.exports = {InterfaceAutenticacao, InterfaceDiretorio, InterfaceQuestao, InterfaceAvaliacao};