var Fraction = require('../src/fractions');

describe("An invalid fraction", function() {
    it("should throw an exception with a denominator of 0", function() {
        expect(function(){new Fraction(1, 0);}).toThrow("Divide By Zero");
    });

    it("should not initialize with decimals in the numerator", function() {
        expect(function(){new Fraction(0.25, 1);}).toThrow("Invalid Argument (0.25,1): Divisor and dividend must be of type Integer.");
    });

    it("should not initialize with decimals in the denominator", function() {
        expect(function(){new Fraction(1, 0.25);}).toThrow("Invalid Argument (1,0.25): Divisor and dividend must be of type Integer.");
    });

    it("should not initialize with decimals in both the numerator and denominator", function() {
        expect(function(){new Fraction(0.75, 0.25);}).toThrow("Invalid Argument (0.75,0.25): Divisor and dividend must be of type Integer.");
    });
});

describe("A valid, positive fraction", function() {
    var frac = new Fraction(1, 2);

    it("should initialize", function() {
        expect(frac.numer).toBeDefined();
        expect(frac.denom).toBeDefined();
    });

    it("should print to string properly", function() {
        expect(frac.toString()).toEqual("1/2");
    });

    it("should print to tex properly", function() {
        expect(frac.toTex()).toEqual("\\frac{1}{2}");
    });

    it("should coerce to a number properly", function() {
        expect(frac.valueOf()).toEqual(0.5);
    });
});

describe("A valid fraction with a negative numerator", function() {
    var frac = new Fraction(-1, 2);

    it("should initialize", function() {
        expect(frac.numer).toBeDefined();
        expect(frac.denom).toBeDefined();
    });

    it("should print to string properly", function() {
        expect(frac.toString()).toEqual("-1/2");
    });

    it("should print to tex with the negative in the numerator", function() {
        expect(frac.toTex()).toEqual("\\frac{-1}{2}");
    });

    it("should coerce to a valueOf properly", function() {
        expect(frac.valueOf()).toEqual(-0.5);
    });
});

describe("A valid fraction with a negative denominator", function() {
    var frac = new Fraction(2, -4);

    it("should initialize", function() {
        expect(frac.numer).toBeDefined();
        expect(frac.denom).toBeDefined();
    });

    it("should print to string with a negative numerator after being reduced", function() {
        var red = frac.reduce();
        expect(red.toString()).toEqual("-1/2");
    });

    it("should print to tex with a negative numerator", function() {
        var red = frac.reduce();
        expect(red.toTex()).toEqual("\\frac{-1}{2}");
    });

    it("should bring the negative up to the numerator when reduced", function() {
        var reduced = frac.reduce();
        expect(reduced.numer).toEqual(-1);
        expect(reduced.denom).toEqual(2);
    });

    it("should coerce to a valueOf properly", function() {
        expect(frac.valueOf()).toEqual(-0.5);
    });
});

describe("Fractions with 1 in the denominator", function() {
    var frac = new Fraction(5, 1);

    it("should initialize", function() {
        expect(frac.numer).toBeDefined();
        expect(frac.denom).toBeDefined();
    });

    it("should print to string with positive integers", function() {
        expect(frac.toString()).toEqual("5");
    });

    it("should print to tex with positive integers", function() {
        expect(frac.toTex()).toEqual("5");
    });
});

describe("A Fraction representing zero", function() {
    var frac = new Fraction(0, 1);

    it("should initialize", function() {
        expect(frac.numer).toBeDefined();
        expect(frac.denom).toBeDefined();
    });

    it("should print to string with zero", function() {
        expect(frac.toString()).toEqual("0");
    });

    it("should print to tex with zero", function() {
        expect(frac.toTex()).toEqual("0");
    });
});

describe("Fractions with -1 in the denominator", function() {
    var frac = new Fraction(5, -1);

    it("should initialize", function() {
        expect(frac.numer).toBeDefined();
        expect(frac.denom).toBeDefined();
    });

    it("should print to string with negative integers", function() {
        expect(frac.toString()).toEqual("-5");
    });

    it("should print to tex with negative integers", function() {
        expect(frac.toTex()).toEqual("-5");
    });
});

