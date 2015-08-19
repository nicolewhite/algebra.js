var Fraction = require('../src/fractions');
var Expression = require('../src/expressions').Expression;

describe("An expression initialized with an alphabetic variable name", function() {
    var x = new Expression("x");

    it("initializes", function() {
        expect(x).toBeDefined();
    });

    it("is initalized with an empty array of constants", function() {
        expect(x.constants.length).toEqual(0);
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
        expect(lambda.toTex()).toEqual("5\\lambda + 15");
    });

    it("converts to string properly, even though it looks weird", function() {
        expect(lambda.toString()).toEqual("5lambda + 15");
    });
});

describe("An expression initialized with nothing", function() {
    var x = new Expression();

    it("initializes", function() {
        expect(x).toBeDefined();
    });

    it("is initalized with an empty array of constants", function() {
        expect(x.constants.length).toEqual(0);
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

        expect(answer.toString()).toEqual("x + y");
    });

    it("should properly combine the constant of two expressions", function() {
        var newx = x.add(3);                  // x + 3
        var newy = y.add(new Fraction(1, 4)); // y + 1/4
        var answer = newx.add(newy);          // x + 3 + y + 1/4 => x + y + 13/4

        expect(answer.toString()).toEqual("x + y + 13/4");
    });

    it("should properly combine the terms of two expressions - linear", function() {
        var expr1 = x.add(y).add(z); // x + y + z
        var expr2 = z.add(y); // z + y

        var answer = expr1.add(expr2); // x + y + z + z + y = x + 2y + 2z

        expect(answer.toString()).toEqual("x + 2y + 2z");
    });

    it("should properly combine the terms of two expressions - nonlinear", function() {
        var expr1 = x.multiply(x);               // x^2
        var expr2 = x.multiply(x).add(y).add(2); // x^2 + y + 2

        var answer = expr1.add(expr2); // x^2 + (x^2 + y + 2) = 2x^2 + y + 2

        expect(answer.toString()).toEqual("2x^2 + y + 2");
    });

    it("should properly combine the terms of two expressions - crossproducts", function() {
        var expr1 = x.multiply(y); // xy
        var expr2 = y.multiply(x).add(x).add(2); // yx + x + 2

        var answer = expr1.add(expr2); // xy + (yx + x + 2) = 2xy + x + 2

        expect(answer.toString()).toEqual("2xy + x + 2");
    });

    it("should properly remove terms when canceled out", function() {
        var expr1 = x.add(y).add(z); // x + y + z
        var expr2 = z.subtract(y); // z - y

        var answer = expr1.add(expr2); // x + y + z + z - y = x + 2z

        expect(answer.toString()).toEqual("x + 2z");
    });

    it("should allow adding fractions", function() {
        var answer = x.add(new Fraction(1, 3));

        expect(answer.toString()).toEqual("x + 1/3");
    });

    it("should allow adding integers", function() {
        var answer = x.add(3);

        expect(answer.toString()).toEqual("x + 3");
    });

    it("should not allow adding floats", function() {
        expect(function(){x.add(0.25)}).toThrow("InvalidArgument");
    });

    it("should allow adding variables passed in as strings - same var", function() {
        var answer = x.add("x").add(3);

        expect(answer.toString()).toEqual("2x + 3");
    });

    it("should allow adding variables passed in as strings - different var", function() {
        var answer = x.add("y").add(3);

        expect(answer.toString()).toEqual("x + y + 3");
    });

    it("should return unsimplified terms if simplify=false", function() {
        var answer = x.add(3).add("x", false);

        expect(answer.toString()).toEqual("x + x + 3");
    });

    it("should return unsimplified constants if simplify=false", function() {
        var answer = x.add(3).add(3, false);

        expect(answer.toString()).toEqual("x + 3 + 3");
    });
});

