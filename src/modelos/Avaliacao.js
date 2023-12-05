
class Avaliacao {
    
    constructor(tipo, titulo, imagem, data, instituicao, questoes) {

        this.tipo = tipo;
        this.titulo = titulo;
        this.imagem = imagem;
        this.data = data;
        this.instituicao = instituicao;
        this.questoes = questoes; 
        this.planilha;
    }

}

module.exports = Avaliacao;
