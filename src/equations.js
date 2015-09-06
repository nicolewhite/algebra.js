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
            this.rhs = new Expression(rhs);
        } else {
            throw "RightHandSideOfEquationIsNotOfTypeEquation";
        }
    } else if(rhs instanceof Expression){
        throw "LeftHandSideOfEquationIsNotOfTypeEquation";
    }
     else
     {
        throw "LeftAndRightHandSideOfEquationIsNotOfTypeEquation"
     }
};

Equation.prototype.solveFor = function(variable) {
    if (!this.lhs._hasVariable(variable) && !this.rhs._hasVariable(variable)) {
        throw "VariableNotFound";
    }

    // If the equation is linear and the variable in question can be isolated through arithmetic, solve.
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

        newRhs = newRhs.subtract(this.lhs.constant());
        newRhs = newRhs.add(this.rhs.constant());

        if (newLhs.terms.length === 0) {
            if (newLhs.constant().equalTo(newRhs.constant())) {
                return new Fraction(1, 1);
            } else {
                throw "NoSolution";
            }
        }

        newRhs = newRhs.divide(newLhs.terms[0].coefficient());

        if (newRhs.terms.length === 0) {
            return newRhs.constant().reduce();
        }

        newRhs._sort();
        return newRhs;

    // Otherwise, move everything to the LHS.
    } else {
        var newLhs = this.lhs.copy();
        newLhs = newLhs.subtract(this.rhs);

        // If there are no terms left after this rearrangement and the constant is 0, there are infinite solutions.
        // Otherwise, there are no solutions.
        if (newLhs.terms.length === 0) {
            if (newLhs.constant().valueOf() === 0) {
                return [new Fraction(1, 1)];
            } else {
                throw "NoSolution";
            }

        // Otherwise, check degree and solve.
        } else if (this._isQuadratic(variable)) {
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
                        return [root1, root2];
                    }
                }
                // If the discriminant is negative, there are no real roots.
            } else {
                return [];
            }
        } else if (this._isCubic(variable)) {
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

                // Otherwise, if D != 0, reduce to a depressed cubic.
            } else {
                // TODO: Make this work with non-integer rationals.
                // Reduce to a depressed cubic with the Tschirnhaus transformation, x = t - b/3a.
                var t = new Expression("t").subtract(b.divide(a.multiply(3)));
                var params = {};
                params[variable] = t;
                var depressed = newLhs.eval(params);

                var depressedCoefs = depressed._cubicCoefficients();

                var a = depressedCoefs.a.valueOf();
                var b = depressedCoefs.b.valueOf();
                var c = depressedCoefs.c.valueOf();
                var d = depressedCoefs.d.valueOf();

                // If D < 0, there is one real root.
                if (D.valueOf() < 0) {
                    // Solve with Cardano's formula.
                    // Let p = -b / 3*a
                    //     q = p^3 + ((b*c - 3*a*d) / (6*a^2))
                    //     r = c / 3*a

                    var p = -b / 3 * a;
                    var q = Math.pow(p, 3) + ((b * c - 3 * a * d) / (6 * a^2));
                    var r = c / 3 * a;

                    // Let s = √(q^2 + (r - p^2)^3)
                    // Then, x = (q + s)^(1/3) + (q - s)^(1/3) + p

                    var s = Math.sqrt(Math.pow(q, 2) + Math.pow((r - Math.pow(p, 2)), 3));
                    var x = Math.cbrt(q + s) + Math.cbrt(q - s) + p;

                    x = (isInt(x) ? new Fraction(x, 1) : x);
                    var params = {};
                    params[variable] = Math.round(x);
                    x = (newLhs.eval(params).toString() === "0" ? new Fraction(Math.round(x), 1) : x);

                    return [x];

                    // If D > 0, there are three real roots.
                } else {
                    // Let q = √(-3ac / 9a^2), h = 2aq^3.
                    var q = Math.sqrt((-3 * a * c) / (9 * Math.pow(a, 2)));
                    var h = 2 * a * Math.pow(q, 3);

                    // theta = (1/3)arccos(-d/h)
                    var theta = (1 / 3) * Math.acos(-d / h);

                    // t1 = 2 * q * cos(theta)
                    // t2 = 2 * q * cos((2pi / 3) - theta)
                    // t3 = 2 * q * cos((2pi / 3) + theta)

                    var t1 = 2 * q * Math.cos(theta);
                    var t2 = 2 * q * Math.cos((2 * Math.PI / 3) - theta);
                    var t3 = 2 * q * Math.cos((2 * Math.PI / 3) + theta);

                    // x1 = t1 - b/3a;
                    // x2 = t2 - b/3a;
                    // x3 = t3 - b/3a;

                    var x1 = t1 + t.constant().valueOf();
                    var x2 = t2 + t.constant().valueOf();
                    var x3 = t3 + t.constant().valueOf();

                    x1 = (isInt(x1) ? new Fraction(x1, 1) : x1);
                    x2 = (isInt(x2) ? new Fraction(x2, 1) : x2);
                    x3 = (isInt(x3) ? new Fraction(x3, 1) : x3);

                    var params1 = {};
                    var params2 = {};
                    var params3 = {};

                    params1[variable] = Math.round(x1);
                    params2[variable] = Math.round(x2);
                    params3[variable] = Math.round(x3);

                    x1 = (newLhs.eval(params1).toString() === "0" ? new Fraction(Math.round(x1), 1) : x1);
                    x2 = (newLhs.eval(params2).toString() === "0" ? new Fraction(Math.round(x2), 1) : x2);
                    x3 = (newLhs.eval(params3).toString() === "0" ? new Fraction(Math.round(x3), 1) : x3);

                    return [x3, x2, x1];
                }
            }
        }
    }
};

Equation.prototype.eval = function(values) {
    return new Equation(this.lhs.eval(values), this.rhs.eval(values));
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
    return Math.max(lhsMax, rhsMax);
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