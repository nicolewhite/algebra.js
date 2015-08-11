var Expression = require('./expressions').Expression;
var Variable = require('./expressions').Variable;
var Term = require('./expressions').Term;
var Fraction = require('./fractions');
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

        newRhs._sort();
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
        var discriminant = b.pow(2).subtract(a.multiply(c).multiply(4));

        // If the discriminant is greater than or equal to 0, there is at least one real root.
        if (discriminant.valueOf() >= 0) {
            // If the discriminant is equal to 0, there is one real root: -b / 2a.
            if (discriminant.valueOf() === 0) {
                return [b.multiply(-1).divide(a.multiply(2)).reduce()];

            // If the discriminant is greater than 0, there are two real roots:
            // (-b - √discriminant) / 2a
            // (-b + √discriminant) / 2a
            } else {
                var squareRootDiscriminant;

                // If the answers will be rational, return reduced Fraction objects.
                if (discriminant._squareRootIsRational()) {
                    squareRootDiscriminant = discriminant.pow(0.5);
                    var root1 = b.multiply(-1).subtract(squareRootDiscriminant).divide(a.multiply(2));
                    var root2 = b.multiply(-1).add(squareRootDiscriminant).divide(a.multiply(2));
                    return [root1.reduce(), root2.reduce()];
                // If the answers will be irrational, return numbers.
                } else {
                    squareRootDiscriminant = Math.sqrt(discriminant.valueOf());
                    a = a.valueOf();
                    b = b.valueOf();

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
        // Move everything to the lhs so we have the form ax^3 + bx^2 + cx + d = 0.
        var newLhs = this.lhs.copy();

        for (var i = 0; i < this.rhs.terms.length; i++) {
            newLhs = newLhs.subtract(this.rhs.terms[i]);
        }

        newLhs = newLhs.subtract(this.rhs.constant);

        // Extract the coefficients a, b, c, and d into a dict.
        var coefs = newLhs._cubicCoefficients();

        var a = coefs.a;
        var b = coefs.b;
        var c = coefs.c;
        var d = coefs.d;

        // Calculate D and D0.
        var D = a.multiply(b).multiply(c).multiply(d).multiply(18);
        D = D.subtract(b.pow(3).multiply(d).multiply(4));
        D = D.add(b.pow(2).multiply(c.pow(2)));
        D = D.subtract(a.multiply(c.pow(3)).multiply(4));
        D = D.subtract(a.pow(2).multiply(d.pow(2)).multiply(27));

        var D0 = b.pow(2).subtract(a.multiply(c).multiply(3));

        // Check for special cases when D = 0.
        if (D.valueOf() === 0) {
            // If D = D0 = 0, there is one distinct real root, -b / 3a.
            if (D0.valueOf() === 0) {
                var root1 = b.multiply(-1).divide(a.multiply(3));

                return [root1.reduce()];
            // Otherwise, if D0 != 0, there are two distinct real roots.
            // 9ad - bc / 2D0
            // 4abc - 9a^2d - b^3 / aD0
            } else {
                var root1 = a.multiply(b).multiply(c).multiply(4);
                root1 = root1.subtract(a.pow(2).multiply(d).multiply(9));
                root1 = root1.subtract(b.pow(3));
                root1 = root1.divide(a.multiply(D0));

                var root2 = a.multiply(d).multiply(9).subtract(b.multiply(c)).divide(D0.multiply(2));

                return [root1.reduce(), root2.reduce()];
            }
        }

        // TODO: Reduce to a depressed cubic.
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

Equation.prototype._maxDegreeOfVariable = function(variable) {
    return Math.max(this.lhs._maxDegreeOfVariable(variable), this.rhs._maxDegreeOfVariable(variable));
};

Equation.prototype._variableCanBeIsolated = function(variable) {
    return this._maxDegreeOfVariable(variable) === 1 && this._noCrossProductsWithVariable(variable);
};

Equation.prototype._noCrossProductsWithVariable = function(variable) {
    return this.lhs._noCrossProductsWithVariable(variable) && this.rhs._noCrossProductsWithVariable(variable);
};

Equation.prototype._noCrossProducts = function() {
    return this.lhs._noCrossProducts() && this.rhs._noCrossProducts();
};

Equation.prototype._onlyHasVariable = function(variable) {
    return this.lhs._onlyHasVariable(variable) && this.rhs._onlyHasVariable(variable);
};

Equation.prototype._isLinear = function() {
    return this._maxDegree() === 1 && this._noCrossProducts();
};

Equation.prototype._isQuadratic = function(variable) {
    return this._maxDegree() === 2 && this._onlyHasVariable(variable);
};

Equation.prototype._isCubic = function(variable) {
    return this._maxDegree() === 3 && this._onlyHasVariable(variable);
};

module.exports = Equation;