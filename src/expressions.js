var Fraction = require('./fractions');
var isInt = require('./helper').isInt;

var Expression = function(variable) {
    this.constants = [];

    if(typeof(variable) === "string") {
        var v = new Variable(variable);
        var t = new Term(v);
        this.terms = [t];
    } else if(isInt(variable)) {
        this.constants = [new Fraction(variable, 1)];
        this.terms = [];
    } else if(variable instanceof Fraction) {
        this.constants = [variable];
        this.terms = [];
    } else if(variable instanceof Term) {
        this.terms = [variable];
    } else if(typeof(variable) === "undefined") {
        this.terms = [];
    }
};

Expression.prototype.constant = function() {
    var sum = new Fraction(0, 1);

    for (var i = 0; i < this.constants.length; i++) {
        sum = sum.add(this.constants[i]);
    }

    return sum;
};

Expression.prototype.simplify = function() {
    var copy = this.copy();

    for (var i = 0; i < copy.terms.length; i++) {
        copy.terms[i] = copy.terms[i].simplify();
    }

    copy._combineLikeTerms();
    copy._removeTermsWithCoefficientZero();
    copy.constants = (copy.constant().valueOf() === 0 ? [] : [copy.constant()]);
    copy._sort();

    return copy;
};

Expression.prototype.copy = function() {
    var copy = new Expression();
    copy.constants = [];
    this.constants.forEach(function(c) {copy.constants.push(c.copy());});

    copy.terms = [];
    this.terms.forEach(function(t) {copy.terms.push(t.copy());});

    return copy;
};

Expression.prototype.add = function(a, simplify) {
    simplify = (simplify === undefined ? true : simplify);
    var thisExp = this.copy();

    if (typeof(a) === "string" || a instanceof Term || isInt(a) || a instanceof Fraction) {
        var exp = new Expression(a);
        return thisExp.add(exp, simplify);
    } else if (a instanceof Expression) {
        var keepTerms = a.copy().terms;

        for (var i = 0; i < thisExp.terms.length; i++) {
            var thisTerm = thisExp.terms[i];

            for (var j = 0; j < keepTerms.length; j++) {
                var thatTerm = keepTerms[j];

                if (thisTerm.canBeCombinedWith(thatTerm) && simplify) {
                    thisExp.terms[i] = thisTerm.add(thatTerm);
                    keepTerms.splice(j, 1);
                }
            }
        }

        thisExp.terms = thisExp.terms.concat(keepTerms);
        thisExp.constants = thisExp.constants.concat(a.constants);
        thisExp._sort();
    } else {
        throw "InvalidArgument";
    }

    return (simplify ? thisExp.simplify() : thisExp);
};

Expression.prototype.subtract = function(a, simplify) {
    simplify = (simplify === undefined ? true : simplify);
    var thisExp = this.copy();
    var negative;

    if (typeof(a) === "string" || a instanceof Term || isInt(a) || a instanceof Fraction) {
        negative = new Expression(a).multiply(-1);
    } else if (a instanceof Expression) {
        negative = a.multiply(-1);
    } else {
        throw "InvalidArgument";
    }

    return thisExp.add(negative, simplify);
};

Expression.prototype.multiply = function(a, simplify) {
    simplify = (simplify === undefined ? true : simplify);
    var thisExp = this.copy();

    if (typeof(a) === "string" || a instanceof Term || isInt(a) || a instanceof Fraction) {
        var exp = new Expression(a);
        return thisExp.multiply(exp, simplify);
    } else if (a instanceof Expression) {
        var thatExp = a.copy();
        var newTerms = [];

        for (var i = 0; i < thisExp.terms.length; i++) {
            var thisTerm = thisExp.terms[i];

            for (var j = 0; j < thatExp.terms.length; j++) {
                var thatTerm = thatExp.terms[j];
                newTerms.push(thisTerm.multiply(thatTerm, simplify));
            }

            for (var j = 0; j < thatExp.constants.length; j++) {
                newTerms.push(thisTerm.multiply(thatExp.constants[j], simplify));
            }
        }

        for (var i = 0; i < thatExp.terms.length; i++) {
            var thatTerm = thatExp.terms[i];

            for (var j = 0; j < thisExp.constants.length; j++) {
                newTerms.push(thatTerm.multiply(thisExp.constants[j], simplify));
            }
        }

        var newConstants = [];

        for (var i = 0; i < thisExp.constants.length; i++) {
            var thisConst = thisExp.constants[i];

            for (var j = 0; j < thatExp.constants.length; j++) {
                var thatConst = thatExp.constants[j];

                newConstants.push(thisConst.multiply(thatConst, simplify));
            }
        }

        thisExp.constants = newConstants;
        thisExp.terms = newTerms;
        thisExp._sort();
    } else {
        throw "InvalidArgument";
    }

    return (simplify ? thisExp.simplify() : thisExp);
};

