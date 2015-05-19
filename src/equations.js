var Fraction = require('./fractions');
var Expression = require('./expressions');
var isInt = require('./helper').isInt;

var Equation = function(lhs, rhs) {
    if (lhs instanceof Expression) {
        this.lhs = lhs;
        if (rhs instanceof Expression) {
            this.rhs = rhs;
        } else if (rhs instanceof Fraction || isInt(rhs)) {
            this.rhs = new Expression().add(rhs);
        }
    }
};

Equation.prototype.solveFor = function(variable) {
    var newLhs = new Expression();
    var newRhs = new Expression();

    for (i = 0; i < this.rhs.terms.length; i++) {
        var term = this.rhs.terms[i];

        if (term.variable == variable) {
            newLhs = newLhs.subtract(term);
        } else {
            newRhs = newRhs.add(term);
        }
    }

    for (i = 0; i < this.lhs.terms.length; i++) {
        var term = this.lhs.terms[i];

        if (term.variable == variable) {
            newLhs = newLhs.add(term);
        } else {
            newRhs = newRhs.subtract(term);
        }
    }

    newRhs = newRhs.subtract(this.lhs.constant);
    newRhs = newRhs.add(this.rhs.constant);
    newRhs = newRhs.divide(newLhs.terms[0].coefficient);

    if (newRhs.terms.length == 0) {
        return newRhs.constant.reduce();
    }

    return newRhs;
};

Equation.prototype.print = function() {
    return this.lhs.print() + " = " + this.rhs.print();
};

Equation.prototype.tex = function() {
    return this.lhs.tex() + " = " + this.rhs.tex();
};

module.exports = Equation;