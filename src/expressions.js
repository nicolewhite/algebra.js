var Fraction = require('./fractions');
var Term = require('./terms');
var isInt = require('./helper').isInt;
var UserException = require('./exceptions').UserException;

// The constant of the expression is maintained on the Expression object itself.
// Anything else is held in an array of Term objects.

var Expression = function(variable) {
    this.constant = new Fraction(0, 1);
    this.terms = (variable ? [new Term(variable)] : []);
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

    if (a instanceof Term) {
        var exp = new Expression(a.variable).multiply(a.coefficient);
        return copy.add(exp);
    } else if (a instanceof Expression) {
        copy.constant = copy.constant.add(a.constant);
        var newTerms = a.copy().terms;

        for (i = 0; i < copy.terms.length; i++) {
            var thisTerm = copy.terms[i];

            for (j = 0; j < newTerms.length; j++) {
                var thatTerm = newTerms[j];

                if (thisTerm.hasTheSameVariableAs(thatTerm)) {
                    thisTerm.coefficient = thisTerm.coefficient.add(thatTerm.coefficient);
                    newTerms.splice(j, 1);
                }
            }
        }

        copy.terms = copy.terms.concat(newTerms);

    } else if (isInt(a) || a instanceof Fraction) {
        copy.constant = copy.constant.add(a);
    } else {
        throw new UserException("NonIntegerArgument");
    }

    return copy;
};

Expression.prototype.subtract = function(a) {
    var copy = this.copy();
    var inverse;

    if (a instanceof Term) {
        var exp = new Expression(a.variable).multiply(a.coefficient).multiply(-1);
        return copy.add(exp);
    } else if (a instanceof Expression) {
        var newTerms = [];

        for (i = 0; i < a.terms.length; i++) {
            var t = a.terms[i].copy();
            t.coefficient = t.coefficient.multiply(-1);
            newTerms.push(t);
        }

        inverse = a.copy();
        inverse.constant = inverse.constant.multiply(-1);
        inverse.terms = newTerms;
    } else if (isInt(a)) {
        inverse = -a;
    } else if (a instanceof Fraction) {
        inverse = a.multiply(-1);
    } else {
        throw new UserException("NonIntegerArgument");
    }

    return copy.add(inverse);
};

Expression.prototype.multiply = function(a) {
    if (a instanceof Fraction || isInt(a)) {
        var copy = this.copy();

        copy.constant = copy.constant.multiply(a);

        for (i = 0; i < copy.terms.length; i++) {
            copy.terms[i].coefficient = copy.terms[i].coefficient.multiply(a);
        }

        return copy;
    } else {
        throw new UserException("NonIntegerArgument");
    }
};

Expression.prototype.divide = function(a) {
    if (a instanceof Fraction || isInt(a)) {
        if (a == 0) {
            return;
        }

        var copy = this.copy();

        copy.constant = copy.constant.divide(a);

        for (i = 0; i < copy.terms.length; i++) {
            copy.terms[i].coefficient = copy.terms[i].coefficient.divide(a);
        }

        return copy;
    } else {
        throw new UserException("NonIntegerArgument");
    }
};

Expression.prototype.evaluateAt = function(values) {
    var copy = this.copy();
    var vars = Object.keys(values);

    for (i = 0; i < copy.terms.length; i++) {
        for (j = 0; j < vars.length; j++) {
            if (copy.terms[i].variable == vars[j]) {
                copy.constant = copy.constant.add(copy.terms[i].coefficient.multiply(values[vars[j]]));
                copy.terms.splice(i, 1);
            }
        }
    }

    if (copy.terms.length == 0) {
        return copy.constant;
    }

    return copy;
};

Expression.prototype.print = function() {
    if (this.terms.length == 0) {
        return this.constant.print();
    }

    var firstTermCoefficient = this.terms[0].coefficient.reduce();
    var str = (firstTermCoefficient.numer < 0 ? "-": "") + this.terms[0].print();

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
    if (this.terms.length == 0) {
        return this.constant.tex();
    }

    var firstTermCoefficient = this.terms[0].coefficient.reduce();
    var str = (firstTermCoefficient.numer < 0 ? "-": "") + this.terms[0].tex();

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