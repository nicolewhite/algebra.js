var Fraction = require('./fractions');
var Term = require('./terms');
var isInt = require('./helper').isInt;

// The constant of the expression is maintained on the Expression object itself.
// Anything else is held in an array of Term objects.

var Expression = function(variable) {
    this.constant = new Fraction(0, 1);
    this.terms = [new Term(variable)];
};

Expression.prototype.copy = function() {
    var copy = new Expression('');
    copy.constant = this.constant.copy();

    var terms = [];
    this.terms.forEach(function(t) {terms.push(t.copy());} );
    copy.terms = terms;
    return copy;
};

Expression.prototype.add = function(a) {
    var copy = this.copy();

    if (a instanceof Expression) {
        var oldTerms = a.copy().terms;
        copy.constant = copy.constant.add(a.constant);

        for (i = 0; i < copy.terms.length; i++) {
            for (j = 0; j < oldTerms.length; j++) {
                var thisTerm = copy.terms[i];
                var thatTerm = oldTerms[j];

                if (thisTerm.hasTheSameVariableAs(thatTerm)) {
                    thisTerm.coefficient = thisTerm.coefficient.add(thatTerm.coefficient);
                    oldTerms = oldTerms.splice(j);
                }
            }
        }

        copy.terms = copy.terms.concat(oldTerms);

    } else if (isInt(a) || a instanceof Fraction) {
        copy.constant = copy.constant.add(a);
    }

    return copy;
};

Expression.prototype.subtract = function(a) {
    var copy = this.copy();
    var inverse;

    if (a instanceof Expression) {
        var newTerms = [];

        for (i = 0; i < a.terms.length; i++) {
            var t = a.terms[i].copy();
            t = t.multiply(-1);
            newTerms.push(t);
        }

        inverse = a.copy();
        inverse.terms = newTerms;
    } else if (isInt(a)) {
        inverse = -a;
    } else if (a instanceof Fraction) {
        inverse = a.multiply(-1);
    }

    return copy.add(inverse);
};

Expression.prototype.multiply = function(a) {
    var copy = this.copy();

    copy.constant = copy.constant.multiply(a);

    for (i = 0; i < copy.terms.length; i++) {
        copy.terms[i].coefficient = copy.terms[i].coefficient.multiply(a);
    }

    return copy;
};

Expression.prototype.divide = function(a) {
    if (a == 0) {
        return;
    }

    var copy = this.copy();

    copy.constant = copy.constant.divide(a);

    for (i = 0; i < copy.terms.length; i++) {
        copy.terms[i].coefficient = copy.terms[i].coefficient.divide(a);
    }

    return copy;
};

Expression.prototype.evaluateAt = function(values) {
    var terms = [];
    var vars = Object.keys(values);
    var constant = this.constant;

    for (i = 0; i < this.terms.length; i++) {
        for (j = 0; j < vars.length; j++) {
            if (this.terms[i].variable == vars[j]) {
                constant += this.terms[i].coefficient.multiply(values[vars[j]]);
            }
        }

    }
};

Expression.prototype.print = function() {
    var str = (this.terms[0].coefficient.numer < 0 ? "-": "") + this.terms[0].print();

    for (i = 1; i < this.terms.length; i++) {
        var coefficient = this.terms[i].coefficient.reduce();

        str += (coefficient.numer < 0 ? " - " : " + ") + this.terms[i].print();
    }

    var constant = this.constant.reduce();

    if (constant.numer) {
        str += (constant.numer < 0 ? " - " : " + ") + constant.abs().print();
    }

    return str;
};

Expression.prototype.tex = function() {
    var str = (this.terms[0].coefficient.numer < 0 ? "-": "") + this.terms[0].tex();

    for (i = 1; i < this.terms.length; i++) {
        var coefficient = this.terms[i].coefficient.reduce();

        str += (coefficient.numer < 0 ? " - " : " + ") + this.terms[i].tex();
    }

    var constant = this.constant.reduce();

    if (constant.numer) {
        str += (constant.numer < 0 ? " - " : " + ") + constant.abs().tex();
    }

    return str;
};

module.exports = Expression;