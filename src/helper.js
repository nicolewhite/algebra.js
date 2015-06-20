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
        if (thing % 1 === 0) {
            return true;
        }
    }

    return false;
}

function isAPowerOfTwo(int) {
    if (isInt(int)) {
        var x = Math.log(int) / Math.log(2);
        return x % 1 === 0;
    }

    return false;
}

GREEK_LETTERS = [
    'alpha',
    'beta',
    'gamma',
    'Gamma',
    'delta',
    'Delta',
    'epsilon',
    'varepsilon',
    'zeta',
    'eta',
    'theta',
    'vartheta',
    'Theta',
    'iota',
    'kappa',
    'lambda',
    'Lambda',
    'mu',
    'nu',
    'xi',
    'Xi',
    'pi',
    'Pi',
    'rho',
    'varrho',
    'sigma',
    'Sigma',
    'tau',
    'upsilon',
    'Upsilon',
    'phi',
    'varphi',
    'Phi',
    'chi',
    'psi',
    'Psi',
    'omega',
    'Omega'
];

exports.gcd = gcd;
exports.lcm = lcm;
exports.isInt = isInt;
exports.isAPowerOfTwo = isAPowerOfTwo;
exports.GREEK_LETTERS = GREEK_LETTERS;