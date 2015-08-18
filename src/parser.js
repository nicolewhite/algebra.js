var Expression = require('./expressions').Expression;
var Fraction = require('./fractions');
var Equation = require('./equations');

var VARIABLE_REGEX = /^[a-zA-Z][a-zA-Z0-9]*$/g
var EQUATION_REGEX = /^([^=]+)=([^=]+)$/g
var EXPRESSION_REGEX = /^(?:([0-9]+|[+\-\*\/\^\(\)]|(?:[0-9]*[a-zA-Z][a-zA-Z0-9]*))\s*)+$/g

var SUPPORTED_OPS = {
    '^': function(expr1, expr2) {
        return expr1.pow(expr2);
    },
    '*': function(expr1, expr2) {
        return expr1.multiply(expr2);
    },
    '/': function(expr1, expr2) {
        if(expr2 instanceof Expression && expr2.isConstant()) {
            return expr1.divide(expr2.constant);    
        }
        return expr1.divide(expr2);    
    },
    '+': function(expr1, expr2) {
        return expr1.add(expr2);    
    },    
    '-': function(expr1, expr2) {
        return expr1.subtract(expr2);    
    }
}
    
var Parser = function() {
};

Parser.gobbleSpaces = function(expressionStr) {
    while(expressionStr.length > 0 && expressionStr.charAt(0) == ' ') {
        expressionStr = expressionStr.slice(1);
    }
    return expressionStr;
};

Parser.gobbleVariable = function(expressionStr) {
    var match = expressionStr.match(/^[a-zA-Z][a-zA-Z0-9]*/);
    expressionStr = expressionStr.slice(match[0].length);

    var expression = new Expression(match[0]); 
    return {
        expression: expression,
        expressionStr: expressionStr
    };
};

Parser.gobbleNumeric = function(expressionStr) {
    var match = expressionStr.match(/^[0-9]+/);
    expressionStr = expressionStr.slice(match[0].length);
       
    var expression = new Expression(new Fraction(parseInt(match[0], 10), 1));
    return {
        expression: expression,
        expressionStr: expressionStr
    };
}

Parser.gobbleExpression = function(expressionStr) {
    var expression;
    
    expressionStr = Parser.gobbleSpaces(expressionStr);
    var exprChar = expressionStr.charAt(0);
    if(exprChar == '(') {
        var expression = Parser.parseExpression(expressionStr.substring(1));
        // ')'
        expression.expressionStr = expression.expressionStr.substring(1); 
        
    } else if (exprChar.match(/[a-z]/i)) {
        expression = Parser.gobbleVariable(expressionStr);
    } else if (exprChar.match(/\d/) || exprChar == '.') {    
        expression = Parser.gobbleNumeric(expressionStr);
    }
    
    return expression;
};

Parser.parseExpression = function(expressionStr) {
    var expr1, op, expr2;

    expr1 = Parser.gobbleExpression(expressionStr);
    expressionStr = expr1.expressionStr;

    expressionStr = Parser.gobbleSpaces(expressionStr);    
    if(expressionStr.length == 0) {
        return expr1;
    }    
    
    var exprChar = expressionStr.charAt(0);    
    if(exprChar == ')') {
        return expr1;
    }
    
    op = '*';    
    if (SUPPORTED_OPS[exprChar]) {
        op = exprChar;
        expressionStr = expressionStr.slice(1);
    }
 
    expr2 = Parser.gobbleExpression(expressionStr);
    expressionStr = expr2.expressionStr;
  
    return {
        expression: SUPPORTED_OPS[op](expr1.expression, expr2.expression),
        expressionStr: expressionStr
    };
}

Parser.parse = function(expressionStr) {
    if(typeof(expressionStr) === "string") {
        if(expressionStr.match(VARIABLE_REGEX)) {
            return new Expression(expressionStr);
        } else if (expressionStr.match(EQUATION_REGEX)) {
        
            var equalMark = expressionStr.indexOf('=');
            var lefthandExp = Parser.parse(expressionStr.substring(0, equalMark));
            var righthandExp = Parser.parse(expressionStr.substring(equalMark+1));
            
            return new Equation(lefthandExp, righthandExp);
        } else if (expressionStr.match(EXPRESSION_REGEX)) {
            return Parser.parseExpression(expressionStr).expression;
        }
    }
    throw Error("InvalidArgument: " + expressionStr);
};


module.exports = {
    parse:  Parser.parse
};