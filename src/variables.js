var Fraction = require('./fractions');

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

Variable.prototype.hasTheSameVariableAndDegreeAs = function(variable) {
    if (variable instanceof Variable) {
        if (this.variable === variable.variable && this.degree === variable.degree) {
            return true;
        }
    }

    return false;
};

Variable.prototype.hasTheSameVariableAs = function(variable) {
    if(variable instanceof Variable) {
        if(this.variable === variable.variable) {
            return true;
        }
    }

    return false;
};

Variable.prototype.print = function() {
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

Variable.prototype.tex = function() {
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

module.exports = Variable;