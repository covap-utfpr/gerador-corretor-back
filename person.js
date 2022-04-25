//construindo modulo
class Person {
    constructor(name) {
        this.name = name;
    }

    sayMyName() {
        return `Hello, my name is ${this.name}`;
    }
}

//exportando modulo criado
module.exports = {
    Person,
};
