"use strict";

var Parser = require("../src/parser.js"),
    algebra = require("../algebra.js"),
    Expression = algebra.Expression,
    Fraction = algebra.Fraction,
    Equation = algebra.Equation;

describe("Input validity", function() {
    var p = new Parser();
    it("does not accept special characters", function(){
        var input = "2+4*x-€";
        expect(function(){p.parse(input);}).toThrow(new Error("Token error at character € at position 6"));
    });

    it("does not accept variable names with numbers", function(){
        var input = "2+4x";
        expect(p.parse(input)).toNotEqual(new Expression("4x").add(2));
    });

    it("does not accept operators without operands", function(){
        var input = "+";
         expect(function(){p.parse(input);}).toThrow(new Error("Missing operand"));
    });

    it("should ignore newlines", function(){
 		var input = "2+z \n = 5";
        var lhs = new Expression("z").add(2);
        var rhs = new Expression(5);
        expect(p.parse(input)).toEqual(new Equation(lhs,rhs));
    });

    it("should accept words as variable names", function(){
 		var input = "2+alpha = 5";
        var lhs = new Expression("alpha").add(2);
        var rhs = new Expression(5);
        expect(p.parse(input)).toEqual(new Equation(lhs,rhs));
    });

    it("should work from the algebra module", function(){
        var input = "2+alpha = 5";
        var lhs = new Expression("alpha").add(2);
        var rhs = new Expression(5);
        expect(algebra.parse(input)).toEqual(new Equation(lhs,rhs));
    });

    it("should not accept incomplete decimal numbers", function(){
        var input = "2. + x * 4";
        expect(function(){p.parse(input);}).toThrow(new Error("Decimal point without decimal digits at position 1"));
    });

    it("should not accept short notation for decimals x with 0 > x < 1", function(){
        var input = ".2 + x * 4";
        expect(function(){p.parse(input);}).toThrow(new Error("Token error at character . at position 0"));
    });

    it("should treat decimal numbers correctly", function(){
        var input = "2.0 + 4.5";
        var expr = new Expression(13).divide(2);
        expect(algebra.parse(input)).toEqual(expr);
    });

    it("should treat decimal numbers correctly", function(){
        var input = "0.0";
        var expr = new Expression(0);
        expect(algebra.parse(input)).toEqual(expr);
    });

    it("should treat negative numbers correctly", function(){
        var input = "x = -4";
        var eqn = new Equation(new Expression("x"),new Expression(-4));
        expect(algebra.parse(input)).toEqual(eqn);
    });
});

describe("Operators", function() {
	var p = new Parser();
    it("should parse = as equations", function(){
        var input = "2+x = 5";
        var lhs = new Expression("x").add(2);
        var rhs = new Expression(5);
        expect(p.parse(input)).toEqual(new Equation(lhs,rhs));
    });

    it("should parse - correctly", function(){
        var input = "2-x = 5";
        var lhs = new Expression(2).subtract(new Expression("x"));
        var rhs = new Expression(5);
        expect(p.parse(input).toString()).toEqual(new Equation(lhs,rhs).toString());
    });

    it("should parse / correctly", function(){
        var input = "x/2 = 8";
        var lhs = new Expression("x").divide(2);
        var rhs = new Expression(8);
        expect(p.parse(input)).toEqual(new Equation(lhs,rhs));
    });

    it("should parse / correctly", function(){
        var input = "x/5/3";
        var lhs = new Expression("x").divide(5).divide(3);
        expect(p.parse(input)).toEqual(lhs);
    });

    it("should parse ^ correctly", function(){
        var input = "x^2 = 16";
        var lhs = new Expression("x").pow(2);
        var rhs = new Expression(16);
        expect(p.parse(input)).toEqual(new Equation(lhs,rhs));
    });
});


describe("Parenthesis", function() {
	var p = new Parser();
    it("should parse and reduce parenthesis correctly", function(){
        var input = "(2)*((4)+((x)))";
        expect(p.parse(input)).toEqual(new Expression("x").add(4).multiply(2));
    });

    it("should throw an errow if there is an extra opening parenthesis", function(){
    	var input = "2-(4*x";
        expect(function(){p.parse(input);}).toThrow(new Error("Unbalanced Parenthesis"));
    });

    it("should throw an errow if there is an extra closing parenthesis", function(){
    	var input = "2+4*x)";
        expect(function(){p.parse(input);}).toThrow(new Error("Unbalanced Parenthesis"));
    });

});

describe("Order of operations", function() {
    var p = new Parser();

    it("should execute * before +", function() {
        var input = "2 * x + 2 + 4 * 3";
        expect(p.parse(input)).toEqual(new Expression("x").multiply(2).add(2).add(12));
    });

    it("should execute () before +", function() {
        var input = "2 * x * (3 + 4)";
        expect(p.parse(input)).toEqual(new Expression("x").multiply(2).multiply(7));
    });

    it("should execute * and / in the order that they're seen", function() {
        var input = "2 * x / (4 + 3)";
        expect(p.parse(input)).toEqual(new Expression("x").multiply(2).divide(7));
    });

    it("should treat consecutive parentheses as multiplication", function(){
        var input = "(x + 2)(x + 2)";
        var e1 = new Expression("x").add(2);
        e1 = e1.multiply(e1);
        expect(algebra.parse(input)).toEqual(e1);
    });

    it("should treat integers adjacent to parentheses as multiplication", function(){
        var input = "5(x+2)";
        var e1 = new Expression("x").add(2);
        e1 = e1.multiply(5);
        expect(algebra.parse(input)).toEqual(e1);
    });

    it("should treat integers adjacent to parentheses as multiplication", function(){
        var input = "(x+2)5";
        var e1 = new Expression("x").add(2);
        e1 = e1.multiply(5);
        expect(algebra.parse(input)).toEqual(e1);
    });

    it("should be able to raise expressions wrapped in parentheses", function() {
        var input = "(x+2)^2";
        var exp = new Expression("x").add(2).pow(2);

        expect(algebra.parse(input)).toEqual(exp);
    });
    it("power has a higher operator precedence than multiplication ", function() {
        var input = "a*x^2";
        var exp = new Expression("a").multiply(new Expression("x").pow(2));

        expect(algebra.parse(input).toString()).toEqual(exp.toString());
    });

    it("power has a higher operator precedence than multiplication when the multiply operator is missing", function() {
        var input = "(3/2)x^2";
        var exp = new Expression("x").pow(2).multiply(new Fraction(3,2));

        expect(algebra.parse(input).toString()).toEqual(exp.toString());
    });


});