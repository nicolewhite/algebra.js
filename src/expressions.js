var Fraction = require('./fractions');
var isInt = require('./helper').isInt;
var gcd_num = require('./helper').gcd;
var GREEK_LETTERS = require('./helper').GREEK_LETTERS;

var Expression = function (variable) {
    this.constants = [];
    if (typeof (variable) === "string") {
        var v = new Variable(variable);
        var t = new Term(v);
        this.terms = [t];
    } else if (isInt(variable)) {
        var f = new Fraction(variable, 1)
        var t = new Term(f);
        this.terms = [t];
    } else if (variable instanceof Fraction) {
        var t = new Term(variable);
        this.terms = [t];
    } else if (variable instanceof Rational) {
        this.terms = [variable];
    } else if (variable instanceof Term) {
        this.terms = [variable];
    } else if (typeof (variable) === "undefined") {
        this.terms = [];
    } else {
        throw new TypeError("Invalid Argument (" + variable.toString() + "): Argument must be of type String, Integer, Fraction or Term.");
    }
};

Expression.prototype.constant = function () {
    return this.terms.reduce(function (p, c) { return c.maxDegree() === 0 ? p.add(c.coefficient()) : p; }, new Fraction(0, 1));
};

Expression.prototype.coefficients = function () {
    var arr = [this.constant()];
    for (var i = 0; i < this.terms.length; i++) {
        arr.push(this.terms[i].coefficient());
    }
    return arr;
}

Expression.prototype.simplify = function () {
    var copy = this.copy();

    //simplify all terms
    copy.terms = copy.terms.map(function (t) { return (t instanceof Rational) ? t.reduce() : t.simplify(); });

    copy._sort();
    copy._combineLikeTerms();
    copy._removeTermsWithCoefficientZero();
    copy.constants = [];

    return copy;
};

Expression.prototype.copy = function () {
    var copy = new Expression();

    //copy all terms
    copy.terms = this.terms.map(function (t) { return t.copy(); });

    return copy;
};

Expression.prototype.add = function (a, simplify) {
    var thisExp = this.copy();

    if (typeof (a) === "string" || a instanceof Term || isInt(a) || a instanceof Fraction) {
        var exp = new Expression(a);
        return thisExp.add(exp, simplify);
    } else if (a instanceof Rational) {
        var d = a.denom.constant();
        if (d === 1) {
            var exp = a.numer.copy();
            return thisExp.add(exp);
        } else if (d !== 0) {
            var exp = new Expression(a);
            return thisExp.add(exp);
        }
    } else if (a instanceof Expression) {
        var keepTerms = a.copy().terms;

        thisExp.terms = thisExp.terms.concat(keepTerms);
        thisExp._sort();
    } else {
        throw new TypeError("Invalid Argument (" + a.toString() + "): Summand must be of type String, Expression, Term, Fraction or Integer.");
    }

    return (simplify || simplify === undefined) ? thisExp.simplify() : thisExp;
};

Expression.prototype.subtract = function (a, simplify) {
    var negative = (a instanceof Expression) ? a.multiply(-1) : new Expression(a).multiply(-1);
    return this.add(negative, simplify);
};

Expression.prototype.multiply = function (a, simplify) {
    var thisExp = this.copy();

    if (typeof (a) === "string" || a instanceof Term || isInt(a) || a instanceof Fraction || a instanceof Rational) {
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
        }

        thisExp.terms = newTerms;
        thisExp._sort();
    } else {
        throw new TypeError("Invalid Argument (" + a.toString() + "): Multiplicand must be of type String, Expression, Term, Fraction or Integer.");
    }

    return (simplify || simplify === undefined) ? thisExp.simplify() : thisExp;
};

Expression.prototype.divide = function (a, simplify) {
    if (a instanceof Expression) {
        if (a.terms.length == 1) {
            var thatTerm = a.terms[0];
            if (thatTerm.coefficient() === 0) {
                throw new EvalError("Divide By Zero");
            }

            var copy = this.copy();

            for (var i = 0; i < copy.terms.length; i++) {
                copy.terms[i] = copy.terms[i].divide(thatTerm);
            }

            return copy;
        }
        else {
            var rational = new Rational(this.copy(), a.copy());
            return new Expression(rational);
        }
    } else if (a instanceof Fraction || isInt(a)) {
        var copy = this.copy();

        for (var i = 0; i < copy.terms.length; i++) {
            copy.terms[i] = copy.terms[i].divide(a);
        }

        return copy;
    } else {
        throw new TypeError("Invalid Argument (" + a.toString() + "): Divisor must be of type Fraction or Integer.");
    }
};