describe("Expression subtraction", function() {
    var x = new Expression("x");
    var y = new Expression("y");
    var z = new Expression("z");

    it("should allow subtracting other expressions", function() {
        var answer = x.subtract(y);

        expect(answer.toString()).toEqual("x - y");
    });

    it("should properly combine the constant of two expressions - linear", function() {
        var newx = x.subtract(3);                  // x - 3
        var newy = y.subtract(new Fraction(1, 4)); // y - 1/4

        var answer = newx.subtract(newy);          // x - 3 - y - (-1/4) => x - y - 12/4 + 1/4 => x - y - 11/4

        expect(answer.toString()).toEqual("x - y - 11/4")
    });

    it("should properly combine the terms of two expressions - nonlinear", function() {
        var expr1 = x.multiply(x);   // x^2
        var expr2 = x.multiply(x);
        expr2 = expr2.add(y).add(2); // x^2 + y + 2

        var answer = expr1.subtract(expr2); // x^2 - (x^2 + y + 2) = -y - 2

        expect(answer.toString()).toEqual("-y - 2");
    });

    it("should properly combine the terms of two expressions - crossproducts", function() {
        var expr1 = x.multiply(y); // xy
        var expr2 = y.multiply(x).add(x).add(2); // yx + x + 2

        var answer = expr1.subtract(expr2); // xy - (yx + x + 2) = -x - 2

        expect(answer.toString()).toEqual("-x - 2");
    });

    it("should properly remove terms when canceled out", function() {
        var expr1 = x.subtract(y).subtract(z); // x - y - z
        var expr2 = z.subtract(y);             // z - y

        var answer = expr1.subtract(expr2);    // x - y - z - (z - y) = x - 2z

        expect(answer.toString()).toEqual("x - 2z");
    });

    it("should allow subtracting fractions", function() {
        var answer = x.subtract(new Fraction(1, 3));

        expect(answer.toString()).toEqual("x - 1/3");
    });

    it("should allow subtracting integers", function() {
        var answer = x.subtract(3);

        expect(answer.toString()).toEqual("x - 3");
    });

    it("should not allow subtracting floats", function() {
        expect(function(){x.subtract(0.25)}).toThrow("InvalidArgument");
    });

    it("should allow subtracting variables passed in as strings - same var", function() {
        var answer = x.subtract("x").add(3);

        expect(answer.toString()).toEqual("3");
    });

    it("should allow subtracting variables passed in as strings - different var", function() {
        var answer = x.subtract("y").add(3);

        expect(answer.toString()).toEqual("x - y + 3");
    });

    it("should return unsimplified terms if simplify=false", function() {
        var answer = x.subtract(3).subtract(x, false);

        expect(answer.toString()).toEqual("x - x - 3");
    });

    it("should return unsimplified constants if simplify=false", function() {
        var answer = x.subtract(3).subtract(3, false);

        expect(answer.toString()).toEqual("x - 3 - 3");
    });
});

