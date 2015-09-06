var Variable = require('../src/expressions').Variable;
var Fraction = require('../src/fractions');

describe("A variable", function() {
    var x = new Variable("x");

    it("is initalized with a variable name", function() {
        expect(x.variable).toEqual("x");
    });

    it("is initialized with a degree of 1", function() {
        expect(x.degree).toEqual(1);
    });

    it("should throw an error if initialized with an integer", function() {
        expect(function(){new Variable(5);}).toThrow("InvalidArgument");
    });

    it("should throw an error if initialized with a float", function() {
        expect(function(){new Variable(5.1);}).toThrow("InvalidArgument");
    });
});

describe("Variable printing to string", function() {
    var x = new Variable("x");

    it("should print just the variable when the degree is 1", function() {
        expect(x.toString()).toEqual("x");
    });

    it("should print the degree if it's greater than 1", function() {
        x.degree = 2;
        expect(x.toString()).toEqual("x^2");
    });

    it("should print an empty string if the degree is 0", function() {
        x.degree = 0;
        expect(x.toString()).toEqual("");
    });
});

describe("Variable printing to tex", function() {
    var x = new Variable("x");

    it("should print just the variable when the degree is 1", function() {
        expect(x.toTex()).toEqual("x");
    });

    it("should print the degree if it's greater than 1", function() {
        x.degree = 2;
        expect(x.toTex()).toEqual("x^{2}");
    });

    it("should print an empty string if the degree is 0", function() {
        x.degree = 0;
        expect(x.toTex()).toEqual("");
    });
});