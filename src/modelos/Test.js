const { default: TestConfigs } = require("./TestConfigs");
const { default: TestHeader } = require("./TestHeader");

class Test {
    
    constructor(questions, header, configs) {

        this.questions = questions;
        this.header = header;
        this.configs = configs;
    };
}

module.exports = Test;
