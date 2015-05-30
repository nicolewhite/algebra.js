# algebra.js

Algebra with JavaScript!

## Usage

```javascript
var algebra = require('algebra');
```

## Fractions

Add, subtract, multiply, and divide fractions by either integers or other fractions. Fractions are not automatically 
reduced; the idea is that you'd use this library for building tutorials, so it would be desirable in some cases to 
be able to build fractions and display their unreduced form.

```js
var frac = new Fraction(1, 2);
console.log(frac.print());

frac = frac.subtract(5);
console.log(frac.print());

frac = frac.multiply(new Fraction(6, 7));
console.log(frac.print());

frac = frac.reduce();
console.log(frac.print());
```

```
1/2
-9/2
-54/14
-27/7
```

## Expressions

Initialize expressions with a variable name. Add integers, fractions, or other expressions to expressions.
Multiply and divide expressions by either integers or fractions. Evaluate expressions by substituting in fractions or 
integers for variables.

```js
var x = new Expression("x");
x = x.add(5);
x = x.divide(4);

console.log(x.print());

var y = new Expression("y");
y = y.subtract(new Fraction(4, 5));
y = y.multiply(3);

console.log(y.print());

x = x.add(y);
console.log(x.print());

var eval1 = x.evaluateAt({'y': 3});
console.log(eval1.print());

var eval2 = x.evaluateAt({'y': 3, 'x': new Fraction(1, 2)});
console.log(eval2.print());
```

```
1/4x + 5/4
3y - 12/5
1/4x + 3y - 23/20
1/4x + 157/20
319/40
```

## Equations

Build an equation by setting an expression equal to another expression or to an integer or fraction.

### Multiple Variables

If the equation contains more than one variable, solving for a variable will return an expression.

```js
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

### Single Variable

If the equation only has one variable, solving for that variable will return a fraction object.

```js
var x1 = new Expression("x").add(new Fraction(2, 3)).divide(5);
var x2 = new Expression("x").divide(7).add(4);

var eq = new Equation(x1, x2);
console.log(eq.print());

console.log(eq.solveFor("x").print());
```

```
1/5x + 2/15 = 1/7x + 4
x = 203/3
```

### Right Hand Side Options

You can also specify an integer or fraction as the right hand side of the equation.

```js
var z = new Expression("z").subtract(4).divide(9);

var eq1 = new Equation(z, 0);

console.log(eq1.print());
console.log("z = " + eq1.solveFor("z").print());

var eq2 = new Equation(z, new Fraction(1, 4));

console.log(eq2.print());
console.log("z = " + eq2.solveFor("z").print());
```

```
1/9z - 4/9 = 0
z = 4
1/9z - 4/9 = 1/4
z = 25/4
```