describe("Expression multiplication", function() {
    var x = new Expression("x");
    var y = new Expression("y");

    it("should allow multiplying by a fraction", function() {
        var answer = x.multiply(new Fraction(1, 3));

        expect(answer.toString()).toEqual("1/3x");
    });

    it("should allow multiplying by an integer", function() {
        var answer = x.multiply(5);

        expect(answer.toString()).toEqual("5x");
    });

    it("should allow multiplying by another expression", function() {
        var newX = x.add(y); // x + y
        var newY = y.add(x); // y + x

        answer = newX.multiply(newY); // (x + y) * (y + x) = x^2 + xy + xy + y^2 = x^2 + y^2 + 2xy
        expect(answer.toString()).toEqual("x^2 + y^2 + 2xy");
    });

    it("should combine like terms correctly after multiplying by another expression", function() {
        var newX = x.add(3); // x + 3

        var newY = y.add(4); // y + 4
        newY = newY.add(newX);  // y + x + 7

        var answer = newX.multiply(newY); // (x + 3) * (y + x + 7) =
                                          // xy + x^2 + 7x + 3y + 3x + 21 =
                                          // x^2 + xy + 10x + 3y + 21

        expect(answer.toString()).toEqual("x^2 + xy + 10x + 3y + 21");
    });

    it("should remove terms that cancel out", function() {
        var newX = x.add(y); // x + y
        var newY = x.subtract(y); // x - y

        var answer = newX.multiply(newY); // (x + y) * (x - y) =
                                          // x^2 - xy + xy - y^2 =
                                          // x^2 - y^2

        expect(answer.toString()).toEqual("x^2 - y^2")
    });

    it("should multiply by variables passed in as strings - same var", function() {
        var answer = x.multiply("x");

        expect(answer.toString()).toEqual("x^2");
    });

    it("should multiply by variables passed in as strings - different var", function() {
        var answer = x.multiply("y");

        expect(answer.toString()).toEqual("xy");
    });

    it("should allow for unsimplified terms - single var", function() {
        var answer = x.multiply(x);
        answer = answer.multiply(x, false); // x^2x

        expect(answer.toString()).toEqual("x^2x");
    });

    it("should allow for unsimplified terms - var and constant", function() {
        var answer = x.add(x, false); // x + x
        answer = answer.multiply(5, false); // 5x + 5x

        expect(answer.toString()).toEqual("5x + 5x");
    });

    it("should allow for unsimplified terms - multiple vars and constant", function() {
        var answer = x.add(y); // x + y
        answer = answer.multiply(2); // 2x + 2y
        answer = answer.add(5); // 2x + 2y + 5

        answer = answer.multiply(3, false); // 3 * 2x + 3 * 2y + 15

        expect(answer.toString()).toEqual("3 * 2x + 3 * 2y + 3 * 5");
    });
});

describe("Expression division", function() {
    var x = new Expression("x");
    var y = new Expression("y");

    it("should allow dividing by a fraction", function() {
        var answer = x.divide(new Fraction(1, 3));

        expect(answer.toString()).toEqual("3x");
    });

    it("should allow dividing by an integer", function() {
        var answer = x.divide(5);

        expect(answer.toString()).toEqual("1/5x");
    });

    it("should not allow dividing by another expression", function() {
        expect(function(){x.divide(y)}).toThrow("InvalidArgument");
    });

    it("should throw an exception if dividing by zero", function() {
        expect(function(){x.divide(0)}).toThrow("DivideByZero");
    });

    it("should allow for unsimplified terms and constants", function() {
        var exp1 = new Expression("x").multiply(2); // 2x
        var exp2 = new Expression("x").multiply(4); // 4x

        var answer = exp1.add(exp2, false); // 2x + 4x

        answer = answer.add(2, false);
        answer = answer.add(4, false); // 2x + 4x + 2 + 4

        answer = answer.divide(2, false); // 2/2x + 4/2x + 2/2 + 4/2

        expect(answer.toString()).toEqual("2/2x + 4/2x + 2/2 + 4/2");
    });
});

describe("Expression printing to string", function() {
    it("should put a negative sign on the first term if it's negative", function() {
        var x = new Expression("x");
        x = x.multiply(-1);
        x = x.add(3);

        expect(x.toString()).toEqual("-x + 3");
    });

    it("should get the signs right", function() {
        var x = new Expression("x");
        var y = new Expression("y");
        var z = new Expression("z");

        x = x.add(y).subtract(z).add(5);

        expect(x.toString()).toEqual("x + y - z + 5");
    });

    it("should omit the constant if it's 0", function() {
        var x = new Expression("x");
        x = x.add(3);
        x = x.subtract(3);

        expect(x.toString()).toEqual("x");
    });

    it("should only print the constant if all the other terms have been canceled out", function() {
        var x = new Expression("x");
        var y = new Expression("y");

        var expr1 = x.add(y).subtract(3);   // x + y - 3
        var expr2 = x.add(y);               // x + y

        var answer = expr1.subtract(expr2); // x + y - 3 - (x + y) = -3

        expect(answer.toString()).toEqual("-3");
    });
});

