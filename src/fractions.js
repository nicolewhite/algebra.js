var isInt = require('./helper').isInt;
var gcd = require('./helper').gcd;
var lcm = require('./helper').lcm;

var Fraction = function(a, b) {
    if (b == 0) {
        throw "DivideByZero";
    } else if (isInt(a) && isInt(b)) {
        this.numer = a;
        this.denom = b;
    } else {
        throw "InvalidArgument";
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
        throw "InvalidArgument";
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

    return copy.reduce();
};

Fraction.prototype.subtract = function(f) {
    var copy = this.copy();

    if (f instanceof Fraction) {
        return copy.add(new Fraction(-f.numer, f.denom));
    } else if (isInt(f)) {
        return copy.add(new Fraction(-f, 1));
    } else {
        throw "InvalidArgument";
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
        throw "InvalidArgument";
    }

    var copy = this.copy();

    copy.numer *= a;
    copy.denom *= b;

    return copy.reduce();
};

Fraction.prototype.divide = function(f) {
    if (f == 0) {
        throw "DivideByZero";
    }

    var copy = this.copy();

    if (f instanceof Fraction) {
        return copy.multiply(new Fraction(f.denom, f.numer));
    } else if (isInt(f)) {
        return copy.multiply(new Fraction(1, f));
    } else {
        throw "InvalidArgument";
    }
};

Fraction.prototype.pow = function(n) {
    if (isInt(n)) {
        if (n === 0) {
            return new Fraction(1, 1);
        } else {
            var copy = this.copy();

            for (var i = 0; i < n - 1; i++) {
                copy = copy.multiply(this);
            }

            return copy;
        }
    } else {
        throw "InvalidArgument";
    }
};

Fraction.prototype.abs = function() {
    var copy = this.copy();
    copy.numer = Math.abs(copy.numer);
    copy.denom = Math.abs(copy.denom);
    return copy.reduce();
};

Fraction.prototype.valueOf = function() {
    return this.numer / this.denom;
};

Fraction.prototype.toString = function() {
    var frac = this.reduce();

    if (frac.numer == 0) {
        return "0";
    } else if (frac.denom == 1) {
        return frac.numer.toString();
    } else if (frac.denom == -1) {
        return (-frac.numer).toString();
    } else {
        return frac.numer + "/" + frac.denom;
    }
};

Fraction.prototype.toTex = function() {
    var frac = this.reduce();

    if (frac.numer == 0) {
        return "0";
    } else if (frac.denom == 1) {
        return frac.numer.toString();
    } else if (frac.denom == -1) {
        return (-frac.numer).toString();
    } else {
        return "\\frac{" + frac.numer + "}{" + frac.denom + "}";
    }
};

module.exports = Fraction;