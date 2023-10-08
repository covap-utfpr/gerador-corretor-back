class Questao {
    
    constructor(id, nome, enunciado, imagem) {

        this.id = id;
        this.nome = nome;
        this.enunciado = enunciado;
        this.imagem = imagem;
        this.alternativas = [];
    }

    adicionarAlternativa(alternativa) {

        this.alternativas.push(alternativa);
    }
}

module.exports = Questao;
