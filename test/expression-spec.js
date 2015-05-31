var Fraction = require('../src/fractions');
var Expression = require('../src/expressions');
var UserException = require('../src/exceptions').UserException;

describe("An expression initialized with an alphabetic variable name", function() {
    var x = new Expression("x");

    it("initializes", function() {
        expect(x).toBeDefined();
    });

    it("is initalized with a constant of 0", function() {
        expect(x.constant).toEqual(new Fraction(0, 1));
    });

    it("is initalized with one term", function() {
        expect(x.terms.length).toEqual(1);
    });
});

describe("An expression initialized with a greek letter variable name", function() {
    var lambda = new Expression("lambda");
    lambda = lambda.add(3);
    lambda = lambda.multiply(5);

    it("initializes", function() {
        expect(lambda).toBeDefined();
    });

    it("converts to tex properly", function() {
        expect(lambda.tex()).toEqual("5\\lambda + 15");
    });

    it("converts to string properly, even though it looks weird", function() {
        expect(lambda.print()).toEqual("5lambda + 15");
    });
});

describe("An expression initialized with nothing", function() {
    var x = new Expression();

    it("initializes", function() {
        expect(x).toBeDefined();
    });

    it("is initalized with a constant of 0", function() {
        expect(x.constant).toEqual(new Fraction(0, 1));
    });

    it("is initalized with zero terms", function() {
        expect(x.terms.length).toEqual(0);
    });
});

describe("Expression addition", function() {
    var x = new Expression("x");
    var y = new Expression("y");
    var z = new Expression("z");

    it("should allow adding other expressions", function() {
        var answer = x.add(y);

        expect(answer.print()).toEqual("x + y");
    });

    it("should properly combine the constant of two expressions", function() {
        var newx = x.add(3);                  // x + 3
        var newy = y.add(new Fraction(1, 4)); // y + 1/4
        var answer = newx.add(newy);          // x + 3 + y + 1/4 => x + y + 13/4

        expect(answer.print()).toEqual("x + y + 13/4");
    });

    it("should properly combine the terms of two expressions", function() {
        var expr1 = x.add(y).add(z); // x + y + z
        var expr2 = z.add(y); // z + y

        var answer = expr1.add(expr2); // x + y + z + z + y = x + 2y + 2z

        expect(answer.print()).toEqual("x + 2y + 2z");
    });

    it("should allow adding fractions", function() {
        var answer = x.add(new Fraction(1, 3));

        expect(answer.print()).toEqual("x + 1/3");
    });

    it("should allow adding integers", function() {
        var answer = x.add(3);

        expect(answer.print()).toEqual("x + 3");
    });

    it("should not allow adding floats", function() {
        expect(function(){x.add(0.25)}).toThrow(new UserException("NonIntegerArgument"));
    });
});

describe("Expression subtraction", function() {
    var x = new Expression("x");
    var y = new Expression("y");

    it("should allow subtracting other expressions", function() {
        var answer = x.subtract(y);

        expect(answer.print()).toEqual("x - y");
    });

    it("should properly combine the constant of two expressions", function() {
        var newx = x.subtract(3);                  // x - 3
        var newy = y.subtract(new Fraction(1, 4)); // y - 1/4
        var answer = newx.subtract(newy);          // x - 3 - y - (-1/4) => x - y - 12/4 + 1/4 => x - y - 11/4

        expect(answer.print()).toEqual("x - y - 11/4")
    });

    it("should properly combine the terms of two expressions", function() {
        var newy = y.subtract(x); // y - x
        var answer = x.subtract(newy); // x - (y - x) => x - y + x => 2x - y

        expect(answer.print()).toEqual("2x - y");
    });

    it("should allow subtracting fractions", function() {
        var answer = x.subtract(new Fraction(1, 3));

        expect(answer.print()).toEqual("x - 1/3");
    });

    it("should allow subtracting integers", function() {
        var answer = x.subtract(3);

        expect(answer.print()).toEqual("x - 3");
    });

    it("should not allow subtracting floats", function() {
        expect(function(){x.subtract(0.25)}).toThrow(new UserException("NonIntegerArgument"));
    });
});

describe("Expression multiplication", function() {
    var x = new Expression("x");
    var y = new Expression("y");

    it("should allow multiplying by a fraction", function() {
        var answer = x.multiply(new Fraction(1, 3));

        expect(answer.print()).toEqual("1/3x");
    });

    it("should allow multiplying by an integer", function() {
        var answer = x.multiply(5);

        expect(answer.print()).toEqual("5x");
    });

    it("should not allow multiplying by another expression", function() {
        expect(function(){x.multiply(y)}).toThrow(new UserException("NonIntegerArgument"));
    });
});

describe("Expression division", function() {
    var x = new Expression("x");
    var y = new Expression("y");

    it("should allow dividing by a fraction", function() {
        var answer = x.divide(new Fraction(1, 3));

        expect(answer.print()).toEqual("3x");
    });

    it("should allow dividing by an integer", function() {
        var answer = x.divide(5);

        expect(answer.print()).toEqual("1/5x");
    });

    it("should not allow dividing by another expression", function() {
        expect(function(){x.divide(y)}).toThrow(new UserException("NonIntegerArgument"));
    });

    it("should throw an exception if dividing by zero", function() {
        expect(function(){x.divide(0)}).toThrow(new UserException("DivideByZero"));
    })
});

describe("Expression printing", function() {
    it("should put a negative sign on the first term if it's negative", function() {
        var x = new Expression("x");
        x = x.multiply(-1);
        x = x.add(3);

        expect(x.print()).toEqual("-x + 3");
    });

    it("should get the signs right", function() {
        var x = new Expression("x");
        var y = new Expression("y");
        var z = new Expression("z");

        x = x.add(y).subtract(z).add(5);

        expect(x.print()).toEqual("x + y - z + 5");
    });

    it("should omit the constant if it's 0", function() {
        var x = new Expression("x");
        x = x.add(3);
        x = x.subtract(3);

        expect(x.print()).toEqual("x");
    });
});

describe("Expression evaluation with one variable", function() {
    var x = new Expression("x");
    x = x.add(3);

    it("should allow evaluating at integers", function() {
        var answer = x.evaluateAt({'x': 2});

        expect(answer.print()).toEqual("5");
    });

    it("should allow evaluating at fractions", function() {
        var answer = x.evaluateAt({'x': new Fraction(1, 5)});

        expect(answer.print()).toEqual("16/5");
    });
});

describe("Expression evaluation with multiple variables", function() {
    var x = new Expression("x");
    var y = new Expression("y");
    var z = x.add(y); // x + y

    it("should return an expression when not substituting all the variables", function() {
        var answer = z.evaluateAt({'x': 3});

        expect(answer.print()).toEqual("y + 3");
    });

    it("should return a fraction when substituting all the variables", function() {
        var answer = z.evaluateAt({'x': 3, 'y': new Fraction(1, 2)});

        expect(answer.print()).toEqual("7/2");
    });

    it("should return a fraction when substituting variables out of order", function() {
        var answer = z.evaluateAt({'y': new Fraction(1, 2), 'x': 3});

        expect(answer.print()).toEqual("7/2");
    });
});