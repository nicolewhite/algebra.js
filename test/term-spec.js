var Variable = require('../src/variables');
var Term = require('../src/terms');
var Fraction = require('../src/fractions');
var InternalException = require('../src/exceptions');

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
        expect(answer.print()).toEqual("2x")
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
        expect(answer.print()).toEqual("x")
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
        expect(answer.print()).toEqual("6x^2");
    });

    it("combines degrees correctly", function() {
        var x = new Variable("x");
        x.degree = 2;
        var t1 = new Term(x);
        x.degree = 3;
        var t2 = new Term(x);

        answer = t1.multiply(t2);
        expect(answer.print()).toEqual("x^5");
    });

    it("combines unlike terms correctly", function() {
        var x = new Variable("x");
        var y = new Variable("y");
        var t1 = new Term(x);
        var t2 = new Term(y);

        t1.coefficient = new Fraction(2, 1);
        t2.coefficient = new Fraction(3, 1);

        answer = t1.multiply(t2);
        expect(answer.print()).toEqual("6xy")
    });
});

describe("Term division", function() {
    it("combines coefficients correctly", function() {
        var x = new Variable("x");
        x.degree = 2;
        var t1 = new Term(x);
        x.degree = 1;
        var t2 = new Term(x);

        t1.coefficient = new Fraction(2, 1);
        t2.coefficient = new Fraction(3, 1);

        answer = t1.divide(t2);
        expect(answer.print()).toEqual("6x");
    });

    it("combines degrees correctly", function() {
        var x = new Variable("x");
        x.degree = 4;
        var t1 = new Term(x);
        x.degree = 2;
        var t2 = new Term(x);

        answer = t1.divide(t2);
        expect(answer.print()).toEqual("x^2");
    });
});