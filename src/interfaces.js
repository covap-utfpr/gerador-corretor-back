
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
}

class InterfaceQuestao {
    
    rotaDiretorio = '/questao';
    /**
     * Cria um diretorio no diretorio pai designado
    */
    criar = {
        subrota : '/criar',
        requestType : 'post',
        localParametros : 'body',
        parametros: ['idDisciplina', 'titulo', 'enunciado', 'alternativas', 'imagem', 'correta'],
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
}

module.exports = {InterfaceDiretorio, InterfaceQuestao};