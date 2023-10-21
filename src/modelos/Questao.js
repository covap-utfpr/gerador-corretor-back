class Questao {
    
    constructor(id, titulo, enunciado, imagem) {

        this.id = id;
        this.titulo = titulo;
        this.enunciado = enunciado;
        this.imagem = imagem;
        this.alternativas = [];
    }

    adicionarAlternativa(alternativa) {

        this.alternativas.push(alternativa);
    }
}

module.exports = Questao;
