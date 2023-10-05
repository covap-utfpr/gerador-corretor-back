const mongoose = require("mongoose");

const connectToDatabase = async () => {

    try {

        mongoose.set("strictQuery", false);
        await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@clusternode.mwzz2du.mongodb.net/?retryWrites=true&w=majority`);
        console.log("Conexao com o banco de dados feita com sucesso!");

    } catch (error) {

        console.error("Ocorreu um erro ao se concetar ao banco de dados: " + error);
    }
}

module.exports = connectToDatabase