Expression.prototype.pow = function (a, simplify) {
    if (isInt(a)) {
        var copy = this.copy();

        if (a === 0) {
            return new Expression().add(1);
        } else {
            for (var i = 1; i < a; i++) {
                copy = copy.multiply(this, simplify);
            }

            copy._sort();
        }

        return (simplify || simplify === undefined) ? copy.simplify() : copy;
    } else {
        throw new TypeError("Invalid Argument (" + a.toString() + "): Exponent must be of type Integer.");
    }
};

Expression.prototype.eval = function (values, simplify) {
    var exp = new Expression();
    exp.constants = (simplify ? [this.constant()] : this.constants.slice());

    //add all evaluated terms of this to exp
    exp = this.terms.reduce(function (p, c) { return p.add(c.eval(values, simplify), simplify); }, exp);

    return exp;
};

Expression.prototype.summation = function (variable, lower, upper, simplify) {
    var thisExpr = this.copy();
    var newExpr = new Expression();
    for (var i = lower; i < (upper + 1); i++) {
        var sub = {};
        sub[variable] = i;
        newExpr = newExpr.add(thisExpr.eval(sub, simplify), simplify);
    }
    return newExpr;
};

Expression.prototype.toRational = function () {
    var copy = this.copy();
    var numer = copy;
    var denom = new Expression(1);
    return new Rational(numer, denom);
}

Expression.prototype.toString = function (options) {
    var str = "";

    for (var i = 0; i < this.terms.length; i++) {
        var term = this.terms[i];
        if (term instanceof Rational)
            str += " + " + term.toString();
        else
            str += (term.coefficients[0].valueOf() < 0 ? " - " : " + ") + term.toString(options);
    }

    for (var i = 0; i < this.constants.length; i++) {
        var constant = this.constants[i];

        str += (constant.valueOf() < 0 ? " - " : " + ") + constant.abs().toString();
    }

    if (str.substring(0, 3) === " - ") {
        return "-" + str.substring(3, str.length);
    } else if (str.substring(0, 3) === " + ") {
        return str.substring(3, str.length);
    } else {
        return "0";
    }
};

Expression.prototype.toTex = function (dict) {
    var str = "";

    for (var i = 0; i < this.terms.length; i++) {
        var term = this.terms[i];

        str += (term.coefficients[0].valueOf() < 0 ? " - " : " + ") + term.toTex(dict);
    }

    for (var i = 0; i < this.constants.length; i++) {
        var constant = this.constants[i];

        str += (constant.valueOf() < 0 ? " - " : " + ") + constant.abs().toTex();
    }

    if (str.substring(0, 3) === " - ") {
        return "-" + str.substring(3, str.length);
    } else if (str.substring(0, 3) === " + ") {
        return str.substring(3, str.length);
    } else {
        return "0";
    }
};

Expression.prototype._removeTermsWithCoefficientZero = function () {
    this.terms = this.terms.filter(function (t) { return (t instanceof Rational) ? true : t.coefficient().reduce().numer !== 0; });
    return this;
};

Expression.prototype._combineLikeTerms = function () {
    function alreadyEncountered(term, encountered) {
        for (var i = 0; i < encountered.length; i++) {
            if (term.canBeCombinedWith(encountered[i])) {
                return true;
            }
        }

        return false;
    }

    var newTerms = [];
    var encountered = [];

    for (var i = 0; i < this.terms.length; i++) {
        var thisTerm = this.terms[i];

        if (alreadyEncountered(thisTerm, encountered)) {
            continue;
        } else {
            for (var j = i + 1; j < this.terms.length; j++) {
                var thatTerm = this.terms[j];

                if (thisTerm.canBeCombinedWith(thatTerm)) {
                    thisTerm = thisTerm.add(thatTerm);
                }
            }

            newTerms.push(thisTerm);
            encountered.push(thisTerm);
        }

    }

    this.terms = newTerms;
    return this;
};

