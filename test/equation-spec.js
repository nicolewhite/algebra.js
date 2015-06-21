var Fraction = require('../src/fractions');
var Expression = require('../src/expressions');
var Equation = require('../src/equations');

function round(number) {
    return Math.round(parseFloat(number)*100)/100;
};

describe("A linear equation with one variable", function() {
    var x1 = new Expression("x").add(4).divide(5);             // 1/5x + 4/5
    var x2 = new Expression("x").subtract(new Fraction(1, 6)); // x - 1/6
    var eq = new Equation(x1, x2);                             // 1/5x + 4/5 = x - 1/6

    it("should initialize", function() {
        expect(eq).toBeDefined();
    });

    it("should print properly", function() {
        expect(eq.print()).toEqual("1/5x + 4/5 = x - 1/6");
    });

    it("should return a fraction when solving for the one variable", function() {
        var answer = eq.solveFor("x");
        expect(answer instanceof Fraction).toBe(true);
    });

    it("should throw an exception when solving for a variable that isn't there", function() {
        expect(function(){eq.solveFor("y")}).toThrow("InvalidArgument");
    });

    it("should get the right answer", function() {
        var answer = eq.solveFor("x");
        expect(answer.print()).toEqual("29/24");
    });
});

describe("An equation with multiple variables", function() {
    var a = new Expression("a");
    var b = new Expression("b");
    var c = new Expression("c");
    var d = new Expression("d");

    var eq = new Equation(a.add(b), c.add(d)); // a + b = c + d

    it("should initialize", function() {
        expect(eq).toBeDefined();
    });

    it("should print properly", function() {
        expect(eq.print()).toEqual("a + b = c + d");
    });

    it("should return an expression when solving for a variable", function() {
        var answer = eq.solveFor("a");
        expect(answer instanceof Expression).toBe(true);
    });

    it("should throw an exception when solving for a variable that isn't there", function() {
        expect(function(){eq.solveFor("y")}).toThrow("InvalidArgument");
    });

    it("should get the right answer", function() {
        var answer = eq.solveFor("a"); // a = c + d - b
        expect(answer.print()).toEqual("c + d - b");
    });

    it("should solve for variables that can be isolated", function() {
        var eq = new Equation(a.multiply(a).add(b), c.add(d)); // a^2 + b = c + d

        var answer = eq.solveFor("b");

        expect(answer.print()).toEqual("-a^2 + c + d");
    });

    it("should return undefined when solving for a variable that can't be isolated", function() {
        var eq = new Equation(a.multiply(a).add(b), c.add(d)); // a^2 + b = c + d

        var answer = eq.solveFor("a");

        expect(answer).toBeUndefined();
    });
});

describe("Solving a quadratic equation", function() {
    var x = new Expression("x");

    it("should return two reduced fractions if the equation has two real roots that are rational", function() {
        var ex = x.multiply(x).add(x).subtract(2);
        var eq = new Equation(ex, 0); // x^2 + x - 2 = 0

        var answers = eq.solveFor("x"); // -2, 1

        expect(answers[0].equalTo(new Fraction(-2, 1))).toBe(true);
        expect(answers[1].equalTo(new Fraction(1, 1))).toBe(true);
    });

    it("should return two numbers if the equation has two real roots that are irrational", function() {
        var ex = x.multiply(x).add(x.multiply(4)).add(2);
        var eq = new Equation(ex, 0); // x^2 + 4x + 2 = 0

        var answers = eq.solveFor("x"); // -2 - √2, √2 - 2
        var expected = [-2 - Math.sqrt(2), Math.sqrt(2) - 2];

        expect(round(answers[0])).toEqual(round(expected[0]));
        expect(round(answers[1])).toEqual(round(expected[1]));
    });

    it("should return one reduced fraction if there's only one real root", function() {
        var ex = x.multiply(x).add(x.multiply(2));
        var eq = new Equation(ex, -1); // x^2 + 2x = -1

        var answers = eq.solveFor("x");

        expect(answers[0].equalTo(new Fraction(-1, 1)));
    });

    it("should return an empty array if there are no real roots", function() {
        var ex = x.multiply(x.multiply(2)).add(4);
        var eq = new Equation(ex, 0); // x^2 + 2x + 4 = 0

        var answers = eq.solveFor("x");

        expect(answers.length).toEqual(0);
    });

    it("should work when some terms are on the other side", function() {
        var eq = new Equation(x.multiply(x), x.multiply(-1).add(2)); // x^2 = -x + 2

        var answers = eq.solveFor("x"); // -2, 1

        expect(answers[0].equalTo(new Fraction(-2, 1))).toBe(true);
        expect(answers[1].equalTo(new Fraction(1, 1))).toBe(true);
    });
});

describe("An equation built with an expression and an integer or fraction", function() {
    var x = new Expression("x").add(4).divide(5);
    var eq = new Equation(x, new Fraction(3, 4));

    it("should initialize", function() {
        expect(eq).toBeDefined();
    });

    it("should print properly", function() {
        expect(eq.print()).toEqual("1/5x + 4/5 = 3/4")
    });
});

describe("An invalid equation", function() {
    var x = new Expression("x");

    it("should throw an exception with a float on the lhs", function() {
        expect(function(){new Equation(0.25, x)}).toThrow("InvalidArgument");
    });

    it("should throw an exception with a float on the rhs", function() {
        expect(function(){new Equation(x, 0.25)}).toThrow("InvalidArgument");
    });

    it("should throw an exception if neither args are expressions", function() {
        expect(function(){new Equation(1, 2)}).toThrow("InvalidArgument");
    })
});

describe("Checking the type of an equation", function() {
    var x = new Expression("x");
    var y = new Expression("y");

    it("should recognize a linear equation with one variable", function() {
        var eq = new Equation(x, 0);
        expect(eq._isLinear()).toBe(true);
    });

    it("should recognize a linear equation with multiple variables", function() {
        var eq = new Equation(x.add(y), 0);
        expect(eq._isLinear()).toBe(true);
    });

    it("should recognize a quadratic equation", function() {
        var eq = new Equation(x.multiply(x).add(x).add(1), 0);
        expect(eq._isQuadratic("x")).toBe(true);
    });
});