describe("Fraction addition", function() {
    var x = new Fraction(1, 3);

    it("should allow addition of other fractions", function() {
        var y = new Fraction(1, 5);
        var answer = x.add(y);

        expect(answer.toString()).toEqual("8/15");
    });

    it("should allow addition of integers", function() {
        var answer = x.add(2);

        expect(answer.toString()).toEqual("7/3");
    });

    it("should not allow addition of floats", function() {
        expect(function(){x.add(0.25);}).toThrow("Invalid Argument (0.25): Summand must be of type Fraction or Integer.");
    });

    it("should return a reduced version of the answer", function() {
        var y = new Fraction(2, 3);
        var answer = x.add(y);

        expect(answer.toString()).toEqual("1");
    });

    it("should allow an answer of 0", function() {
        var y = new Fraction(-1, 3);
        var answer = x.add(y);

        expect(answer.toString()).toEqual("0");
    });
});

describe("Fraction subtraction", function() {
    var x = new Fraction(1, 3);

    it("should allow subtraction of other fractions", function() {
        var y = new Fraction(1, 5);
        var answer = x.subtract(y);

        expect(answer.toString()).toEqual("2/15");
    });

    it("should allow subtraction of integers", function() {
        var answer = x.subtract(2);

        expect(answer.toString()).toEqual("-5/3");
    });

    it("should not allow subtraction of floats", function() {
        expect(function(){x.subtract(0.25);}).toThrow("Invalid Argument (0.25): Subtrahend must be of type Fraction or Integer.");
    });

    it("should return a reduced version of the answer", function() {
        var y = new Fraction(4, 6);
        var answer = x.subtract(y);

        expect(answer.toString()).toEqual("-1/3");
    });

    it("should allow an answer of 0", function() {
        var y = new Fraction(1, 3);
        var answer = x.subtract(y);

        expect(answer.toString()).toEqual("0");
    });
});

describe("Fraction multiplication", function() {
    var x = new Fraction(1, 2);

    it("should allow multplication of other fractions", function() {
        var y = new Fraction(1, 2);
        var answer = x.multiply(y);

        expect(answer.toString()).toEqual("1/4");
    });

    it("should allow multiplication of integers", function() {
        var answer = x.multiply(5);

        expect(answer.toString()).toEqual("5/2");
    });

    it("should not allow multiplication of floats", function() {
        expect(function(){x.multiply(0.25);}).toThrow("Invalid Argument (0.25): Multiplicand must be of type Fraction or Integer.");
    });

    it("should allow multiplication of zero", function() {
        var answer = x.multiply(0);

        expect(answer.toString()).toEqual('0');
    });
});

describe("Fraction division", function() {
    var x = new Fraction(1, 2);

    it("should allow division of other fractions", function() {
        var y = new Fraction(1, 2);
        var answer = x.divide(y);

        expect(answer.toString()).toEqual("1");
    });

    it("should allow division of integers", function() {
        var answer = x.divide(5);

        expect(answer.toString()).toEqual("1/10");
    });

    it("should not allow division of floats", function() {
        expect(function(){x.divide(0.25);}).toThrow("Invalid Argument (0.25): Divisor must be of type Fraction or Integer.");
    });

    it("should not allow division by zero", function() {
        expect(function(){x.divide(0);}).toThrow("Divide By Zero");
    });
});

describe("Fraction equality", function() {
    var x = new Fraction(1, 2);

    it("should be true when the fractions are equal", function() {
        var y = new Fraction(2, 4);
        expect(x.equalTo(y)).toBe(true);
    });

    it("should be false when the fractions are not equal", function() {
        var y = new Fraction(2, 3);
        expect(x.equalTo(y)).toBe(false);
    });

    it("should be false when tested against a non-fraction type", function() {
        expect(x.equalTo(2)).toBe(false);
    });
});