describe("Expression printing to tex", function() {
    it("should put a negative sign on the first term if it's negative", function() {
        var x = new Expression("x");
        x = x.multiply(-1);
        x = x.add(3);

        expect(x.toTex()).toEqual("-x + 3");
    });

    it("should get the signs right", function() {
        var x = new Expression("x");
        var y = new Expression("y");
        var z = new Expression("z");

        x = x.add(y).subtract(z).add(5);

        expect(x.toTex()).toEqual("x + y - z + 5");
    });

    it("should omit the constant if it's 0", function() {
        var x = new Expression("x");
        x = x.add(3);
        x = x.subtract(3);

        expect(x.toTex()).toEqual("x");
    });

    it("should only print the constant if all the other terms have been canceled out", function() {
        var x = new Expression("x");
        var y = new Expression("y");

        var expr1 = x.add(y).subtract(3);   // x + y - 3
        var expr2 = x.add(y);               // x + y

        var answer = expr1.subtract(expr2); // x + y - 3 - (x + y) = -3

        expect(answer.toTex()).toEqual("-3");
    });
});

describe("Expression evaluation with one variable - linear", function() {
    var x = new Expression("x");
    x = x.add(3);

    it("should allow evaluating at integers", function() {
        var answer = x.eval({'x': 2});

        expect(answer.toString()).toEqual("5");
    });

    it("should allow evaluating at fractions", function() {
        var answer = x.eval({'x': new Fraction(1, 5)});

        expect(answer.toString()).toEqual("16/5");
    });
});

describe("Expression evaluation with one variable - nonlinear", function() {
    var x = new Expression("x");
    var x2 = x.multiply(x).add(x).add(3); // x^2 + x + 3

    it("should allow evaluating at integers", function() {
        var answer = x2.eval({x: 2}); // 2^2 + 2 + 3 = 9

        expect(answer.toString()).toEqual("9");
    });

    it("should allow evaluating at fractions", function() {
        var answer = x2.eval({x: new Fraction(1, 5)}); // (1/5)^2 + 1/5 + 3 = 81/25

        expect(answer.toString()).toEqual("81/25");
    });
});

describe("Expression evaluation with multiple variables - linear", function() {
    var x = new Expression("x");
    var y = new Expression("y");
    var z = x.add(y); // x + y

    it("should return an expression when not substituting all the variables", function() {
        var answer = z.eval({x: 3});

        expect(answer.toString()).toEqual("y + 3");
    });

    it("should return a fraction when substituting all the variables", function() {
        var answer = z.eval({x: 3, y: new Fraction(1, 2)});

        expect(answer.toString()).toEqual("7/2");
    });

    it("should return a fraction when substituting variables out of order", function() {
        var answer = z.eval({y: new Fraction(1, 2), 'x': 3});

        expect(answer.toString()).toEqual("7/2");
    });
});

describe("Expression evaluation with multiple variables - nonlinear", function() {
    var x = new Expression("x");
    var y = new Expression("y");

    it("should return an expression when not substituting all the variables", function() {
        var x1 = x.multiply(x).add(x).subtract(y); // x^2 + x - y

        var answer = x1.eval({x:3}); // 3^2 + 3 - y = -y + 12

        expect(answer.toString()).toEqual("-y + 12");
    });

    it("should return a fraction when substituting all the variables", function() {
        var x1 = x.multiply(x).add(x).subtract(y); // x^2 + x - y

        var answer = x1.eval({x: 3, y: new Fraction(1, 2)}); // 3^2 + 3 - 1/2 = 23/2

        expect(answer.toString()).toEqual("23/2");
    });

    it("should return a fraction when substituting variables out of order", function() {
        var x1 = x.multiply(x).add(x).subtract(y); // x^2 + x - y

        var answer = x1.eval({y: new Fraction(1, 2), x: 3});

        expect(answer.toString()).toEqual("23/2");
    });
});

