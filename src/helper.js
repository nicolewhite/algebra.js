Object.compare = function(obj1, obj2) {
    //Loop through properties in object 1
    for (var p in obj1) {
        //Check property exists on both objects
        if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

        switch (typeof (obj1[p])) {
            //Deep compare objects
            case 'object':
                if (!Object.compare(obj1[p], obj2[p])) return false;
                break;
            //Compare function code
            case 'function':
                if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
                break;
            //Compare values
            default:
                if (obj1[p] != obj2[p]) return false;
        }
    }

    //Check object 2 for any extra properties
    for (var p in obj2) {
        if (typeof (obj1[p]) == 'undefined') return false;
    }
    return true;
};

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
    return (typeof thing == "number") && (thing % 1 === 0);
}

function round(decimal, places) {
    places = (typeof(places) === "undefined" ? 2 : places);
    var x = Math.pow(10, places);
    return Math.round(parseFloat(decimal) * x) / x;
}

var GREEK_LETTERS = [
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
exports.round = round;
exports.GREEK_LETTERS = GREEK_LETTERS;