var isInt = require('./helper').isInt;
var gcd = require('./helper').gcd;
var lcm = require('./helper').lcm;
var UserException = require('./exceptions').UserException;

var Fraction = function(a, b) {
    if (b == 0) {
        throw new UserException("DivideByZero");
    } else if (isInt(a) && isInt(b)) {
        this.numer = a;
        this.denom = b;
    } else {
        throw new UserException("InvalidArgument");
    }
};

Fraction.prototype.copy = function() {
    return new Fraction(this.numer, this.denom);
};

Fraction.prototype.reduce = function() {
    var copy = this.copy();

    var g = gcd(copy.numer, copy.denom);
    copy.numer = copy.numer / g;
    copy.denom = copy.denom / g;

    if (Math.sign(copy.denom) == -1 && Math.sign(copy.numer) == 1) {
        copy.numer *= -1;
        copy.denom *= -1;
    }

    return copy;
};

Fraction.prototype.equalTo = function(fraction) {
    if(fraction instanceof Fraction) {
        var thisReduced = this.reduce();
        var thatReduced = fraction.reduce();

        if(thisReduced.numer === thatReduced.numer && thisReduced.denom === thatReduced.denom) {
            return true;
        }
    }

    return false;
};

Fraction.prototype.add = function(f) {
    var a, b;

    if (f instanceof Fraction) {
        a = f.numer;
        b = f.denom;
    } else if (isInt(f)) {
        a = f;
        b = 1;
    } else {
        throw new UserException("InvalidArgument");
    }

    var copy = this.copy();

    if (this.denom == b) {
        copy.numer += a;
    } else {
        var m = lcm(copy.denom, b);
        var thisM = m / copy.denom;
        var otherM = m / b;

        copy.numer *= thisM;
        copy.denom *= thisM;

        a *= otherM;

        copy.numer += a;
    }

    return copy;
};

Fraction.prototype.subtract = function(f) {
    var copy = this.copy();

    if (f instanceof Fraction) {
        return copy.add(new Fraction(-f.numer, f.denom));
    } else if (isInt(f)) {
        return copy.add(new Fraction(-f, 1));
    } else {
        throw new UserException("InvalidArgument");
    }
};

Fraction.prototype.multiply = function(f) {
    var a, b;

    if (f instanceof Fraction) {
        a = f.numer;
        b = f.denom;
    } else if (isInt(f) && f) {
        a = f;
        b = 1;
    } else if (f == 0) {
        a = 0;
        b = 1;
    } else {
        throw new UserException("InvalidArgument");
    }

    var copy = this.copy();

    copy.numer *= a;
    copy.denom *= b;

    return copy;
};

Fraction.prototype.divide = function(f) {
    if (f == 0) {
        throw new UserException("DivideByZero");
    }

    var copy = this.copy();

    if (f instanceof Fraction) {
        return copy.multiply(new Fraction(f.denom, f.numer));
    } else if (isInt(f)) {
        return copy.multiply(new Fraction(1, f));
    } else {
        throw new UserException("InvalidArgument");
    }
};

Fraction.prototype.abs = function() {
    var copy = this.copy();
    copy.numer = Math.abs(copy.numer);
    copy.denom = Math.abs(copy.denom);
    return copy;
};

Fraction.prototype.decimal = function() {
    return this.numer / this.denom;
};

Fraction.prototype.print = function() {
    if (this.numer == 0) {
        return "0";
    } else if (this.denom == 1) {
        return this.numer.toString();
    } else if (this.denom == -1) {
        return (-this.numer).toString();
    } else {
        return this.numer + "/" + this.denom;
    }
};

Fraction.prototype.tex = function() {
    if (this.numer == 0) {
        return "0";
    } else if (this.denom == 1) {
        return this.numer.toString();
    } else if (this.denom == -1) {
        return (-this.numer).toString();
    } else {
        var str = "";
        var top = this.numer;

        if (Math.sign(this.numer) == -1 && Math.sign(this.denom) == 1) {
            str = "-";
            top = Math.abs(top);
        }

        return str + "\\frac{" + top + "}{" + this.denom + "}";
    }
};

module.exports = Fraction;