Expression.prototype._moveTermsWithDegreeZeroToConstants = function () {
    var keepTerms = [];
    var constant = new Fraction(0, 1);

    for (var i = 0; i < this.terms.length; i++) {
        var thisTerm = this.terms[i];

        if (thisTerm.maxDegree() == 0) {
            constant = constant.add(thisTerm.coefficient());
        } else {
            keepTerms.push(thisTerm);
        }
    }

    this.constants.push(constant);
    this.terms = keepTerms;
    return this;
};

Expression.prototype._sort = function () {
    function sortTerms(a, b) {
        if (a instanceof Rational || b instanceof Rational)
            return 0;
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

Expression.prototype._hasVariable = function (variable) {
    for (var i = 0; i < this.terms.length; i++) {
        if (this.terms[i].hasVariable(variable)) {
            return true;
        }
    }

    return false;
};

Expression.prototype._onlyHasVariable = function (variable) {
    for (var i = 0; i < this.terms.length; i++) {
        if (!this.terms[i].onlyHasVariable(variable)) {
            return false;
        }
    }

    return true;
};

Expression.prototype._noCrossProductsWithVariable = function (variable) {
    for (var i = 0; i < this.terms.length; i++) {
        var term = this.terms[i];
        if (term.hasVariable(variable) && !term.onlyHasVariable(variable)) {
            return false;
        }
    }

    return true;
};

Expression.prototype._noCrossProducts = function () {
    for (var i = 0; i < this.terms.length; i++) {
        var term = this.terms[i];
        if (term.variables.length > 1) {
            return false;
        }
    }

    return true;
};

Expression.prototype._maxDegree = function () {
    return this.terms.reduce(function (p, c) { return Math.max(p, c.maxDegree()); }, 0);
};

Expression.prototype._maxDegreeOfVariable = function (variable) {
    return this.terms.reduce(function (p, c) { return Math.max(p, c.maxDegreeOfVariable(variable)); }, 0);
};

Expression.prototype._quadraticCoefficients = function () {
    // This function isn't used until everything has been moved to the LHS in Equation.solve.
    var a;
    var b = new Fraction(0, 1);
    for (var i = 0; i < this.terms.length; i++) {
        var thisTerm = this.terms[i];
        a = (thisTerm.maxDegree() === 2) ? thisTerm.coefficient().copy() : a;
        b = (thisTerm.maxDegree() === 1) ? thisTerm.coefficient().copy() : b;
    }
    var c = this.constant();

    return { a: a, b: b, c: c };
};

Expression.prototype._cubicCoefficients = function () {
    // This function isn't used until everything has been moved to the LHS in Equation.solve.
    var a;
    var b = new Fraction(0, 1);
    var c = new Fraction(0, 1);

    for (var i = 0; i < this.terms.length; i++) {
        var thisTerm = this.terms[i];
        a = (thisTerm.maxDegree() === 3) ? thisTerm.coefficient().copy() : a;
        b = (thisTerm.maxDegree() === 2) ? thisTerm.coefficient().copy() : b;
        c = (thisTerm.maxDegree() === 1) ? thisTerm.coefficient().copy() : c;
    }

    var d = this.constant();
    return { a: a, b: b, c: c, d: d };
};

Term = function (variable) {
    if (variable instanceof Variable) {
        this.variables = [variable.copy()];
        this.coefficients = [new Fraction(1, 1)];
    } else if (variable instanceof Fraction) {
        this.variables = [];
        this.coefficients = [variable];
    } else if (typeof (variable) === "undefined") {
        this.variables = [];
        this.coefficients = [new Fraction(1, 1)];
    } else {
        throw new TypeError("Invalid Argument (" + variable.toString() + "): Term initializer must be of type Variable.");
    }
};

Term.prototype.coefficient = function () {
    //calculate the product of all coefficients
    return this.coefficients.reduce(function (p, c) { return p.multiply(c); }, new Fraction(1, 1));
};

Term.prototype.simplify = function () {
    var copy = this.copy();
    copy.coefficients = [this.coefficient()];
    copy.combineVars();
    return copy.sort();
};

Term.prototype.combineVars = function () {
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

Term.prototype.copy = function () {
    var copy = new Term();
    copy.coefficients = this.coefficients.map(function (c) { return c.copy(); });
    copy.variables = this.variables.map(function (v) { return v.copy(); });
    return copy;
};

Term.prototype.add = function (term) {
    if (term instanceof Term && this.canBeCombinedWith(term)) {
        var copy = this.copy();
        copy.coefficients = [copy.coefficient().add(term.coefficient())];
        return copy;
    } else if (term instanceof Rational) {
        return term.add(new Expression(this));
    } else {
        throw new TypeError("Invalid Argument (" + term.toString() + "): Summand must be of type String, Expression, Term, Fraction or Integer.");
    }
};

Term.prototype.subtract = function (term) {
    if (term instanceof Term && this.canBeCombinedWith(term)) {
        var copy = this.copy();
        copy.coefficients = [copy.coefficient().subtract(term.coefficient())];
        return copy;
    } else if (a instanceof Rational) {
        var exp = new Expression(this);
        return exp.toRational().subtract(a);
    } else {
        throw new TypeError("Invalid Argument (" + term.toString() + "): Subtrahend must be of type String, Expression, Term, Fraction or Integer.");
    }
};

Term.prototype.multiply = function (a, simplify) {
    var thisTerm = this.copy();

    if (a instanceof Term) {
        thisTerm.variables = thisTerm.variables.concat(a.variables);
        thisTerm.coefficients = a.coefficients.concat(thisTerm.coefficients);

    } else if (isInt(a) || a instanceof Fraction) {
        var newCoef = (isInt(a) ? new Fraction(a, 1) : a);

        if (thisTerm.variables.length === 0) {
            thisTerm.coefficients.push(newCoef);
        } else {
            thisTerm.coefficients.unshift(newCoef);
        }
    } else if (a instanceof Rational) {
        return a.multiply(new Expression(this));
    } else {
        throw new TypeError("Invalid Argument (" + a.toString() + "): Multiplicand must be of type String, Expression, Term, Fraction or Integer.");
    }

    return (simplify || simplify === undefined) ? thisTerm.simplify() : thisTerm;
};

Term.prototype.divide = function (a, simplify) {
    if (isInt(a) || a instanceof Fraction) {
        var thisTerm = this.copy();
        thisTerm.coefficients = thisTerm.coefficients.map(function (c) { return c.divide(a, simplify); });
        return thisTerm;
    } else if (a instanceof Term) {
        var num = this.copy();
        var denom = a.copy();
        //Devide coefficients
        var numCoef = num.coefficient();
        var denomCoef = denom.coefficient();

        //The expressions have just been simplified - only one coefficient per term
        num.coefficients[0] = numCoef.divide(denomCoef, simplify);
        denom.coefficients[0] = new Fraction(1, 1);

        //Cancel variables
        for (var i = 0; i < num.variables.length; i++) {
            var numVar = num.variables[i];
            for (var j = 0; j < denom.variables.length; j++) {
                var denomVar = denom.variables[j];
                //Check for equal variables
                if (numVar.variable === denomVar.variable) {
                    //Use the rule for division of powers
                    num.variables[i].degree = numVar.degree - denomVar.degree;
                    denom.variables[j].degree = 0;
                }
            }
        }

        //Invers all degrees of remaining variables
        for (var i = 0; i < denom.variables.length; i++) {
            denom.variables[i].degree *= -1;
        }
        //Multiply the inversed variables to the numenator
        num = num.multiply(denom, simplify);
        return num;
    } else if (a instanceof Rational) {
        var exp = new Expression(this);
        return exp.toRational().divide(a);
    } else {
        throw new TypeError("Invalid Argument (" + a.toString() + "): Argument must be of type Fraction or Integer.");
    }
};

Term.prototype.eval = function (values, simplify) {
    var copy = this.copy();
    var keys = Object.keys(values);
    var exp = copy.coefficients.reduce(function (p, c) { return p.multiply(c, simplify); }, new Expression(1));

    for (var i = 0; i < copy.variables.length; i++) {
        var thisVar = copy.variables[i];

        var ev;

        if (thisVar.variable in values) {
            var sub = values[thisVar.variable];

            if (sub instanceof Fraction || sub instanceof Expression) {
                ev = sub.pow(thisVar.degree);
            } else if (isInt(sub)) {
                ev = Math.pow(sub, thisVar.degree);
            } else {
                throw new TypeError("Invalid Argument (" + sub + "): Can only evaluate Expressions or Fractions.");
            }
        } else {
            ev = new Expression(thisVar.variable).pow(thisVar.degree);
        }

        exp = exp.multiply(ev, simplify);
    }

    return exp;
};

Term.prototype.hasVariable = function (variable) {
    for (var i = 0; i < this.variables.length; i++) {
        if (this.variables[i].variable === variable) {
            return true;
        }
    }

    return false;
};

Term.prototype.maxDegree = function () {
    return this.variables.reduce(function (p, c) { return Math.max(p, c.degree); }, 0);
};

Term.prototype.maxDegreeOfVariable = function (variable) {
    return this.variables.reduce(function (p, c) { return (c.variable === variable) ? Math.max(p, c.degree) : p; }, 0);
};

Term.prototype.canBeCombinedWith = function (term) {
    if (term instanceof Rational)
        return true;
    var thisVars = this.variables;
    var thatVars = term.variables;

    if (thisVars.length != thatVars.length) {
        return this.maxDegree() == 0 && term.maxDegree() == 0;
    }

    var matches = 0;

    for (var i = 0; i < thisVars.length; i++) {
        for (var j = 0; j < thatVars.length; j++) {
            if (thisVars[i].variable === thatVars[j].variable && thisVars[i].degree === thatVars[j].degree) {
                matches += 1;
            }
        }
    }

    return (matches === thisVars.length);
};

Term.prototype.onlyHasVariable = function (variable) {
    for (var i = 0; i < this.variables.length; i++) {
        if (this.variables[i].variable != variable) {
            return false;
        }
    }

    return true;
};

Term.prototype.sort = function () {
    function sortVars(a, b) {
        return b.degree - a.degree;
    }

    this.variables = this.variables.sort(sortVars);
    return this;
};

Term.prototype.toString = function (options) {
    var implicit = options && options.implicit;
    var str = "";

    for (var i = 0; i < this.coefficients.length; i++) {
        var coef = this.coefficients[i];

        if (coef.abs().numer !== 1 || coef.abs().denom !== 1 || this.maxDegree() === 0) {
            str += " * " + coef.toString();
        }
    }
    str = this.variables.reduce(function (p, c) {
        if (implicit && !!p) {
            var vStr = c.toString();
            return !!vStr ? p + "*" + vStr : p;
        } else
            return p.concat(c.toString());
    }, str);
    str = (str.substring(0, 3) === " * " ? str.substring(3, str.length) : str);
    str = (str.substring(0, 1) === "-" ? str.substring(1, str.length) : str);

    return str;
};

Term.prototype.toTex = function (dict) {
    var dict = (dict === undefined) ? {} : dict;
    dict.multiplication = !("multiplication" in dict) ? "cdot" : dict.multiplication;

    var op = " \\" + dict.multiplication + " ";

    var str = "";

    for (var i = 0; i < this.coefficients.length; i++) {
        var coef = this.coefficients[i];

        if (coef.abs().numer !== 1 || coef.abs().denom !== 1) {
            str += op + coef.toTex();
        }
    }
    str = this.variables.reduce(function (p, c) { return p.concat(c.toTex()); }, str);
    str = (str.substring(0, op.length) === op ? str.substring(op.length, str.length) : str);
    str = (str.substring(0, 1) === "-" ? str.substring(1, str.length) : str);
    str = (str.substring(0, 7) === "\\frac{-" ? "\\frac{" + str.substring(7, str.length) : str);

    return str;
};

var Variable = function (variable) {
    if (typeof (variable) === "string") {
        this.variable = variable;
        this.degree = 1;
    } else {
        throw new TypeError("Invalid Argument (" + variable.toString() + "): Variable initalizer must be of type String.");
    }
};

Variable.prototype.copy = function () {
    var copy = new Variable(this.variable);
    copy.degree = this.degree;
    return copy;
};

Variable.prototype.toString = function () {
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

Variable.prototype.toTex = function () {
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


var Rational = function (a, b) {
    if (a instanceof Expression)
        this.numer = a;
    else
        this.numer = new Expression(a);
    if (b instanceof Expression)
        this.denom = b;
    else
        this.denom = new Expression(b);
}

function toFraction(a) {
    var i;
    for (i = 1; (a * i) % 1 != 0 && i < 10000; i++);
    return new Fraction(a * i, i);
}

function gcd_term(a, b) {
    var a_vars = a.variables;
    var b_vars = b.variables;

    var variables = [];
    for (var i = 0; i < a_vars.length; i++) {
        for (var j = 0; j < b_vars.length; j++) {
            if (a_vars[i].variable == b_vars[j].variable) {
                var variable = a_vars[i].copy();
                variable.degree = Math.min(a_vars[i].degree, b_vars[j].degree);
                variables.push(variable);
            }
        }
    }

    var a_coeff = a.coefficient();
    var b_coeff = b.coefficient();
    var final_coeff = gcd_num(a_coeff, b_coeff);
    var term = new Term();
    term.variables = variables;
    term.coefficients = [toFraction(final_coeff)];

    return term;
}

Rational.prototype.copy = function () {
    return new Rational(this.numer.copy(), this.denom.copy());
}

Rational.prototype.canBeCombinedWith = function (a) {
    return true;
}

Rational.prototype.add = function (a) {
    if (a instanceof Rational) {
        var summand = a.copy();
        var me = this.copy();
        me.numer = me.numer.multiply(summand.denom);
        summand.numer = summand.numer.multiply(me.denom);
        var new_denom = me.denom.multiply(summand.denom);
        var new_numer = me.numer.add(summand.numer);
        var sum = new Rational(new_numer, new_denom);
        return sum;
    } else if (a instanceof Expression) {
        return this.add(a.toRational());
    } else {
        return this.add(new Expression(a));
    }
}

Rational.prototype.subtract = function (a) {
    if (a instanceof Rational) {
        return this.copy().add(a.multiply(-1));
    } else if (a instanceof Expression) {
        return this.subtract(a.toRational());
    } else {
        return this.subtract(new Expression(a));
    }
}

Rational.prototype.multiply = function (a) {
    if (a instanceof Rational) {
        var copy = a.copy();
        var me = this.copy();
        var new_numer = me.numer.multiply(copy.numer);
        var new_denom = me.denom.multiply(copy.denom);
        return new Rational(new_numer, new_denom);
    } else if (a instanceof Expression) {
        return this.multiply(a.toRational());
    } else {
        return this.multiply(new Expression(a));
    }
}

Rational.prototype.divide = function (a) {
    if (a instanceof Rational) {
        var copy = a.copy();
        var new_numer = copy.denom;
        var new_denom = copy.numer;
        var rational = new Rational(new_numer, new_denom);
        return this.multiply(rational);
    } else if (a instanceof Expression) {
        return this.divide(a.toRational());
    } else {
        return this.divide(new Expression(a));
    }
}

Rational.prototype.reduce = function () {
    var copy = this.copy();
    var terms = copy.numer.terms.concat(copy.denom.terms).concat();
    var a = terms[0], b;
    for (var i = 1; i < terms.length; i++) {
        b = terms[i];
        a = gcd_term(a, b);
    }
    var constants = [a.coefficient(), copy.numer.constant(), copy.denom.constant()];
    var c = constants[0], d;
    for (var i = 1; i < constants.length; i++) {
        d = constants[i];
        c = (d == 0) ? c : gcd_num(c, d);
    }
    a.coefficients = [toFraction(c)];
    var g = new Expression(a);
    copy.numer = copy.numer.divide(g);
    copy.denom = copy.denom.divide(g);

    return copy;
}

Rational.prototype.toString = function () {
    return "(" + this.numer + ") / (" + this.denom + ")";
}

module.exports = {
    Rational: Rational,
    Expression: Expression,
    Term: Term,
    Variable: Variable
};
