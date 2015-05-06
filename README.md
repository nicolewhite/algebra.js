# algebra.js

Algebra with JavaScript!

## Usage

```javascript
var algebra = require('algebra');
```

## Fractions

Add, subtract, multiply, and divide fractions by either integers or other fractions.

```javascript
var Fraction = algebra.Fraction;

var frac = new Fraction(1, 2);
console.log(frac.print());

frac = frac.add(4);
console.log(frac.print());

frac = frac.multiply(new Fraction(6, 7));
console.log(frac.print());

frac = frac.reduce();
console.log(frac.print());
```

```
1/2
9/2
54/14
27/7
```

## Expressions

Initialize expressions with a variable name. Add integers, fractions, or other expressions to expressions.
Multiply and divide expressions by either integers or fractions.

```javascript
var Expression = algebra.Expression;

var x = new Expression("x");
x = x.add(5);
x = x.divide(4);

console.log(x.print());

var y = new Expression("y");
y = y.subtract(new Fraction(4, 5));
y = y.multiply(3);

console.log(y.print());
```

```
1/4x + 5/4
3y - 12/5
```

## Equations

Build an equation by setting an expression equal to another expression or to an integer or fraction.

If setting equal to another expression of a different variable, solving for either variable will return an expression.

```javascript
var Equation = algebra.Equation;

var x = new Expression("x").add(5).divide(4);
var y = new Expression("y").subtract(new Fraction(4, 5)).multiply(3);

var eq = new Equation(x, y);

console.log(eq.print());

console.log("x = " + eq.solveFor("x").print());
console.log("y = " + eq.solveFor("y").print());
```

```
1/4x + 5/4 = 3y - 12/5
x = 12y - 73/5
y = 1/12x + 73/60
```

If setting equal to another expression of the same variable, solving for the variable will return a fraction object.

```javascript
var x1 = new Expression("x").add(new Fraction(2, 3)).divide(5);
var x2 = new Expression("x").divide(7).add(4);

var eq = new Equation(x1, x2);

console.log(eq.print());
console.log("x = " + eq.solveFor("x").print());
```

```
1/5x + 2/15 = 1/7x + 4
x = 203/3
```

You can also specify an integer or fraction as the right hand side of the equation.

```javascript
var z = new Expression("z").subtract(4).divide(9);

var eq = new Equation(z, 0);

console.log(eq.print());
console.log("z = " + eq.solveFor("z").print());
```

```
1/9z - 4/9 = 0
z = 4
```