describe("Expression evaluation with multiple variables - crossproducts", function() {
    var x = new Expression("x");
    var y = new Expression("y");

    it("should return an expression when not substituting all the variables", function() {
        var x1 = x.multiply(x).multiply(y).add(x); // x^2y + x

        var answer = x1.eval({x:3}); // 3^2y + 3 = 9y + 3

        expect(answer.toString()).toEqual("9y + 3");
    });

    it("should return a reduced fraction when substituting all the variables", function() {
        var x1 = x.multiply(x).multiply(y).add(x); // x^2y + x

        var answer = x1.eval({y: new Fraction(1, 2), x:3}); // 3^2 * (1/2) + 3 = 15/2

        expect(answer.toString()).toEqual("15/2");
    });
});

describe("Expression evaulation with other expressions", function() {
    it("works with no coefficient", function() {
       var x = new Expression("x").add(2);   // x + 2
       var sub = new Expression("y").add(4); // y + 4

       var answer = x.eval({x:sub}); // (y + 4) + 2 = y + 6
       expect(answer.toString()).toEqual("y + 6");
    });

    it("works with a coefficient", function() {
        var x = new Expression("x").multiply(2).add(2); // 2x + 2
        var sub = new Expression("y").add(4); // y + 4

        var answer = x.eval({x:sub}); // 2(y + 4) + 2 = 2y + 8 + 2 = 2y + 10
        expect(answer.toString()).toEqual("2y + 10");
    });

    it("works with cross products", function() {
        var x = new Expression("x").multiply("y").add(2); // xy + 2
        var sub = new Expression("y").add(4); // y + 4

        var answer = x.eval({x:sub}); // (y + 4)y + 2 = y^2 + 4y + 2
        expect(answer.toString()).toEqual("y^2 + 4y + 2");
    });

    it("works with powers", function() {
        var x = new Expression("x").multiply("x").add("x").add(2); // x^2 + x + 2
        var sub = new Expression("y").add(4); // y + 4

        var answer = x.eval({x:sub}); // (y + 4)^2 + (y + 4) + 2 = y^2 + 9y + 22
        expect(answer.toString()).toEqual("y^2 + 9y + 22");
    });
});

describe("Expression evaluation with unsimplified expressions", function() {
    it("works with multiple of the same variable", function() {
        var exp = new Expression("x").add("x", false); // x + x
        var answer = exp.eval({x:2}, false);

        expect(answer.toString()).toEqual("2 + 2");
    });

    it("works with multiples of different variables", function() {
        var exp = new Expression("x").add("x", false).add("y", false); // x + x + y
        var answer = exp.eval({x:2}, false);
        expect(answer.toString()).toEqual("y + 2 + 2");
    });

    it("works with cross products", function() {
        var exp = new Expression("x").multiply("y"); // xy
        exp = exp.add(exp, false); // xy + xy
        var answer = exp.eval({x:2}, false);
        expect(answer.toString()).toEqual("2y + 2y");
    });

    it("works when there's multiple coefficients", function() {
        var exp = new Expression("x").multiply(5).multiply(4, false); // 4 * 5x
        var answer = exp.eval({x:2}, false);
        expect(answer.toString()).toEqual("4 * 5 * 2");

    });

    it("works when substituting in another expression", function() {
        var exp = new Expression("x").multiply("x", false); // xx
        var sub = new Expression("y").add(4); // y + 4

        var answer = exp.eval({x: sub}, false);
        expect(answer.toString()).toEqual("yy + 4y + 4y + 4 * 4");
    });
});

describe("Checking for cross products in expressions", function() {
    it("should return true if there are no cross products", function() {
        var expr = new Expression("x").add("y");
        cross = expr._noCrossProductsWithVariable("x");
        expect(cross).toBe(true);
    });

    it("should return false if there are cross products", function() {
        var expr = new Expression("x").multiply("y").add("x");
        cross = expr._noCrossProductsWithVariable("x");
        expect(cross).toBe(false);
    });
});

