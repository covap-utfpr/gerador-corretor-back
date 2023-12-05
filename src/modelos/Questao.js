class Questao {
    
    constructor(titulo, enunciado, alternativas, imagem, correta) {

        this.titulo = titulo;
        this.enunciado = enunciado;
        this.imagem = imagem;
        this.alternativas = alternativas;
        this.correta = correta;
    }
}

module.exports = Questao;
