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
    if (!this.lhs._hasVariable(variable) && !this.rhs._hasVariable(variable)) {
        throw "InvalidArgument";
    }

    if (this._isLinear() || this._variableCanBeIsolated(variable)) {
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

        newRhs._sortByDegree();
        return newRhs;
    } else if (this._isQuadratic(variable)) {
        // Move everything to the lhs so we have the form ax^2 + bx + c = 0.
        var newLhs = this.lhs.copy();

        for (var i = 0; i < this.rhs.terms.length; i++) {
            newLhs = newLhs.subtract(this.rhs.terms[i]);
        }

        newLhs = newLhs.subtract(this.rhs.constant);

        // Extract the coefficients a, b, and c into a dict.
        var coefs = newLhs._quadraticCoefficients();

        var a = coefs.a;
        var b = coefs.b;
        var c = coefs.c;

        // Calculate the discriminant, b^2 - 4ac.
        var discriminant = b.pow(2).subtract(a.multiply(c).multiply(4)).valueOf();

        // If the discriminant is greater than or equal to 0, there is at least one real root.
        if (discriminant >= 0) {
            // If the discriminant is equal to 0, there is one real root: -b / 2a.
            if (discriminant === 0) {
                return [b.multiply(-1).divide(a.multiply(2))];

            // If the discriminant is greater than 0, there are two real roots:
            // (-b - √discriminant) / 2a
            // (-b + √discriminant) / 2a
            } else {
                var squareRootDiscriminant = Math.sqrt(discriminant);

                // If the answers will be rational, return reduced Fraction objects.
                if (isInt(squareRootDiscriminant)) {
                    var root1 = b.multiply(-1).subtract(squareRootDiscriminant).divide(a.multiply(2));
                    var root2 = b.multiply(-1).add(squareRootDiscriminant).divide(a.multiply(2));
                    return [root1.reduce(), root2.reduce()];
                // If the answers will be irrational, return numbers.
                } else {
                    a = a.valueOf();
                    b = b.valueOf();
                    c = c.valueOf();

                    var root1 = (-b - squareRootDiscriminant) / 2*a;
                    var root2 = (-b + squareRootDiscriminant) / 2*a;
                    return [new Number(root1), new Number(root2)];
                }
            }
        // If the discriminant is negative, there are no real roots.
        } else {
            return [];
        }
    } else if (this._isCubic(variable)) {
        // TODO: solve
        return;
    }
};

Equation.prototype.toString = function() {
    return this.lhs.toString() + " = " + this.rhs.toString();
};

Equation.prototype.toTex = function() {
    return this.lhs.toTex() + " = " + this.rhs.toTex();
};

Equation.prototype._maxDegree = function() {
    var lhsMax = this.lhs._maxDegree();
    var rhsMax = this.rhs._maxDegree();
    return Math.max(lhsMax, rhsMax)
};

Equation.prototype._variableCanBeIsolated = function(variable) {
    return this.lhs._maxDegreeOfVariable(variable) === 1 && this.rhs._maxDegreeOfVariable(variable) === 1;
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

Equation.prototype._isCubic = function(variable) {
    return this._maxDegree() === 3 && this._onlyHasVariable(variable);
};

module.exports = Equation;