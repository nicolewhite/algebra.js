var Fraction = require('./fractions');
var Expression = require('./expressions');

var isInt = require('./helper').isInt;

var Equation = function(lhs, rhs) {
    this.lhs = lhs;

    if (rhs instanceof Expression) {
        this.rhs = rhs;
    } else if (rhs instanceof Fraction || isInt(rhs)) {
        this.rhs = new Expression(lhs.variable).multiply(0).add(rhs);
    }

};

Equation.prototype.solveFor = function(variable) {
    if (this.lhs.variable == variable && this.rhs.variable == variable) {
        var scalar = this.lhs.coefficient.subtract(this.rhs.coefficient);
        var constant = this.rhs.constant.subtract(this.lhs.constant);
        var answer = constant.divide(scalar);

        return answer.reduce();
    } else if (this.rhs.variable == variable) {
        var lhsCopy = this.lhs.copy();

        lhsCopy.constant = lhsCopy.constant.subtract(this.rhs.constant);
        lhsCopy = lhsCopy.divide(this.rhs.coefficient);

        return lhsCopy;
    } else if (this.lhs.variable == variable) {
        var rhsCopy = this.rhs.copy();

        rhsCopy.constant = rhsCopy.constant.subtract(this.lhs.constant);
        rhsCopy = rhsCopy.divide(this.lhs.coefficient);

        return rhsCopy;
    }
};

Equation.prototype.print = function() {
    return this.lhs.print() + " = " + this.rhs.print();
};

Equation.prototype.tex = function() {
    return this.lhs.tex() + " = " + this.rhs.tex();
};

module.exports = Equation;