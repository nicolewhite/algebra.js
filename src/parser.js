'use strict';

var Lexer = require('./lexer'),
    Expression = require('./expressions').Expression,
    Equation = require('./equations');

/*
    This parser module uses the shunting yard algorithm to convert input strings
    to algebraic expressions using the algebra.js module.
*/
var Parser = function() {
    this.lexer = new Lexer();
    this.current_token = null;
    this.operator_stack = []; //The operator stack
    this.output = []; //The output stack

    //Operator precendence definitions
    this.prec = {
        'EQUALS' : 1,
        'PLUS' : 2,
        'MINUS' : 2,
        'MULTIPLY': 3,
        'DIVIDE':3,
        'POWER': 4
    };

    //Operator associativity definitions
    this.asso = {
        'PLUS' : 'LEFT',
        'MINUS' : 'LEFT',
        'MULTIPLY': 'LEFT',
        'DIVIDE':'LEFT',
        'POWER': 'RIGHT',
        'EQUALS' : 'RIGHT'
    };
};


/*
    Initializes the parser internals and the lexer.
    The input is then parsed using the shunting yard algorithm
    and the expression tree is constructed and returned as the result
*/
Parser.prototype.parse = function(input) {
    this.operator_stack = []; // empty the operator stack
    this.output = []; //empty the output stack
    //pass the input to the lexer
    this.lexer.input(input);
    //perform shunting yard algorithm
    this.shunting_yard();
    //construct the expression tree
    return this.construct_expression();
};

//Returns the stacks head
Parser.prototype.stack_top = function() {
    return this.operator_stack[this.operator_stack.length - 1];
};

//Moves the stacks head to the output
Parser.prototype.stack_head_to_ouput = function() {
    this.output.push(this.operator_stack.pop());
};

/*
    The shunting yard algorithm according to the description on https://en.wikipedia.org/wiki/Shunting-yard_algorithm. Comments are taken from the description on the site.
    This implementation ignores function and seperator tokens as they are not needed for the 
    parser.
*/
Parser.prototype.shunting_yard = function() {
    //Read the first token
    this.current_token = this.lexer.token();
    //While there are tokens to be read:
    while(this.current_token !== null){
        //If the token is a number, then add it to the output queue.
        if(this.current_token.type === 'NUMBER' || this.current_token.type === 'IDENTIFIER'){
            this.output.push(this.current_token);
        //If the token is an operator, o1, then:
        }else if (this.current_token.type ==='OPERATOR'){
            var o1 = this.current_token;
            //while there is an operator token, o2, at the top of the operator stack, and either
            while(this.operator_stack.length > 0){
                var o2 = this.stack_top();
                //o1 is left-associative and its precedence is less than or equal to that of o2, or o1 is right associative, and has precedence less than that of o2,
                if((this.asso[o1.value] === 'LEFT' && this.prec[o1.value] <= this.prec[o2.value])||
                   (this.asso[o1.value] === 'RIGHT' && this.prec[o1.value] < this.prec[o2.value])){
                    //then pop o2 off the operator stack, onto the output queue;
                    this.stack_head_to_ouput();
                }else{
                    break;
                }
            }
            //push o1 onto the operator stack.
            this.operator_stack.push(o1);
        }else {
            //If the token is a left parenthesis (i.e. '('), then push it onto the stack.
            if(this.current_token.value === 'L_PAREN'){
                this.operator_stack.push(this.current_token);
            //If the token is a right parenthesis (i.e. ')'):
            }else{
                //Until the token at the top of the stack is a left parenthesis, pop operators off the stack onto the output queue.
                while(this.stack_top() !== undefined){
                    if(this.stack_top().value === 'L_PAREN'){
                        break;
                    }else{
                        this.stack_head_to_ouput();    
                    }                    
                }
                //Pop the left parenthesis from the stack, but not onto the output queue.
                var head = this.operator_stack.pop();
                //If the stack runs out without finding a left parenthesis, then there are mismatched parentheses.
                if(head === undefined){
                    throw new Error('Unbalanced Parenthesis');
                }
            }
        }
        this.current_token = this.lexer.token();
    }
    //When there are no more tokens to read:
    //While there are still operator tokens in the stack:
    while(this.operator_stack.length > 0){
        //If the operator token on the top of the stack is a parenthesis, then there are mismatched parentheses.
        if(this.stack_top().type === 'PAREN'){
            throw new Error('Unbalanced Parenthesis');
        }else{
            //Pop the operator onto the output queue.
            this.stack_head_to_ouput();
        }
    }
    //Exit.
};

//Converts the base types NUMBER and IDENTIFIER to an Expression.
Parser.prototype.convert_for_application = function(operand) {
    var result = operand;
    if(operand.type !== undefined){
        if(parseInt(operand.value) == operand.value){
            result = new Expression(parseInt(operand.value));    
        }else{
            result = new Expression(operand.value);
        }
    }
    return result;
};

/*  
    Applies the specified operator to the specified operands.
    op is always a token of type OPERATOR,
    operands lhs and rhs can be tokens of type NUMBER or IDENTIFIER
    or Expression objects 
*/
Parser.prototype.apply_operator = function(op, lhs, rhs) {
    var result;  
   
    //Apply the operator
    switch(op.value){
        case 'PLUS': result = lhs.add(rhs);break;
        case 'MINUS': result = lhs.subtract(rhs);break; 
        case 'MULTIPLY': result = lhs.multiply(rhs);break;
        case 'DIVIDE': 
            /*
                Division is a bit special as the algebra.js module
                only allows division by integers or Fractions, but not
                Expressions. Therefore the rhs operand is always converted to an
                integer.
            */
            result = lhs.divide(parseInt(rhs.toString()));
            break;
        // Power also doesn't accept expressions as rhs operand
        case 'POWER': result = lhs.pow(parseInt(rhs.toString()));break;
        case 'EQUALS' : result = new Equation(lhs,rhs);break;
    }
    return result;
};


/*
    Recursively build the expression tree.
*/
Parser.prototype.construct_expression = function() {
    //Read the stack head
    var head = this.output.pop();
    //If its an operator, recursively construct the operands and apply the operator to construct the node
    if(head.type === 'OPERATOR'){
        var rhs = this.construct_expression();
        var lhs = this.construct_expression();
        return this.apply_operator(head, lhs,rhs);
    }else{
        //If it is not an operator, it can only be a number or a variable, which are leaves in the tree
        return this.convert_for_application(head);
    }
};

module.exports = Parser;