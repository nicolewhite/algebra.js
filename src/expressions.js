var Fraction = require('./fractions');
var isInt = require('./helper').isInt;

var Expression = function(variable) {
    this.constant = new Fraction(0, 1);

    if(typeof(variable) === "string") {
        var v = new Variable(variable);
        var t = new Term(v);
        this.terms = [t];
    } else if(isInt(variable)) {
        this.constant = new Fraction(variable, 1);
        this.terms = [];
    } else if(variable instanceof Fraction) {
        this.constant = variable;
        this.terms = [];
    } else if(variable instanceof Term) {
        this.terms = [variable];
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
    thisExp._sort();
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
        thisExp._sort();
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

    return exp.add(this.constant);
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

Expression.prototype._cubicCoefficients = function() {
    // This function isn't used until everything has been moved to the LHS in Equation.solve.
    var a;
    var b = new Fraction(0, 1);
    var c = new Fraction(0, 1);
    var d = this.constant.copy();

    for (var i = 0; i < this.terms.length; i++) {
        var thisTerm = this.terms[i];

        if (thisTerm.maxDegree() === 3) {
            a = thisTerm.coefficient.copy();
        } else if (thisTerm.maxDegree() === 2) {
            b = thisTerm.coefficient.copy();
        } else if (thisTerm.maxDegree() === 1) {
            c = thisTerm.coefficient.copy();
        }
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

    this.coefficient = new Fraction(1, 1);
};

Term.prototype.copy = function() {
    var copy = new Term();
    copy.variables = [];

    for(var i = 0; i < this.variables.length; i++) {
        copy.variables.push(this.variables[i].copy());
    }

    copy.coefficient = this.coefficient.copy();
    return copy;
};

Term.prototype.add = function(term) {
    if(term instanceof Term && this.canBeCombinedWith(term)) {
        var copy = this.copy();
        copy.coefficient = copy.coefficient.add(term.coefficient);
        return copy;
    } else {
        throw "InvalidArgument";
    }
};

Term.prototype.subtract = function(term) {
    if (term instanceof Term && this.canBeCombinedWith(term)) {
        var copy = this.copy();
        copy.coefficient = copy.coefficient.subtract(term.coefficient);
        return copy;
    } else {
        throw "InvalidArgument";
    }
};

Term.prototype.multiply = function(a) {
    var thisTerm = this.copy();

    if (a instanceof Term) {
        var thatTerm = a.copy();

        var thisVars = thisTerm.variables;
        var thatVars = thatTerm.variables;

        for (var i = 0; i < thisVars.length; i++) {
            for (var j = 0; j < thatVars.length; j++) {
                if (thisVars[i].variable === thatVars[j].variable) {
                    thisVars[i].degree += thatVars[j].degree;
                    thatVars[j].throwaway = true;
                }
            }
        }

        for (var i = 0; i < thatVars.length; i++) {
            if (!thatVars[i].throwaway) {
                thisVars.push(thatVars[i])
            }
        }

        thisTerm.coefficient = thisTerm.coefficient.multiply(thatTerm.coefficient);
    } else if(isInt(a) || a instanceof Fraction) {
        thisTerm.coefficient = thisTerm.coefficient.multiply(a);
    } else {
        throw "InvalidArgument";
    }

    return thisTerm.sort();
};

Term.prototype.divide = function(a) {
    if(isInt(a) || a instanceof Fraction) {
        var thisTerm = this.copy();
        thisTerm.coefficient = thisTerm.coefficient.divide(a);
        return thisTerm;
    } else {
        throw "InvalidArgument";
    }
};

Term.prototype.eval = function(values) {
    var copy = this.copy();
    var keys = Object.keys(values);
    var exp = new Expression(this.coefficient);

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
    var str;
    var coefficient = this.coefficient.reduce().abs();

    if(coefficient.valueOf() === 1) {
        str = "";
    } else {
        str = coefficient.toString();
    }

    for(var i = 0; i < this.variables.length; i++) {
        str += this.variables[i].toString();
    }

    return str;
};

Term.prototype.toTex = function() {
    var str;
    var coefficient = this.coefficient.reduce().abs();

    if(coefficient.valueOf() === 1) {
        str = "";
    } else {
        str = coefficient.toTex();
    }

    for(var i = 0; i < this.variables.length; i++) {
        str += this.variables[i].toTex();
    }

    return str;
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