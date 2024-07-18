const deleteOne = async (id, parentId, drive) => {

    // Obtém o ID da pasta 
    let res;

    try {

        res = await drive.files.delete({
            fileId: id,
        });    

    } catch (erro) {

        throw new ServerException(erro.message, 500);
    }   
}

module.exports = deleteOne;