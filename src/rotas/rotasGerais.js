const deletar = async (id, IDdiretorioPai, drive) => {

    // Obtém o ID da pasta 
    let response;

    try {

        response = await drive.files.delete({
            fileId: id,
        });    

        console.log(response);

    } catch (erro) {

        throw new ServerException(erro.message, 500);
    }   
}

module.exports = deletar;