Expression.prototype.divide = function(a) {
    if (a instanceof Fraction || isInt(a)) {

        if (a.valueOf() === 0) {
            throw "DivideByZero";
        }

        var copy = this.copy();

        for (var i = 0; i < copy.terms.length; i++) {
            copy.terms[i].coefficients = [copy.terms[i].coefficient().divide(a)];
        }

        for (var i = 0; i < copy.constants.length; i++) {
            copy.constants[i] = copy.constants[i].divide(a);
        }

        return copy;
    } else {
        throw "InvalidArgument";
    }
};

Expression.prototype.pow = function(a) {
    if (isInt(a)) {
        var copy = this.copy();

        if (a === 0) {
            return new Expression().add(1);
        } else {
            for (var i = 1; i < a; i++) {
                copy = copy.multiply(this);
            }

            copy._sort();
            return copy;
        }
    } else {
        throw "InvalidArgument";
    }
};

Expression.prototype.eval = function(values) {
    var exp = new Expression();

    for(var i = 0; i < this.terms.length; i++) {
        var thisTerm = this.terms[i];
        exp = exp.add(thisTerm.eval(values));
    }

    exp = exp.add(this.constant());

    return exp;
};

Expression.prototype.summation = function(variable, lower, upper) {
	var thisExpr = this.copy();
	var newExpr = new Expression();
	for(var i = lower; i < (upper + 1); i++) {
		var sub = {};
		sub[variable] = i;
		newExpr = newExpr.add(thisExpr.eval(sub));
	}
	return newExpr;
}

Expression.prototype.toString = function() {
    if (this.terms.length === 0 && this.constants.length === 0) {
        return "0";
    }

    var str = "";

    for (var i = 0; i < this.terms.length; i++) {
        var term = this.terms[i];

        str += (term.coefficient().valueOf() < 0 ? " - " : " + ") + term.toString();
    }

    for (var i = 0; i < this.constants.length; i++) {
        var constant = this.constants[i].reduce();

        str += (constant.valueOf() < 0 ? " - " : " + ") + constant.abs().toString();
    }

    if (str.substring(0, 3) === " - ") {
        return "-" + str.substring(3, str.length);
    } else if (str.substring(0, 3) === " + ") {
        return str.substring(3, str.length);
    }
};

Expression.prototype.toTex = function() {
    if (this.terms.length === 0 && this.constants.length === 0) {
        return "0";
    }

    var str = "";

    for (var i = 0; i < this.terms.length; i++) {
        var term = this.terms[i];

        str += (term.coefficient().valueOf() < 0 ? " - " : " + ") + term.toTex();
    }

    for (var i = 0; i < this.constants.length; i++) {
        var constant = this.constants[i].reduce();

        str += (constant.valueOf() < 0 ? " - " : " + ") + constant.abs().toTex();
    }

    if (str.substring(0, 3) === " - ") {
        return "-" + str.substring(3, str.length);
    } else if (str.substring(0, 3) === " + ") {
        return str.substring(3, str.length);
    }
};

