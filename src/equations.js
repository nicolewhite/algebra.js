var Fraction = require('./fractions');
var Expression = require('./expressions');
var Variable = require('./variables');
var Term = require('./terms');
var isInt = require('./helper').isInt;

var Equation = function(lhs, rhs) {
    if (lhs instanceof Expression) {
        this.lhs = lhs;

        if (rhs instanceof Expression) {
            this.rhs = rhs;
        } else if (rhs instanceof Fraction || isInt(rhs)) {
            this.rhs = new Expression().add(rhs);
        } else {
            throw "InvalidArgument";
        }
    } else {
        throw "InvalidArgument";
    }
};

Equation.prototype.solveFor = function(variable) {
    if (!this.rhs._hasVariable(variable) && !this.lhs._hasVariable(variable)) {
        throw "InvalidArgument";
    }

    var solvingFor = new Term(new Variable(variable));
    var newLhs = new Expression();
    var newRhs = new Expression();

    for (var i = 0; i < this.rhs.terms.length; i++) {
        var term = this.rhs.terms[i];

        if (term.canBeCombinedWith(solvingFor)) {
            newLhs = newLhs.subtract(term);
        } else {
            newRhs = newRhs.add(term);
        }
    }

    for (var i = 0; i < this.lhs.terms.length; i++) {
        var term = this.lhs.terms[i];

        if (term.canBeCombinedWith(solvingFor)) {
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

Equation.prototype._maxDegree = function() {
    var lhsMax = this.lhs._maxDegree();
    var rhsMax = this.rhs._maxDegree();
    return Math.max(lhsMax, rhsMax)
};

Equation.prototype._onlyHasVariable = function(variable) {
    return this.lhs._onlyHasVariable(variable) && this.rhs._onlyHasVariable(variable);
};

Equation.prototype._isLinear = function() {
    return this._maxDegree() === 1;
};

Equation.prototype._isQuadratic = function(variable) {
    return this._maxDegree() === 2 && this._onlyHasVariable(variable);
};

module.exports = Equation;