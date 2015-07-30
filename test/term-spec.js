var Variable = require('../src/variables');
var Term = require('../src/terms');
var Fraction = require('../src/fractions');

describe("Terms", function() {
    var x = new Variable("x");
    var t = new Term(x);

    it("are initialized with one variable", function() {
       expect(t.variables.length).toEqual(1);
    });

    it("are initialized with a coefficient of 1", function() {
        expect(t.coefficient.equalTo(new Fraction(1, 1))).toBe(true);
    });

    it("can be initialized with nothing", function() {
        var t = new Term();

        expect(t.variables.length).toEqual(0);
        expect(t.coefficient.equalTo(new Fraction(1, 1))).toBe(true);
    });

    it("can't be initialized with an integer", function() {
        expect(function(){new Term(5)}).toThrow("InvalidArgument");
    });

    it("can't be initialized with a float", function() {
        expect(function(){new Term(5.1)}).toThrow("InvalidArgument");
    });

    it("can't be initialized with a string", function() {
        expect(function(){new Term("x")}).toThrow("InvalidArgument");
    })
});

describe("Term addition", function() {
    var x = new Variable("x");
    var y = new Variable("y");

    it("combines like-terms correctly", function() {
        var t1 = new Term(x);
        var t2 = new Term(x);

        answer = t1.add(t2);
        expect(answer.toString()).toEqual("2x")
    });

    it("throws an error if trying to combine unlike terms", function() {
        var t1 = new Term(x);
        var t2 = new Term(y);

        expect(function(){t1.add(t2)}).toThrow("InvalidArgument");
    });
});

describe("Term subtraction", function() {
    var x = new Variable("x");
    var y = new Variable("y");

    it("combines like-terms correctly", function() {
        var t1 = new Term(x);
        var t2 = new Term(x);

        t1.coefficient = new Fraction(2, 1);

        answer = t1.subtract(t2);
        expect(answer.toString()).toEqual("x")
    });

    it("throws an error if trying to combine unlike terms", function() {
        var t1 = new Term(x);
        var t2 = new Term(y);

        expect(function(){t1.subtract(t2)}).toThrow("InvalidArgument");
    });
});

describe("Term multiplication", function() {
    it("combines coefficients correctly", function() {
        var x = new Variable("x");
        var t1 = new Term(x);
        var t2 = new Term(x);

        t1.coefficient = new Fraction(2, 1);
        t2.coefficient = new Fraction(3, 1);

        answer = t1.multiply(t2);
        expect(answer.toString()).toEqual("6x^2");
    });

    it("combines degrees correctly", function() {
        var x = new Variable("x");
        x.degree = 2;
        var t1 = new Term(x);
        x.degree = 3;
        var t2 = new Term(x);

        answer = t1.multiply(t2);
        expect(answer.toString()).toEqual("x^5");
    });

    it("combines unlike terms correctly", function() {
        var x = new Variable("x");
        var y = new Variable("y");
        var t1 = new Term(x);
        var t2 = new Term(y);

        t1.coefficient = new Fraction(2, 1);
        t2.coefficient = new Fraction(3, 1);

        answer = t1.multiply(t2);
        expect(answer.toString()).toEqual("6xy")
    });

    it("allows multiplication of integers", function() {
        var x = new Variable("x");
        var t = new Term(x);

        answer = t.multiply(2);
        expect(answer.toString()).toEqual("2x");
    });

    it("allows multiplication of fractions", function() {
        var x = new Variable("x");
        var t = new Term(x);

        answer = t.multiply(new Fraction(2, 3));
        expect(answer.toString()).toEqual("2/3x");
    });

    it("doesn't allow multiplication of floats", function() {
        var x = new Variable("x");
        var t = new Term(x);

        expect(function(){t.multiply(.5)}).toThrow("InvalidArgument");
    });
});

describe("Term division", function() {
    it("allows division of integers", function() {
        var x = new Variable("x");
        var t = new Term(x);

        answer = t.divide(3);
        expect(answer.toString()).toEqual("1/3x");
    });

    it("allows division of fractions", function() {
        var x = new Variable("x");
        var t = new Term(x);

        answer = t.divide(new Fraction(2, 3));
        expect(answer.toString()).toEqual("3/2x")
    });

    it("doesn't allow division of floats", function() {
        var x = new Variable("x");
        var t = new Term(x);

        expect(function(){t.divide(.5)}).toThrow("InvalidArgument");
    });
});

describe("Term sorting", function() {
    it("sorts variables by degree", function() {
        var x = new Term(new Variable("x"));
        var y = new Term(new Variable("y"));
        var t = y.multiply(x).multiply(x); // yx^2
        t.sort();
        expect(t.toString()).toEqual("x^2y");
    });
});