describe("Raising expressions to powers", function() {
    var x = new Expression("x").add(2);

    it("should return 1 if power is 0", function() {
        var answer = x.pow(0);
        expect(answer.toString()).toEqual("1");
    });

    it("should return the original expression if power is 1", function() {
        var answer = x.pow(1);
        expect(answer.toString()).toEqual("x + 2");
    });

    it("should work with power 2", function() {
        var answer = x.pow(2);
        expect(answer.toString()).toEqual("x^2 + 4x + 4");
    });

    it("should work with power 3", function() {
        var answer = x.pow(3);
        expect(answer.toString()).toEqual("x^3 + 6x^2 + 12x + 8");
    });

    it("should allow unsimplified expression", function() {
        var answer = x.pow(2, false);

        expect(answer.toString()).toEqual("xx + 2x + 2x + 2 * 2");
    });
});

describe("Expression sorting", function() {
    it("should sort by degree of the term", function() {
        var x2 = new Expression("x").multiply("x");
        var exp = new Expression("x").add(x2); // x + x^2
        exp._sort();
        expect(exp.toString()).toEqual("x^2 + x");
    });

    it("should sort by the number of variables in the term", function() {
        var x2 = new Expression("x").multiply("x");
        var exp = x2.add(x2.multiply("y")); // x^2 + x^2y
        exp._sort();
        expect(exp.toString()).toEqual("x^2y + x^2");
    });
});

describe("Expression simplification", function() {
    it("should combine terms", function() {
        var exp = new Expression("x").add(2).add("x", false); // x + x + 2

        expect(exp.toString()).toEqual("x + x + 2");

        var sim = exp.simplify();

        expect(sim.toString()).toEqual("2x + 2");
    });

    it("should combine constants", function() {
        var exp = new Expression("x").add(2).add(4, false); // x + 2 + 4

        expect(exp.toString()).toEqual("x + 2 + 4");

        var sim = exp.simplify();

        expect(sim.toString()).toEqual("x + 6");
    });

    it("should combine terms and constants", function() {
        var exp = new Expression("x").add(2);
        exp = exp.add("x", false);
        exp = exp.add(4, false);

        expect(exp.toString()).toEqual("x + x + 2 + 4");

        var sim = exp.simplify();

        expect(sim.toString()).toEqual("2x + 6");
    });

    it("should combine unsimplified terms with multiple coefficients", function() {
        var answer = new Expression("x").add("y"); // x + y
        answer = answer.multiply(2); // 2x + 2y
        answer = answer.add(5); // 2x + 2y + 5

        answer = answer.multiply(3, false); // 3 * 2x + 3 * 2y + 15
        answer = answer.simplify();

        expect(answer.toString()).toEqual("6x + 6y + 15");
    });

    it("should properly move terms with no variables into the constants", function() {
        var answer = new Expression("x").add("x", false); // x + x
        answer = answer.multiply(2, false); // 2x + 2x
        answer = answer.add(5, false); // 2x + 2x + 5
        answer = answer.add(6, false); // 2x + 2x + 5 + 6

        answer = answer.multiply(3, false); // 3 * 2x + 3 * 2x + 3 * 5 + 3 * 6

        answer = answer.simplify(); // 12x + 33

        expect(answer.toString()).toEqual("12x + 33");
    })
});describe("Expression summation", function() {
	it("should return a sum expressions whose variables have been substituted", function() {
		var xplus3 = new Expression("x").add(3);
		var ans = xplus3.summation(new Expression("x"), 3, 6);
		expect(ans.toString()).toEqual("30");
	});

    it("should sum over expressions with multiple variables", function() {
        var exp = new Expression("x").add("y").add(3); // x + y + 3

        var answer = exp.summation("x", 3, 6);

        expect(answer.toString()).toEqual("4y + 30");
    });
});