describe("Fraction exponentiation", function() {
    var x = new Fraction(1, 2);

    it("should return 1/1 if n = 0", function() {
        answer = x.pow(0);

        expect(answer.equalTo(new Fraction(1, 1))).toBe(true);
    });

    it("should return itself if n = 1", function() {
        answer = x.pow(1);

        expect(answer.equalTo(new Fraction(1, 2))).toBe(true);
    });

    it("should work with n > 1", function() {
        answer = x.pow(3);

        expect(answer.equalTo(new Fraction(1, 8))).toBe(true);
    });

    it("should work with n < 1", function() {
        var frac = new Fraction(1, 4);
        var squareRootFrac = frac.pow(0.5);
        expect(squareRootFrac.equalTo(new Fraction(1, 2))).toBe(true);
    });

    it("should return a reduced answer", function() {
        var frac = new Fraction(2, 4);    // 2/4
        var squareFrac = frac.pow(2); // 2^2/4^2 = 4/16 = 1/4
        expect(squareFrac.numer).toEqual(1);
        expect(squareFrac.denom).toEqual(4);
    });
});

describe("Checking if the square root of a fraction is rational", function() {
    it("should return true if it's 0", function() {
        var frac = new Fraction(0, -7);
        expect(frac._squareRootIsRational()).toBe(true);
    });

    it("should return true if it's rational", function() {
        var frac = new Fraction(1, 4);
        expect(frac._squareRootIsRational()).toBe(true);
    });

    it("should return false if it's irrational", function() {
        var frac = new Fraction(2, 4);
        expect(frac._squareRootIsRational()).toBe(false);
    });
});

describe("Checking if the cube root of a fraction is rational", function() {
    it("should return true if it's 0", function() {
        var frac = new Fraction(0, -7);
        expect(frac._cubeRootIsRational()).toBe(true);
    });

    it("should return true if it's rational", function() {
        var frac = new Fraction(1, 8);
        expect(frac._cubeRootIsRational()).toBe(true);
    });

    it("should return true if it's rational and negative", function() {
        var frac = new Fraction(1, -8);
        expect(frac._cubeRootIsRational()).toBe(true);
    });

    it("should return false if it's irrational", function() {
        var frac = new Fraction(2, 4);
        expect(frac._cubeRootIsRational()).toBe(false);
    });
});

describe("Fraction simplification", function() {
    it("works with addition", function() {
        var frac = new Fraction(1, 2); // 1/2
        frac = frac.add(new Fraction(1, 2), false); // 1/2 + 1/2 = 2/2

        expect(frac.toString()).toEqual("2/2");
    }) ;

    it("works with subtraction", function() {
        var frac = new Fraction(3, 4); // 3/4
        frac = frac.subtract(new Fraction(1, 4), false); // 3/4 - 1/4 = 2/4

        expect(frac.toString()).toEqual("2/4");
    });

    it("works with multiplication", function() {
        var frac = new Fraction(1, 6); // 1/6
        frac = frac.multiply(new Fraction(-2, 6), false); // 1/6 * -2/6 = -2/36

        expect(frac.toString()).toEqual("-2/36");
    });

    it("works with division", function() {
        var frac = new Fraction(1, 2); // 1/2
        frac = frac.divide(new Fraction(2, 4), false); // 1/2 / 2/4 = 4/4

        expect(frac.toString()).toEqual("4/4");
    });

    it("works with powers", function() {
        var frac = new Fraction(2, 4); // 2/4

        frac = frac.pow(2, false); // 2^2 / 4^2 = 4/16

        expect(frac.toString()).toEqual("4/16");
    });

    it("stays unsimplified when asking for the absolute value", function() {
        var frac = new Fraction(-2, 4);
        frac = frac.abs();

        expect(frac.toString()).toEqual("2/4");
    });

    it("leaves negatives in the denominator", function() {
        var frac = new Fraction(1, 2); // 1/2
        frac = frac.multiply(new Fraction(2, -4), false); // 1/2 * 2/-4 = 2/-8

        expect(frac.toString()).toEqual("2/-8");
    });

    it("returns the lcm in the denom when adding two fractions", function() {
        var frac = new Fraction(1, 6); // 1/6
        frac = frac.add(new Fraction(1, 3), false); // 1/6 + 1/3 = 1/6 + 2/3 = 3/6

        expect(frac.toString()).toEqual("3/6");
    });
});