function gcd(x, y) {
    while (y) {
        var temp = x;
        x = y;
        y = temp % y;
    }

    return x;
}

function lcm(x, y) {
    return (x * y) / gcd(x, y);
}

function isInt(thing) {
    if (typeof thing == "number") {
        if (thing % 1 == 0) {
            return true;
        }
    }

    return false;
}

exports.gcd = gcd;
exports.lcm = lcm;
exports.isInt = isInt;