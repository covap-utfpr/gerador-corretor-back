class AuthInterface {

    authRoute = "";

    getUrl = {
        subroute : '/login',
        requestType : 'get',
        params: {}
    }

    getToken = {
        subroute : '/login/callback',
        requestType : 'get',
        params: {
            query: ['code'],
        }
    }

    revogueToken = {
        subroute : '/logout',
        requestType : 'post',
        params: {
            headers: ['Authorization'],
        }
    }
}

class DirectoryInterface {
    
    directoryRoute = '/diretorio';

    /**
     * Cria um diretorio no diretorio pai designado
    */
    create = {
        subroute : '/criar',
        requestType : 'post',
        params: {
            body: ['name', 'parentId'],
        }
    }

    /**
     * Ler uma qnt de diretorios no diretorio pai designado, partindo de um index inicial 
    */
    read = {
        subroute : '/ler',
        requestType : 'get',
        params: {
            query: ['parentId', 'qnt', 'start'],
        },
    }
    
    /**
     * Ler um diretorio
    */
    readOne = {
        subroute : '/ler/:name',
        requestType : 'get',
        params: {
            params: ['name'],
            query: ['parentId'],
        },
    }

    /**
     * Deletar um diretorio
    */
    delete = {
        subroute : '/deletar/:id',
        requestType : 'delete',
        params: {
            params: ['id'],
            query: ['parentId'],
        },
    }
}

class QuestionInterface {
    
    questionRoute = '/questao';

    /**
     * Cria uma questao no diretorio pai designado
    */
    create = {
        subroute : '/criar',
        requestType : 'post',
        params: { 
            body: [ 'subject', 'title', 'stem', 'alternatives', 'picture', 'correct', 'parent', 'drive' ]
        },
    }

    /**
     * Ler varias questoes
    */
    read = {
        subroute : '/ler',
        requestType : 'get',
        params: {
            query: ['parentId', 'qnt', 'start'],
        },    
    }
    
    /**
     * Ler uma questao
    */
    readOne = {
        subroute : '/ler/:id',
        requestType : 'get',
        params: {
            params: ['id'],
        }, 
    }

    /**
     * Editar uma questão
    */
    edit = {
        subroute : '/editar/:id',
        requestType : 'patch',
        params: { 
            body: [ 'subject', 'title', 'stem', 'alternatives', 'picture', 'correct', 'parentId'],
            params: ['id']
        },
    }

    /**
     * Deletar uma questão
    */
    delete = {
        subroute : '/deletar/:id',
        requestType : 'delete',
        params: {
            params: ['id'],
        }, 
    }
}

class TestInterface {
    
    testRoute = '/avaliacao';

    /**
     * Cria uma questao no diretorio pai designado
    */
    create = {
        subroute : '/criar',
        requestType : 'post',
        params: {
            body: ['questions', 'header', 'configs']
        },
    }

    /**
     * Ler varias avaliacoes
    */
    read = {
        subroute : '/ler',
        requestType : 'get',
        params: {
            query: ['parentId', 'qnt', 'start']
        }
    }
}

module.exports = {AuthInterface, DirectoryInterface, QuestionInterface, TestInterface};