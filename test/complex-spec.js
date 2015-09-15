var Fraction = require('../src/fractions');
var Complex = require('../src/complex');


describe("Complex number initialization", function(){

    it("should be defined when initialized correctly", function() {
        var c = new Complex(new Fraction(2, 1), new Fraction(3, 1)); // 2 + 3i
        expect(c).toBeDefined();
    });

    it("should throw an error if initialized with an integer for the real part", function() {
        expect(function(){new Complex(2, new Fraction(3, 1));}).toThrow("Invalid Argument (2, 3): Real and imaginary parts must be of type Fraction.");
    });

    it("should throw an error if initialized with an integer for the imaginary part", function() {
        expect(function(){new Complex(new Fraction(3, 1),2);}).toThrow("Invalid Argument (3, 2): Real and imaginary parts must be of type Fraction.");
    });

});

describe("Complex number addition", function() {
    var c = new Complex(new Fraction(2, 1), new Fraction(3, 1)); // 2 + 3i

    it("works with adding integers", function() {
        var answer = c.add(3); // 5 + 3i
        expect(answer.real.toString()).toEqual("5");
        expect(answer.imaginary.toString()).toEqual("3");
    });

    it("works with adding fractions", function() {
        var answer = c.add(new Fraction(1, 2)); // 5/2 + 3i
        expect(answer.real.toString()).toEqual("5/2");
        expect(answer.imaginary.toString()).toEqual("3");
    });

    it("does not work with adding floats", function() {
        expect(function(){c.add(0.1);}).toThrow("Invalid Argument (0.1): Summand must be of type Complex, Fraction or Integer.");
    });

    it("works with adding other complex numbers", function() {
        var other = new Complex(new Fraction(3, 1), new Fraction(4, 1)); // 3 + 4i
        var answer = c.add(other);
        expect(answer.real.toString()).toEqual("5");
        expect(answer.imaginary.toString()).toEqual("7");
    });
});

describe("Complex number subtraction", function() {
    var c = new Complex(new Fraction(2, 1), new Fraction(3, 1)); // 2 + 3i

    it("works with integers", function() {
        var answer = c.subtract(3); // -1 + 3i
        expect(answer.real.toString()).toEqual("-1");
        expect(answer.imaginary.toString()).toEqual("3");
    });

    it("works with fractions", function() {
        var answer = c.subtract(new Fraction(1, 2)); // 3/2 + 3i
        expect(answer.real.toString()).toEqual("3/2");
        expect(answer.imaginary.toString()).toEqual("3");
    });

    it("does not work with subtracting floats", function() {
        expect(function(){c.subtract(0.1);}).toThrow("Invalid Argument (0.1): Subtrahend must be of type Complex, Fraction or Integer.");
    });

    it("works with other complex numbers", function() {
        var other = new Complex(new Fraction(5, 1), new Fraction(3, 1)); // 5 + 3i
        var answer = c.subtract(other); // -3 + 0i
        expect(answer.real.toString()).toEqual("-3");
        expect(answer.imaginary.toString()).toEqual("0");
    });
});

describe("Complex number multiplication", function() {
    var c = new Complex(new Fraction(2, 1), new Fraction(3, 1)); // 2 + 3i

    it("works with an integer", function() {
        var answer = c.multiply(3); // 3(2 + 3i) = 6 + 9i
        expect(answer.real.toString()).toEqual("6");
        expect(answer.imaginary.toString()).toEqual("9");
    });

    it("works with a fraction", function() {
        var answer = c.multiply(new Fraction(1, 3)); // 1/3(2 + 3i) = 2/3 + i
        expect(answer.real.toString()).toEqual("2/3");
        expect(answer.imaginary.toString()).toEqual("1");
    });

    it("does not work with multiplying floats", function() {
        expect(function(){c.multiply(0.1);}).toThrow("Invalid Argument (0.1): Multiplicand must be of type Complex, Fraction or Integer.");
    });

    it("works with other complex numbers, positive sign", function() {
        var other = new Complex(new Fraction(5, 1), new Fraction(3, 1)); // 5 + 3i

        // (2 + 3i)(5 + 3i)
        // = 10 + 6i + 15i + 9i^2
        // = 10 + 21i - 9
        // = 1 + 21i

        var answer = c.multiply(other);
        expect(answer.real.toString()).toEqual("1");
        expect(answer.imaginary.toString()).toEqual("21");
    });

    it("works with other complex numbers, negative sign", function() {
        var other = new Complex(new Fraction(5, 1), new Fraction(-3, 1)); // 5 - 3i

        // (2 + 3i)(5 - 3i) =
        // 10 - 6i + 15i - 9i^2 =
        // 10 + 9i + 9
        // = 19 + 9i

        var answer = c.multiply(other);
        expect(answer.real.toString()).toEqual("19");
        expect(answer.imaginary.toString()).toEqual("9");
    });
});

describe("Complex number division", function() {
    var c = new Complex(new Fraction(2, 1), new Fraction(3, 1)); // 2 + 3i

    it("works with an integer", function() {
        var answer = c.divide(6); // (2 + 3i) / 6 = 1/3 + 1/2i
        expect(answer.real.toString()).toEqual("1/3");
        expect(answer.imaginary.toString()).toEqual("1/2");
    });

    it("works with a fraction", function() {
        var answer = c.divide(new Fraction(1, 2)); // (2 + 3i) / (1/2) = 4 + 6i
        expect(answer.real.toString()).toEqual("4");
        expect(answer.imaginary.toString()).toEqual("6");
    });

    it("does not work with floats", function() {
        expect(function(){c.divide(0.1);}).toThrow("Invalid Argument (0.1): Divisor must be of type Complex, Fraction or Integer.");
    });

    it("works with other complex numbers, positive sign", function() {
        var other = new Complex(new Fraction(5, 1), new Fraction(3, 1)); // 5 + 3i

        // (2 + 3i) / (5 + 3i)
        // = (2 + 3i)(5 - 3i) / (5 + 3i)(5 - 3i)
        // = 10 - 6i + 15i - 9i^2 / 25 -15i + 15i - 9i^2
        // = 10 + 9i + 9 / 25 + 9
        // = 19 + 9i / 34
        // = 19/34 + 9/34i

        var answer = c.divide(other);
        expect(answer.real.toString()).toEqual("19/34");
        expect(answer.imaginary.toString()).toEqual("9/34");
    });

    it("works with other complex numbers, negative sign", function() {
        var other = new Complex(new Fraction(5, 1), new Fraction(-3, 1)); // 5 - 3i

        // (2 + 3i) / (5 - 3i)
        // = (2 + 3i)(5 + 3i) / (5 - 3i)(5 + 3i)
        // = 10 + 6i + 15i + 9i^2 / 25 + 15i - 15i - 9i^2
        // = 10 + 21i - 9 / 25 + 9
        // = 1 + 21i / 34
        // = 1/34 + 21/34i

        var answer = c.divide(other);
        expect(answer.real.toString()).toEqual("1/34");
        expect(answer.imaginary.toString()).toEqual("21/34");
    });
});