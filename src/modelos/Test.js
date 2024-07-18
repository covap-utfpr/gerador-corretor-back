const { default: TestConfigs } = require("./TestConfigs");
const { default: TestHeader } = require("./TestHeader");

class Test {
    
    constructor(title, institution, subject, date, instructions, value, order, answCardPosition, font, fontSize, lines, questions) {

        this.questions = questions;
        this.header = new TestHeader(title, institution, subject, date, instructions, value);
        this.configs = new TestConfigs(order, answCardPosition, font, fontSize, lines);
    };
}

module.exports = Test;
