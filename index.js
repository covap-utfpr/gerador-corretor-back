//Importando modulo de person.js
const { Person } = require("./person");
//Importando modulo path nativo node
//require("./modules/path"); 
//require("./modules/fs")
//require('./modules/http');
require('./modules/express');


const person = new Person('Felipe');

//console.log(person.sayMyName());