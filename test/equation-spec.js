var Fraction = require('../src/fractions');
var Expression = require('../src/expressions');
var Equation = require('../src/equations');

describe("An equation with one variable", function() {
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

    a = a.add(b); // a + b
    c = c.add(d); // c + d

    var eq = new Equation(a, c); // a + b = c + d

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

    it("should get the right answer", function() {
        var answer = eq.solveFor("a"); // a = c + d - b
        expect(answer.print()).toEqual("c + d - b");
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