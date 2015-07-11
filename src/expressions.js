var Fraction = require('./fractions');
var Term = require('./terms');
var isInt = require('./helper').isInt;
var Variable = require('./variables');

var Expression = function(variable) {
    this.constant = new Fraction(0, 1);

    if(typeof(variable) === "string") {
        var v = new Variable(variable);
        var t = new Term(v);
        this.terms = [t];
    } else if(typeof(variable) === "undefined") {
        this.terms = [];
    }
};

Expression.prototype.copy = function() {
    var copy = new Expression();
    copy.constant = this.constant.copy();

    copy.terms = [];
    this.terms.forEach(function(t) {copy.terms.push(t.copy());} );

    return copy;
};

Expression.prototype.add = function(a) {
    var thisExp = this.copy();

    if (typeof(a) === "string") {
        var exp = new Expression(a);
        return thisExp.add(exp);
    } else if (a instanceof Term) {
        var exp = new Expression();
        exp.terms = [a.copy()];
        return thisExp.add(exp);
    } else if (a instanceof Expression) {
        thisExp.constant = thisExp.constant.add(a.constant);
        var keepTerms = a.copy().terms;

        for (var i = 0; i < thisExp.terms.length; i++) {
            var thisTerm = thisExp.terms[i];

            for (var j = 0; j < keepTerms.length; j++) {
                var thatTerm = keepTerms[j];

                if (thisTerm.canBeCombinedWith(thatTerm)) {
                    thisExp.terms[i] = thisTerm.add(thatTerm);
                    keepTerms.splice(j, 1);
                }
            }
        }

        thisExp.terms = thisExp.terms.concat(keepTerms);

    } else if (isInt(a) || a instanceof Fraction) {
        thisExp.constant = thisExp.constant.add(a);
    } else {
        throw "InvalidArgument";
    }

    thisExp._removeTermsWithCoefficientZero();
    return thisExp;
};

Expression.prototype.subtract = function(a) {
    var thisExp = this.copy();
    var inverse;

    if (typeof(a) === "string") {
        inverse = new Expression(a).multiply(-1);
    } else if (a instanceof Term) {
        inverse = new Expression();
        inverse.terms = [a.copy().multiply(-1)];
    } else if (a instanceof Expression) {
        inverse = a.copy();
        inverse.constant = inverse.constant.multiply(-1);

        for (var i = 0; i < inverse.terms.length; i++) {
            inverse.terms[i] = inverse.terms[i].multiply(-1);
        }
    } else if (isInt(a)) {
        inverse = -a;
    } else if (a instanceof Fraction) {
        inverse = a.multiply(-1);
    } else {
        throw "InvalidArgument";
    }

    return thisExp.add(inverse);
};

Expression.prototype.multiply = function(a) {
    var thisExp = this.copy();

    if (typeof(a) === "string") {
        var exp = new Expression(a);
        return thisExp.multiply(exp);
    } else if (a instanceof Term) {
        var exp = new Expression();
        exp.terms = [a.copy()];
        return thisExp.multiply(exp);
    } else if (a instanceof Expression) {
        var thatExp = a.copy();
        var newTerms = [];

        for (var i = 0; i < thisExp.terms.length; i++) {
            var thisTerm = thisExp.terms[i];

            for (var j = 0; j < thatExp.terms.length; j++) {
                var thatTerm = thatExp.terms[j];
                newTerms.push(thisTerm.multiply(thatTerm));
            }

            newTerms.push(thisTerm.multiply(thatExp.constant));
        }

        for (var i = 0; i < thatExp.terms.length; i++) {
            var thatTerm = thatExp.terms[i];
            newTerms.push(thatTerm.multiply(thisExp.constant));
        }

        thisExp.constant = thisExp.constant.multiply(thatExp.constant);
        thisExp.terms = newTerms;
        thisExp._combineLikeTerms();
        thisExp._removeTermsWithCoefficientZero();
        thisExp._sortByDegree();
    } else if (a instanceof Fraction || isInt(a)) {
        thisExp.constant = thisExp.constant.multiply(a);

        for (var i = 0; i < thisExp.terms.length; i++) {
            thisExp.terms[i].coefficient = thisExp.terms[i].coefficient.multiply(a);
        }
    } else {
        throw "InvalidArgument";
    }

    return thisExp;
};

Expression.prototype.divide = function(a) {
    if (a instanceof Fraction || isInt(a)) {
        if (a == 0) {
            throw "DivideByZero";
        }

        var copy = this.copy();

        copy.constant = copy.constant.divide(a);

        for (var i = 0; i < copy.terms.length; i++) {
            copy.terms[i].coefficient = copy.terms[i].coefficient.divide(a);
        }

        return copy;
    } else {
        throw "InvalidArgument";
    }
};

Expression.prototype.evaluateAt = function(values) {
    var copy = this.copy();
    var keepTerms = [];

    for (var i = 0; i < copy.terms.length; i++) {
        copy.terms[i] = copy.terms[i].evaluateAt(values);

        if (copy.terms[i].variables.length === 0) {
            copy.constant = copy.constant.add(copy.terms[i].coefficient);
        } else {
            keepTerms.push(copy.terms[i]);
        }
    }

    if (keepTerms.length === 0) {
        return copy.constant.reduce();
    }

    copy.terms = keepTerms;
    return copy;
};

