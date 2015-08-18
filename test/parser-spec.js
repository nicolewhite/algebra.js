var Expression = require('../src/expressions').Expression;
var Parser = require('../src/parser');

describe("Normal behavior for non-parse case", function() {
    var x1 = Parser.parse("x");
    var x2 = Parser.parse("x2");
    
    it("should behave normally", function() {
        expect(x1.toString()).toEqual("x");
    });
    
    it("should treat x2 as variable x2 (and not 2*x)", function() {
        expect(x2.toString()).toEqual("x2");
    });    
});

describe("Simple parse behavior", function() {
    var x1 = Parser.parse("2x");
    var x2 = Parser.parse("x + 3");
    var x3 = Parser.parse("5/4");
    
    it("should be interpreted as 2*x", function() {
        expect(x1.toString()).toEqual("2x");
    });
    
    it("should be interpreted as x + 3", function() {
        expect(x2.toString()).toEqual("x + 3");
    });
    
    it("should be interpreted as 5/4", function() {
        expect(x3.toString()).toEqual("5/4");
    });      
});

describe("Parentheses parse behavior", function() {
    var x1 = Parser.parse("2(x + 3)");
    var x2 = Parser.parse("(2x) + 3");
    var x3 = Parser.parse("(((x + 3)))");
    
    it("should be interpreted as 2x + 6", function() {
        expect(x1.toString()).toEqual("2x + 6");
    }); 

    it("should be interpreted as 2x + 3", function() {
        expect(x2.toString()).toEqual("2x + 3");
    }); 
    
    it("should be interpreted as x + 3", function() {
        expect(x3.toString()).toEqual("x + 3");
    });     
});

describe("Equation parse behavior", function() {
    var x1 = Parser.parse("x=y");
    
    it("should be interpreted as x=y", function() {
        expect(x1.toString()).toEqual("x = y");
    });  
});