Expression.prototype._removeTermsWithCoefficientZero = function() {
    var keep = [];

    for (var i = 0; i < this.terms.length; i++) {
        var coefficient = this.terms[i].coefficient().reduce();

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

Expression.prototype._sort = function() {
    function sortTerms(a, b) {
        var x = a.maxDegree();
        var y = b.maxDegree();

        if (x === y) {
            var m = a.variables.length;
            var n = b.variables.length;

            return n - m;
        } else {
            return y - x;
        }
    }

    this.terms = this.terms.sort(sortTerms);
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
    for (var i = 0; i < this.terms.length; i++) {
        var thisTerm = this.terms[i];

        if (thisTerm.maxDegree() === 2) {
            a = thisTerm.coefficient().copy();
        } else if (thisTerm.maxDegree() === 1) {
            b = thisTerm.coefficient().copy();
        }
    }

    var c = new Fraction(0, 1);

    for (var i = 0; i < this.constants.length; i++) {
        c = c.add(this.constants[i]);
    }

    return {a:a, b:b, c:c}
};

Expression.prototype._cubicCoefficients = function() {
    // This function isn't used until everything has been moved to the LHS in Equation.solve.
    var a;
    var b = new Fraction(0, 1);
    var c = new Fraction(0, 1);

    for (var i = 0; i < this.terms.length; i++) {
        var thisTerm = this.terms[i];

        if (thisTerm.maxDegree() === 3) {
            a = thisTerm.coefficient().copy();
        } else if (thisTerm.maxDegree() === 2) {
            b = thisTerm.coefficient().copy();
        } else if (thisTerm.maxDegree() === 1) {
            c = thisTerm.coefficient().copy();
        }
    }

    var d = new Fraction(0, 1);

    for (var i = 0; i < this.constants.length; i++) {
        d = d.add(this.constants[i]);
    }

    return {a:a, b:b, c:c, d:d}
};

Term = function(variable) {
    if (variable instanceof Variable) {
        this.variables = [variable.copy()];
    } else if (typeof(variable) === "undefined") {
        this.variables = [];
    } else {
        throw "InvalidArgument";
    }

    this.coefficients = [new Fraction(1, 1)];
};

Term.prototype.coefficient = function() {
    var prod = new Fraction(1, 1);

    for (var i = 0; i < this.coefficients.length; i++) {
        prod = prod.multiply(this.coefficients[i]);
    }

    return prod;
};

Term.prototype.simplify = function() {
    var copy = this.copy();
    copy.coefficients = [this.coefficient()];
    copy.combineVars();
    return copy.sort();
};

Term.prototype.combineVars = function() {
    var uniqueVars = {};

    for (var i = 0; i < this.variables.length; i++) {
        var thisVar = this.variables[i];

        if (thisVar.variable in uniqueVars) {
            uniqueVars[thisVar.variable] += thisVar.degree;
        } else {
            uniqueVars[thisVar.variable] = thisVar.degree;
        }
    }

    var newVars = [];

    for (var v in uniqueVars) {
        var newVar = new Variable(v);
        newVar.degree = uniqueVars[v];
        newVars.push(newVar);
    }

    this.variables = newVars;
    return this;
};

Term.prototype.copy = function() {
    var copy = new Term();

    copy.coefficients = [];
    copy.variables = [];

    for (var i = 0; i < this.variables.length; i++) {
        copy.variables.push(this.variables[i].copy());
    }

    for (var i = 0; i < this.coefficients.length; i++) {
        copy.coefficients.push(this.coefficients[i].copy());
    }

    return copy;
};

Term.prototype.add = function(term) {
    if(term instanceof Term && this.canBeCombinedWith(term)) {
        var copy = this.copy();
        copy.coefficients = [copy.coefficient().add(term.coefficient())];
        return copy;
    } else {
        throw "InvalidArgument";
    }
};

Term.prototype.subtract = function(term) {
    if (term instanceof Term && this.canBeCombinedWith(term)) {
        var copy = this.copy();
        copy.coefficients = [copy.coefficient().subtract(term.coefficient())];
        return copy;
    } else {
        throw "InvalidArgument";
    }
};

Term.prototype.multiply = function(a, simplify) {
    simplify = (simplify === undefined ? true : simplify);
    var thisTerm = this.copy();

    if (a instanceof Term) {
        var thatTerm = a.copy();

        thisTerm.variables = thisTerm.variables.concat(thatTerm.variables);

        for (var i = 0; i < thatTerm.coefficients.length; i++) {
            thisTerm.coefficients.unshift(thatTerm.coefficients[i]);
        }
    } else if (isInt(a) || a instanceof Fraction) {
        var newCoef = (isInt(a) ? new Fraction(a, 1) : a);

        if (thisTerm.variables.length === 0) {
            thisTerm.coefficients.push(newCoef);
        } else {
            thisTerm.coefficients.unshift(newCoef);
        }
    } else {
        throw "InvalidArgument";
    }

    return (simplify ? thisTerm.simplify() : thisTerm);
};

Term.prototype.divide = function(a) {
    if(isInt(a) || a instanceof Fraction) {
        var thisTerm = this.copy();

        for (var i = 0; i < thisTerm.coefficients.length; i++) {
            thisTerm.coefficients[i] = thisTerm.coefficients[i].divide(a);
        }

        return thisTerm;
    } else {
        throw "InvalidArgument";
    }
};

Term.prototype.eval = function(values) {
    var copy = this.copy();
    var keys = Object.keys(values);
    var exp = new Expression(this.coefficient());

    for(var i = 0; i < copy.variables.length; i++) {
        var thisVar = copy.variables[i];

        var eval = new Expression(thisVar.variable).pow(thisVar.degree);

        for(var j = 0; j < keys.length; j++) {
            if(thisVar.variable == keys[j]) {
                var sub = values[keys[j]];

                if(sub instanceof Fraction || sub instanceof Expression) {
                    eval = sub.pow(thisVar.degree);
                } else if(isInt(sub)) {
                    eval = Math.pow(sub, thisVar.degree);
                } else {
                    throw "InvalidArgument";
                }
            }
        }

        exp = exp.multiply(eval);
    }

    return exp;
};

Term.prototype.hasVariable = function(variable) {
    for (var i = 0; i < this.variables.length; i++) {
        if (this.variables[i].variable === variable) {
            return true;
        }
    }

    return false;
};

Term.prototype.maxDegree = function() {
    var max = 1;

    for(var i = 0; i < this.variables.length; i++) {
        if(this.variables[i].degree > max) {
            max = this.variables[i].degree;
        }
    }

    return max;
};

Term.prototype.maxDegreeOfVariable = function(variable) {
    var max = 1;

    for (var i = 0; i < this.variables.length; i++) {
        var thisVar = this.variables[i];

        if (thisVar.variable === variable) {
            if (thisVar.degree > max) {
                max = thisVar.degree;
            }
        }
    }

    return max;
};

Term.prototype.canBeCombinedWith = function(term) {
    if(term instanceof Term) {
        var thisVars = this.variables;
        var thatVars = term.variables;

        if(thisVars.length != thatVars.length) {
            return false;
        }

        matches = 0;

        for(var i = 0; i < thisVars.length; i++) {
            for(var j = 0; j < thatVars.length; j++) {
                if(thisVars[i].variable === thatVars[j].variable && thisVars[i].degree === thatVars[j].degree) {
                    matches += 1;
                }
            }
        }

        if(matches != thisVars.length) {
            return false;
        }
    }

    return true;
};

Term.prototype.onlyHasVariable = function(variable) {
    for (var i = 0; i < this.variables.length; i++) {
        if (this.variables[i].variable != variable) {
            return false;
        }
    }

    return true;
};

Term.prototype.sort = function() {
    function sortVars(a, b) {
        return b.degree - a.degree;
    }

    this.variables = this.variables.sort(sortVars);
    return this;
};

Term.prototype.toString = function() {
    var str = "";

    for (var i = 0; i < this.coefficients.length; i++) {
        var coef = this.coefficients[i].abs();

        if (coef.valueOf() != 1) {
            str += " * " + coef.toString()
        }
    }

    for(var i = 0; i < this.variables.length; i++) {
        str += this.variables[i].toString();
    }

    return (str.substring(0, 3) === " * " ? str.substring(3, str.length) : str);
};

Term.prototype.toTex = function() {
    var str = "";

    for (var i = 0; i < this.coefficients.length; i++) {
        var coef = this.coefficients[i].abs();

        if (coef.valueOf() != 1) {
            str += " * " + coef.toTex()
        }
    }

    for(var i = 0; i < this.variables.length; i++) {
        str += this.variables[i].toTex();
    }

    return (str.substring(0, 3) === " * " ? str.substring(3, str.length) : str);
};

var Variable = function(variable) {
    if (typeof(variable) === "string") {
        this.variable = variable;
        this.degree = 1;
    } else {
        throw "InvalidArgument";
    }
};

Variable.prototype.copy = function() {
    var copy = new Variable(this.variable);
    copy.degree = this.degree;
    return copy;
};

Variable.prototype.toString = function() {
    var degree = this.degree;
    var variable = this.variable;

    if (degree === 0) {
        return "";
    } else if (degree === 1) {
        return variable;
    } else {
        return variable + "^" + degree;
    }
};

Variable.prototype.toTex = function() {
    var degree = this.degree;
    var variable = this.variable;

    if (GREEK_LETTERS.indexOf(variable) > -1) {
        variable = "\\" + variable;
    }

    if (degree === 0) {
        return "";
    } else if (degree === 1) {
        return variable;
    } else {
        return variable + "^{" + degree + "}";
    }
};

module.exports = {
    Expression: Expression,
    Term: Term,
    Variable: Variable
};