Expression.prototype.toString = function() {
    if (this.terms.length == 0) {
        return this.constant.toString();
    }

    var firstTermCoefficient = this.terms[0].coefficient.reduce();
    var str = (firstTermCoefficient.numer < 0 ? "-": "") + this.terms[0].toString();

    for (var i = 1; i < this.terms.length; i++) {
        var coefficient = this.terms[i].coefficient.reduce();

        str += (coefficient.numer < 0 ? " - " : " + ") + this.terms[i].toString();
    }

    var constant = this.constant.reduce();

    if (constant.numer) {
        str += (constant.numer < 0 ? " - " : " + ") + constant.abs().toString();
    }

    return str;
};

Expression.prototype.toTex = function() {
    if (this.terms.length == 0) {
        return this.constant.toTex();
    }

    var firstTermCoefficient = this.terms[0].coefficient.reduce();
    var str = (firstTermCoefficient.numer < 0 ? "-": "") + this.terms[0].toTex();

    for (var i = 1; i < this.terms.length; i++) {
        var coefficient = this.terms[i].coefficient.reduce();

        str += (coefficient.numer < 0 ? " - " : " + ") + this.terms[i].toTex();
    }

    var constant = this.constant.reduce();

    if (constant.numer) {
        str += (constant.numer < 0 ? " - " : " + ") + constant.abs().toTex();
    }

    return str;
};

Expression.prototype._removeTermsWithVar = function(variable) {
    var keep = [];

    for (var i = 0; i < this.terms.length; i++) {
        if (this.terms[i].variable != variable) {
            keep.push(this.terms[i]);
        }
    }

    this.terms = keep;
    return this;
};

Expression.prototype._removeTermsWithCoefficientZero = function() {
    var keep = [];

    for (var i = 0; i < this.terms.length; i++) {
        var coefficient = this.terms[i].coefficient.reduce();

        if (coefficient.numer != 0) {
            keep.push(this.terms[i]);
        }
    }

    this.terms = keep;
    return this;
};

Expression.prototype._combineLikeTerms = function() {
    for (var i = 0; i < this.terms.length; i++) {
        var thisTerm = this.terms[i];

        for (var j = i + 1; j < this.terms.length; j++) {
            var thatTerm = this.terms[j];

            if (thisTerm.canBeCombinedWith(thatTerm)) {
                thisTerm = thisTerm.add(thatTerm);
                this.terms[i] = thisTerm;
                this.terms.splice(j, 1);
            }
        }
    }

    return this;
};

Expression.prototype._sortByDegree = function() {
    this.terms = this.terms.sort(function(a, b) {return b.maxDegree() - a.maxDegree()});
    return this;
};

Expression.prototype._hasVariable = function(variable) {
    for (var i = 0; i < this.terms.length; i++) {
        if (this.terms[i].hasVariable(variable)) {
            return true;
        }
    }

    return false;
};

Expression.prototype._onlyHasVariable = function(variable) {
    for (var i = 0; i < this.terms.length; i++) {
        if (!this.terms[i].onlyHasVariable(variable)) {
            return false;
        }
    }

    return true;
};

Expression.prototype._noCrossProductsWithVariable = function(variable) {
    for (var i = 0; i < this.terms.length; i++) {
        var term = this.terms[i];
        if (term.hasVariable(variable)  && !term.onlyHasVariable(variable)) {
            return false;
        }
    }

    return true;
};

Expression.prototype._noCrossProducts = function() {
    for (var i = 0; i < this.terms.length; i++) {
        var term = this.terms[i];
        if (term.variables.length > 1) {
            return false;
        }
    }

    return true;
};

Expression.prototype._maxDegree = function() {
    var max = 1;

    for (var i = 0; i < this.terms.length; i++) {
        var maxDegree = this.terms[i].maxDegree();

        if (maxDegree > max) {
            max = maxDegree
        }
    }

    return max;
};

Expression.prototype._maxDegreeOfVariable = function(variable) {
    var max = 1;

    for (var i = 0; i < this.terms.length; i++) {
        var maxDegreeOfVariable = this.terms[i].maxDegreeOfVariable(variable);

        if (maxDegreeOfVariable > max) {
            max = maxDegreeOfVariable;
        }
    }

    return max;
};

Expression.prototype._quadraticCoefficients = function() {
    // This function isn't used until everything has been moved to the LHS in Equation.solve.
    var a;
    var b = new Fraction(0, 1);
    var c = this.constant.copy();

    for (var i = 0; i < this.terms.length; i++) {
        var thisTerm = this.terms[i];

        if (thisTerm.maxDegree() === 2) {
            a = thisTerm.coefficient.copy();
        } else if (thisTerm.maxDegree() === 1) {
            b = thisTerm.coefficient.copy();
        }
    }

    return {a:a, b:b, c:c}
};

module.exports = Expression;