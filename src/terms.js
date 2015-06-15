var Fraction = require('./fractions');
var Variable = require('./variables');
var isInt = require('./helper').isInt;

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

    return thisTerm;
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

Term.prototype.evaluateAt = function(values) {
    var thisTerm = this.copy();
    var varMap = Object.keys(values);
    var keepVars = [];

    for (var i = 0; i < this.variables.length; i++) {
        var thisVar = this.variables[i];
        var keep = true;

        for (var j = 0; j < varMap.length; j++) {
            if (thisVar.variable === varMap[j]) {
                var eval = values[varMap[j]];

                if (eval instanceof Fraction) {
                    eval = eval.pow(thisVar.degree);
                } else if (isInt(eval)) {
                    eval = Math.pow(eval, thisVar.degree);
                } else {
                    throw "InvalidArgument";
                }

                thisTerm.coefficient = thisTerm.coefficient.multiply(eval);
                keep = false;
            }
        }

        if (keep) {
            keepVars.push(thisVar);
        }
    }

    thisTerm.variables = keepVars;
    return thisTerm;
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
    max = 1;
    for(var i = 0; i < this.variables.length; i++) {
        if(this.variables[i].degree > max) {
            max = this.variables[i].degree;
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

Term.prototype.print = function() {
    var str;
    var coefficient = this.coefficient.reduce().abs();

    if(coefficient.decimal() === 1) {
        str = "";
    } else {
        str = coefficient.print();
    }

    for(var i = 0; i < this.variables.length; i++) {
        str += this.variables[i].print();
    }

    return str;
};

Term.prototype.tex = function() {
    var str;
    var coefficient = this.coefficient.reduce().abs();

    if(coefficient.decimal() === 1) {
        str = "";
    } else {
        str = coefficient.tex();
    }

    for(var i = 0; i < this.variables.length; i++) {
        str += this.variables[i].tex();
    }

    return str;
};

module.exports = Term;