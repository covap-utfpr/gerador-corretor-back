const Cabecalho = require("./Cabecalho");

class Avaliacao {
    
    constructor(id, nome, tipo, titulo, imagem, data, instituicao) {

        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
        this.planilha;
        this.cabecalho = new Cabecalho(titulo, imagem, data, instituicao);
        this.questoes = []; 
    }

    adicionarQuestao(questao) {

        this.questoes.push(questao);
    }
}

module.exports = Avaliacao;
