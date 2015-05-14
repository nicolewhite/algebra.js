var Fraction = require('./fractions');

var Term = function(variable) {
    this.variable = variable;
    this.coefficient = new Fraction(1, 1);
};

Term.prototype.copy = function() {
    var copy = new Term(this.variable);
    copy.coefficient = copy.coefficient.multiply(this.coefficient);
    return copy;
};

Term.prototype.hasTheSameVariableAs = function(term) {
    if (term instanceof Term) {
        if (term.variable == this.variable) {
            return true;
        }
    }

    return false;
};

// These print the absolute value of the coefficient because the plus and minus signs are handled in Expression.print.
Term.prototype.print = function() {
    var coefficient = this.coefficient.reduce();

    if (coefficient.numer == 0) {
        return "";
    } else {
        return ([1, -1].indexOf(coefficient.decimal()) > -1 ? "" : coefficient.abs().print()) + this.variable;
    }
};

Term.prototype.tex = function(type) {
    var coefficient = this.coefficient.reduce();

    if (coefficient.numer == 0) {
        return "";
    } else {
        return ([1, -1].indexOf(coefficient.decimal()) > -1 ? "" : coefficient.abs().tex()) + this.variable;
    }
};

module.exports = Term;