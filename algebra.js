var Fraction = require('./src/fractions');
var Expression = require('./src/expressions').Expression;
var Equation = require('./src/equations');
var Parser = require('./src/parser');


var parse = function(input){
	var parser = new Parser();
	var result = parser.parse(input);
	return result;
};

module.exports = {
    Fraction: Fraction,
    Expression: Expression,
    Equation: Equation,
    parse: parse
};
