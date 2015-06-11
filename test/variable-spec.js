var Fraction = require('../src/fractions');
var Variable = require('../src/variables');

describe("A variable", function() {
    var x = new Variable("x");

    it("is initalized with a variable name", function() {
        expect(x.variable).toEqual("x");
    });

    it("is initialized with a degree of 1", function() {
        expect(x.degree).toEqual(1);
    });

    it("should throw an error if initialized with an integer", function() {
        expect(function(){new Variable(5)}).toThrow("InvalidArgument");
    });

    it("should throw an error if initialized with a float", function() {
        expect(function(){new Variable(5.1)}).toThrow("InvalidArgument");
    });
});

describe("Variable comparisons", function() {
    var x1 = new Variable("x");
    var x2 = new Variable("x");

    var y = new Variable("y");

    it("should return true if variable and degree are the same", function() {
        expect(x1.hasTheSameVariableAndDegreeAs(x2)).toBe(true);
    });

    it("should return false if variable and degree are not the same", function() {
        x2.degree = 2;
        expect(x1.hasTheSameVariableAndDegreeAs(x2)).toBe(false);
    });

    it("should return true if variables are the same", function() {
        expect(x1.hasTheSameVariableAs(x2)).toBe(true);
    });

    it("should return false if variables are not the same", function() {
        expect(x1.hasTheSameVariableAs(y)).toBe(false);
    })
});

describe("Variable printing to string", function() {
    var x = new Variable("x");

    it("should print just the variable when the degree is 1", function() {
        expect(x.print()).toEqual("x");
    });

    it("should print the degree if it's greater than 1", function() {
        x.degree = 2;
        expect(x.print()).toEqual("x^2");
    });

    it("should print an empty string if the degree is 0", function() {
        x.degree = 0;
        expect(x.print()).toEqual("");
    })
});