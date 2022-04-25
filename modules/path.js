//Módulo nativo do Node
const path = require('path');

//Basename: nome arquivo atual //var global nativa node
console.log(path.basename(__filename));
//Dirname: nome do diretorio atual
console.log(path.dirname(__filename));
//Extname: extensão do arquivo
console.log(path.extname(__filename));
//Cria objeto path
console.log(path.parse(__filename));
// Juntar caminhso de arquivos
console.log(__dirname);
console.log(path.join(__dirname, "test","test.html"));