class Questao {
    
    constructor(id, titulo, enunciado, imagem, correta) {

        this.id = id;
        this.titulo = titulo;
        this.enunciado = enunciado;
        this.imagem = imagem;
        this.alternativas = [];
        this.correta = correta;
    }

    adicionarAlternativa(alternativa) {

        this.alternativas.push(alternativa);
    }
}

module.exports = Questao;
