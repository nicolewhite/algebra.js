var Fraction = require('../src/fractions');
var Expression = require('../src/expressions');

describe("An expression initialized with a variable name", function() {
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
    it("should allow adding other expressions", function() {
        var x = new Expression("x");
        var y = new Expression("y");
        x = x.add(y);

        expect(x.print()).toEqual("x + y");
    });

    it("should properly combine the constant of two expressions", function() {
        var x = new Expression("x");
        var y = new Expression("y");
        x = x.add(3);                  // x + 3
        y = y.add(new Fraction(1, 4)); // y + 1/4
        x = x.add(y);                  // x + 3 + y + 1/4 => x + y + 13/4

        expect(x.print()).toEqual("x + y + 13/4");
    });

    it("should properly combine the terms of two expressions", function() {
        var x = new Expression("x");
        var y = new Expression("y");
        y = y.add(x); // y + x
        x = x.add(y); // x + y + x => 2x + y

        expect(x.print()).toEqual("2x + y");
    });

    it("should allow adding fractions", function() {
        var x = new Expression("x");
        x = x.add(new Fraction(1, 3));

        expect(x.print()).toEqual("x + 1/3");
    });

    it("should allow adding integers", function() {
        var x = new Expression("x");
        x = x.add(3);

        expect(x.print()).toEqual("x + 3");
    });

    it("should not allow adding floats", function() {
        var x = new Expression("x");
        x = x.add(0.25);

        expect(x).toBeUndefined();
    });
});

describe("Expression subtraction", function() {
    it("should allow subtracting other expressions", function() {
        var x = new Expression("x");
        var y = new Expression("y");
        x = x.subtract(y);

        expect(x.print()).toEqual("x - y");
    });

    it("should properly combine the constant of two expressions", function() {
        var x = new Expression("x");
        var y = new Expression("y");
        x = x.subtract(3);                  // x - 3
        y = y.subtract(new Fraction(1, 4)); // y - 1/4
        x = x.subtract(y);                  // x - 3 - y - (-1/4) => x - y - 12/4 + 1/4 => x - y - 11/4

        expect(x.print()).toEqual("x - y - 11/4")
    });

    it("should properly combine the terms of two expressions", function() {
        var x = new Expression("x");
        var y = new Expression("y");
        y = y.subtract(x); // y - x
        x = x.subtract(y); // x - (y - x) => x - y + x => 2x - y

        expect(x.print()).toEqual("2x - y");
    });

    it("should allow subtracting fractions", function() {
        var x = new Expression("x");
        x = x.subtract(new Fraction(1, 3));

        expect(x.print()).toEqual("x - 1/3");
    });

    it("should allow subtracting integers", function() {
        var x = new Expression("x");
        x = x.subtract(3);

        expect(x.print()).toEqual("x - 3");
    });

    it("should not allow subtracting floats", function() {
        var x = new Expression("x");
        x = x.subtract(0.25);

        expect(x).toBeUndefined();
    });
});

describe("Expression multiplication", function() {
    it("should allow multiplying by a fraction", function() {
        var x = new Expression("x");
        x = x.multiply(new Fraction(1, 3));

        expect(x.print()).toEqual("1/3x");
    });

    it("should allow multiplying by an integer", function() {
        var x = new Expression("x");
        x = x.multiply(5);

        expect(x.print()).toEqual("5x");
    });

    it("should not allow multiplying by another expression", function() {
        var x = new Expression("x");
        var y = new Expression("y");
        x = x.multiply(y);

        expect(x).toBeUndefined();
    });
});

describe("Expression division", function() {
    it("should allow dividing by a fraction", function() {
        var x = new Expression("x");
        x = x.divide(new Fraction(1, 3));

        expect(x.print()).toEqual("3x");
    });

    it("should allow dividing by an integer", function() {
        var x = new Expression("x");
        x = x.divide(5);

        expect(x.print()).toEqual("1/5x");
    });

    it("should not allow dividing by another expression", function() {
        var x = new Expression("x");
        var y = new Expression("y");
        x = x.divide(y);

        expect(x).toBeUndefined();
    });
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

    it("should omit the constant of it's 0", function() {
        var x = new Expression("x");
        x = x.add(3);
        x = x.subtract(3);

        expect(x.print()).toEqual("x");
    });
});