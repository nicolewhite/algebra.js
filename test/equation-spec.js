var Expression = require('../src/expressions').Expression;
var Equation = require('../src/equations');
var Fraction = require('../src/fractions');
var round = require('../src/helper').round;


describe("A linear equation with one variable", function() {
    var x1 = new Expression("x").add(4).divide(5);             // 1/5x + 4/5
    var x2 = new Expression("x").subtract(new Fraction(1, 6)); // x - 1/6
    var eq = new Equation(x1, x2);                             // 1/5x + 4/5 = x - 1/6

    it("should initialize", function() {
        expect(eq).toBeDefined();
    });

    it("should print properly", function() {
        expect(eq.toString()).toEqual("1/5x + 4/5 = x - 1/6");
    });

    it("should print to Tex properly", function() {
        expect(eq.toTex()).toEqual("\\frac{1}{5}x + \\frac{4}{5} = x - \\frac{1}{6}");
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
        expect(answer.toString()).toEqual("29/24");
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
        expect(eq.toString()).toEqual("a + b = c + d");
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
        expect(answer.toString()).toEqual("c + d - b");
    });

    it("should solve for variables that can be isolated", function() {
        var eq = new Equation(a.multiply(a).add(b), c.add(d)); // a^2 + b = c + d

        var answer = eq.solveFor("b");

        expect(answer.toString()).toEqual("-a^2 + c + d");
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

    it("should return two reduced fractions if the equation has two real roots that are rational fractions", function() {
        var ex = x.multiply(x).multiply(2).add(x);
        var eq = new Equation(ex, 0);
        var answers = eq.solveFor("x");

        expect(answers[0].equalTo(new Fraction(-1, 2))).toBe(true);
        expect(answers[1].equalTo(new Fraction(0, 1))).toBe(true);
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

    it("should return 1 if there are infinite solutions", function() {
        var eq = new Equation(x.multiply(x), x.multiply(x)); // x^2 = x^2
        var answers = eq.solveFor("x");

        expect(answers[0].equalTo(new Fraction(1, 1))).toBe(true);
    });
});

describe("An array of answers resulting from solving an equation", function() {
    var x = new Expression("x");

    it("should convert toTex properly", function() {
        var ex = x.multiply(x).add(x).subtract(2);
        var eq = new Equation(ex, 0); // x^2 + x - 2 = 0

        var answers = eq.solveFor("x"); // -2, 1
        expect(answers.toTex()).toEqual("-2,1");
    });
});

describe("An equation built with an expression and an integer or fraction", function() {
    var x = new Expression("x").add(4).divide(5);
    var eq = new Equation(x, new Fraction(3, 4));

    it("should initialize", function() {
        expect(eq).toBeDefined();
    });

    it("should print properly", function() {
        expect(eq.toString()).toEqual("1/5x + 4/5 = 3/4")
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

describe("Solving for variables that can't be isolated", function() {
    it("should return undefined if the variable is crossproducts with other vars", function() {
        var expr = new Expression("x").multiply("y");
        var eq = new Equation(expr, 2); // xy = 2
        var answer = eq.solveFor("x");
        expect(answer).toBeUndefined();
    });

    it("should return undefined if the variable has multiple degrees and there are other vars", function() {
        var expr = new Expression("x");
        expr = expr.multiply("x");
        expr = expr.add("x");
        expr = expr.add("y");
        var eq = new Equation(expr, 4); // x^2 + x + y = 4
        var answer = eq.solveFor("x");
        expect(answer).toBeUndefined();
    });
});

describe("Solving linear equations with no / infinite solution", function() {
    it("should throw an exception when there's no solution", function() {
        var x = new Expression("x");
        var eq = new Equation(x, x.add(2)); // x = x + 2

        expect(function(){eq.solveFor("x")}).toThrow("NoSolution");
    });

    it("should return 1 when there's infinite solutions", function() {
        var x = new Expression("x");
        var eq = new Equation(x, x); // x = x

        var answer = eq.solveFor("x");
        expect(answer.equalTo(new Fraction(1, 1))).toBe(true);
    });
});

describe("Solving a cubic equation", function() {
    it("works when there's one distinct real root - discriminant = 0", function() {
        var a = new Expression("x").pow(3);
        var b = new Expression("x").pow(2).multiply(-3);
        var c = new Expression("x").multiply(3);
        var d = -1;

        var expr = a.add(b).add(c).add(d);

        var eq = new Equation(expr, 0); // x^3 - 3x^2 + 3x - 1 = 0
        var answers = eq.solveFor("x");
        expect(answers.toString()).toEqual("1");
    });

    it("works when there's two distinct real roots - discriminant = 0", function() {
        var expr = new Expression("x").pow(3);
        expr = expr.subtract(new Expression("x").multiply(3));
        expr = expr.add(2); // x^3 - 3x + 2

        var eq = new Equation(expr, 0); // x^3 - 3x + 2 = 0
        var answers = eq.solveFor("x");

        expect(answers.toString()).toEqual("-2,1");
    });

    it("works when there are three real roots, discriminant > 0", function() {
        var n1 = new Expression("x").add(2); // x + 2
        var n2 = new Expression("x").add(3); // x + 3
        var n3 = new Expression("x").add(4); // x + 4

        var cubic = n1.multiply(n2).multiply(n3);
        cubic = new Equation(cubic, 0);
        var answers = cubic.solveFor("x");

        expect(answers[0].equalTo(new Fraction(-4, 1))).toBe(true);
        expect(answers[1].equalTo(new Fraction(-3, 1))).toBe(true);
        expect(answers[2].equalTo(new Fraction(-2, 1))).toBe(true);
    });

    it("works when there are three real roots, discriminant > 0 and a != 1", function() {
        var n1 = new Expression("x").add("x").add(2); // 2x + 2
        var n2 = new Expression("x").add(3); // x + 3
        var n3 = new Expression("x").add(4); // x + 4

        var cubic = n1.multiply(n2).multiply(n3);
        cubic = new Equation(cubic, 0);
        var answers = cubic.solveFor("x");

        expect(answers[0].equalTo(new Fraction(-4, 1))).toBe(true);
        expect(answers[1].equalTo(new Fraction(-3, 1))).toBe(true);
        expect(answers[2].equalTo(new Fraction(-1, 1))).toBe(true);
    });

    it("toTex works", function() {
        var n1 = new Expression("x").add("x").add(2); // 2x + 2
        var n2 = new Expression("x").add(3); // x + 3
        var n3 = new Expression("x").add(4); // x + 4

        var cubic = n1.multiply(n2).multiply(n3);
        cubic = new Equation(cubic, 0);
        var answers = cubic.solveFor("x");

        expect(answers.toTex()).toEqual("-4,-3,-1");
    });

    it("works when there is one real root, discriminant < 0", function() {
        var a = new Expression("x").pow(3);
        var c = new Expression("x").multiply(-2);

        var expr = a.add(c);
        var cubic = new Equation(expr, 4);

        var answers = cubic.solveFor("x");

        expect(answers[0].equalTo(new Fraction(2, 1))).toBe(true);
    });

    it("returns 1 when there are infinite solutions", function() {
        var exp = new Expression("x").pow(3);
        var cubic = new Equation(exp.add(4), exp.add(4)); // x^3 + 4 = x^3 + 4

        var answers = cubic.solveFor("x");
        expect(answers[0].equalTo(new Fraction(1, 1))).toBe(true);
    });

    it("should throw an exception when there's no solution", function() {
        var x = new Expression("x").pow(3);
        var eq = new Equation(x, x.add(2)); // x^3 = x^3 + 2

        expect(function(){eq.solveFor("x")}).toThrow("NoSolution");
    });
});

describe("Equation evaluation", function() {
    it("works with ints", function() {
        var x = new Expression("x");
        var y = new Expression("y");

        var eq = new Equation(x, y.add(2)); // x = y + 2
        var answer = eq.eval({x:2});
        expect(answer.toString()).toEqual("2 = y + 2");
    });

    it("works with expressions", function() {
        var x = new Expression("x");
        var sub = new Expression("y").add(4);

        var eq = new Equation(x, 2); // x = 2
        var answer = eq.eval({x: sub}); // y + 4 = 2

        expect(answer.toString()).toEqual("y + 4 = 2");
    });

});

describe("testing a specfic quartic", function() {
    //(x-1)(x-2)(x-3)(x-4)
    var x = new Expression("x")
    x = x.subtract(1);
    x= x.multiply(x.subtract(1))
        .multiply(x.subtract(2))
        .multiply(x.subtract(3));
    var eq = new Equation(x,0);  
    var eq1= eq.solveFor("x");
    it("the testing polnomial is ", function() {
        expect(x.toString()).toEqual("x^4 - 10x^3 + 35x^2 - 50x + 24");
    });

    it("i can get ", function() {
        expect(eq1.toString()).toEqual("1,2,3,4");
    });

});