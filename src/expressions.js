var Fraction = require('./fractions');

var Expression = function(variable) {
    this.variable = variable;
    this.coefficient = new Fraction(1, 1);
    this.constant = new Fraction(0, 1);
};

Expression.prototype.copy = function() {
    var ex = new Expression(this.variable);
    ex.coefficient = this.coefficient;
    ex.constant = this.constant;
    return ex;
};

Expression.prototype.add = function(a) {
    var copy = this.copy();

    if (a instanceof Expression) {
        if (copy.variable == a.variable) {
            copy.coefficient = copy.coefficient.add(a.coefficient);
            copy.constant = copy.constant.add(a.constant);
        }
    } else {
        copy.constant = copy.constant.add(a);
    }

    return copy;
};

Expression.prototype.subtract = function(a) {
    var copy = this.copy();

    if (a instanceof Expression) {
        if (copy.variable == a.variable) {
            copy.coefficient = copy.coefficient.subtract(a.coefficient);
            copy.constant = copy.constant.subtract(a.constant);
        }
    } else {
        copy.constant = copy.constant.subtract(a);
    }

    return copy;
};

Expression.prototype.multiply = function(a) {
    var copy = this.copy();

    copy.coefficient = copy.coefficient.multiply(a);
    copy.constant = copy.constant.multiply(a);

    return copy;
};

Expression.prototype.divide = function(a) {
    if (a == 0) {
        return "stahp";
    }

    var copy = this.copy();

    copy.coefficient = copy.coefficient.divide(a);
    copy.constant = copy.constant.divide(a);
    return copy;
};

Expression.prototype.evaluateAt = function(constant) {
    var x = this.coefficient.multiply(constant);
    return x.add(this.constant);
};

Expression.prototype.print = function() {
    var coefficient = this.coefficient.reduce();
    var constant = this.constant.reduce();

    if (coefficient.numer == 0 && constant.numer == 0) {
        return "0";
    }

    if (coefficient.numer == 0) {
        return constant.abs().print();
    } else {
        return (coefficient.numer < 0 ? "-" : "") +
               (coefficient.decimal() == 1 ? "" : coefficient.print()) +
               this.variable +
               (constant.numer > 0 ? " + " : " - ") + constant.abs().print();
    }
};

Expression.prototype.tex = function(type) {
    var coefficient = this.coefficient.reduce();
    var constant = this.constant.reduce();

    if (coefficient.numer == 0 && constant.numer == 0) {
        return "0";
    }

    if (coefficient.numer == 0) {
        return constant.tex();
    } else {
        return (coefficient.numer < 0 ? "-" : "") +
            (coefficient.decimal() == 1 ? "" : coefficient.tex()) +
            this.variable +
            (constant.numer > 0 ? " + " : " - ") + constant.abs().tex();
    }
};

module.exports = Expression;