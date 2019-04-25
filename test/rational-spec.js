var Expression = require('../src/expressions').Expression;
var Term = require('../src/expressions').Term;
describe('Rational Addition', function() {
    var x = new Expression('x');
    var y = new Expression('y');
    it('allow adding constants', function() {
        var a = x.add(3).divide(y.subtract(1)); // (x + 3) / (y - 1)
        var answer = a.add(3);
        expect(answer.toString()).toEqual("(x + 3y) / (y - 1)");
    });
    it('allow adding Terms', function() {
        var a = x.add(3).divide(y.subtract(1)); // (x + 3) / (y - 1)
        var answer = a.add(x.terms[0]);
        expect(answer.toString()).toEqual("(xy + 3) / (y - 1)");
    });
    it('should only sum numerators of rationals with like denominators', function() {
        var a = x.add(3).divide(y.subtract(1)); // (x + 3) / (y - 1)
        var b = y.subtract(2).divide(y.subtract(1)); // (y - 2) / (y - 1)
        var answer = a.add(b);
        expect(answer.toString()).toEqual("(x + y + 1) / (y - 1)");
    });

    it('should correctly combine rationals with unlike denominators', function() {
        var a = x.add(3).divide(y.add(1)); // (x + 3) / (y + 1)
        var b = y.subtract(2).divide(y.subtract(1)); // (y - 2) / (y - 1)
        var answer = a.add(b);
        expect(answer.toString()).toEqual("(y^2 + xy - x + 2y - 5) / (y^2 - 1)");
    });
});

describe('Rational Subtraction', function() {
    var x = new Expression('x');
    var y = new Expression('y');
    it('allow subtracting constants', function() {
        var a = x.add(3).divide(y.subtract(1)); // (x + 3) / (y - 1)
        var answer = a.subtract(3);
        expect(answer.toString()).toEqual("(x - 3y + 6) / (y - 1)");
    });
    it('allow subtracting Terms', function() {
        var a = x.add(3).divide(y.subtract(1)); // (x + 3) / (y - 1)
        var answer = a.subtract(x.terms[0]);
        expect(answer.toString()).toEqual("(-xy + 2x + 3) / (y - 1)");
    });
    it('should only take difference of numerators in rationals with like denominators', function() {
        var a = x.add(3).divide(y.subtract(1)); // (x + 3) / (y - 1)
        var b = y.subtract(2).divide(y.subtract(1)); // (y - 2) / (y - 1)
        var answer = a.subtract(b);
        expect(answer.toString()).toEqual("(x - y + 5) / (y - 1)");
    });

    it('should correctly combine rationals with unlike denominators', function() {
        var a = x.add(3).divide(y.add(1)); // (x + 3) / (y + 1)
        var b = y.subtract(2).divide(y.subtract(1)); // (y - 2) / (y - 1)
        var answer = a.subtract(b);
        expect(answer.toString()).toEqual("(-y^2 + xy - x + 4y - 1) / (y^2 - 1)");
    });
});

describe('Rational Multiplication', function() {
    var x = new Expression('x');
    var y = new Expression('y');
    it('should allow multiplying by constants', function() {
        var a = x.add(3).divide(y.subtract(1)); // (x + 3) / (y - 1)
        var answer = a.multiply(3);
        expect(answer.toString()).toEqual("(3x + 9) / (y - 1)");
    });
    it('should allow multiplying by Terms', function() {
        var a = x.add(3).divide(y.subtract(1)); // (x + 3) / (y - 1)
        var answer = a.multiply(x.terms[0]);
        expect(answer.toString()).toEqual("(x^2 + 3x) / (y - 1)");
    });
    it('should correctly determine the product of two Rationals', function() {
        var a = x.add(3).divide(y.subtract(1)); // (x + 3) / (y - 1)
        var b = y.subtract(2).divide(y.subtract(1)); // (y - 2) / (y - 1)
        var answer = a.multiply(b);
        expect(answer.toString()).toEqual("(xy - 2x + 3y - 6) / (y^2 - 2y + 1)");
    });
});

describe('Rational Division', function() {
    var x = new Expression('x');
    var y = new Expression('y');
    it('should allow dividing by constants', function() {
        var a = x.add(3).divide(y.subtract(1)); // (x + 3) / (y - 1)
        var answer = a.divide(3);
        expect(answer.toString()).toEqual("(x + 3) / (3y - 3)");
    });
    it('should allow dividing by Terms', function() {
        var a = x.add(3).divide(y.subtract(1)); // (x + 3) / (y - 1)
        var answer = a.divide(x.terms[0]);
        expect(answer.toString()).toEqual("(x + 3) / (yx - x)");
    });
    it('should correctly determine the quotient resulting from dividing two Rationals', function() {
        var a = x.add(3).divide(y.subtract(1)); // (x + 3) / (y - 1)
        var b = y.subtract(2).divide(y.subtract(1)); // (y - 2) / (y - 1)
        var answer = a.divide(b);
        expect(answer.toString()).toEqual("(xy - x + 3y - 3) / (y^2 - 3y + 2)");
    });
});

describe('Rational Simplification', function() {
    var x = new Expression('x');
    var y = new Expression('y');
    it('should correctly reduce the expression', function() {
        var a = x.multiply(3).add(9).divide(y.multiply(3).subtract(3)); // (3x + 9) / (3y - 3)
        var answer = a.simplify();
        expect(answer.toString()).toEqual("(x + 3) / (y - 1)");
    });
});