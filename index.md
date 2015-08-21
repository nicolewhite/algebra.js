---
layout: default
---

# Quick Start

```js
var expr = new Expression("x");
expr = expr.subtract(3);
expr = expr.add("x");

console.log(expr.toString());
```

```
2x - 3
```

```js
var eq = new Equation(expr, 4);

console.log(eq.toString());
```

```
2x - 3 = 4
```

```js
var x = eq.solveFor("x");

console.log("x = " + x.toString());
```

```
x = 7/2
```

# Contents

- [Usage](#usage)
    - [Right Now](#usage-right-now)
    - [In the Browser](#usage-in-browser)
    - [In Node](#usage-in-node)
- [Getting Started](#getting-started)
    - [Fractions](#fractions)
    - [Expressions](#expressions)
        - [Add / Subtract](#expressions-add-subtract)
        - [Multiply](#expressions-multiply)
        - [Divide](#expressions-divide)
        - [Summation](#expressions-summation)
        - [Raise](#expressions-raise)
        - [Evaluate](#expressions-evaluate)
    - [Equations](#equations)
        - [Build an Equation](#equations-build)
        - [Solve Linear Equations](#equations-linear)
        - [Solve Quadratic Equations](#equations-quadratic)
        - [Solve Cubic Equations](#equations-cubic)
        - [Solve Quartic Equations](#equations-quartic)
        - [Solve Anything Else](#equations-anything-else)
- [LaTeX](#latex)
    - [Example](#latex-example)
    - [Greek Letters](#latex-greek-letters)

# <a name="usage"></a> Usage

## <a name="usage-right-now"></a> Right Now

You can follow along with the examples right now by executing the suggested keyboard shortcut for your browser and 
operating system. This will open the JavaScript Console in your browser.

<table>
    <thead>
        <tr>
            <th>Operating System</th>
            <th>Browser</th>
            <th>Keyboard Shortcut</th>
        </tr>
    </thead>
    
    <tbody>
        <tr>
            <td>OS X</td>
            <td>Chrome</td>
            <td>Cmd + Option + J</td>
        </tr>
        <tr>
            <td>OS X</td>
            <td>Firefox</td>
            <td>Cmd + Option + K</td>
        </tr>
        <tr>
            <td>Windows</td>
            <td>Chrome</td>
            <td>Ctrl + Shift + J</td>
        </tr>
        <tr>
            <td>Windows</td>
            <td>Firefox</td>
            <td>Ctrl + Shift + K</td>
        </tr>
    </tbody>
</table>


## <a name="usage-in-browser"></a> In the Browser

Download <a href="javascripts/algebra.min.js" download><u>`algebra.min.js`</u></a>.

```html
<script src="algebra.min.js"></script>
```

## <a name="usage-in-node"></a> In Node

```
$ npm install algebra.js
```

```js
var algebra = require('algebra.js');
```

# <a name="getting-started"></a> Getting Started 

The main objects available are Fraction, Expression, and Equation.

```js
var Fraction = algebra.Fraction;
var Expression = algebra.Expression;
var Equation = algebra.Equation;
```

## <a name="fractions"></a> Fractions 

Add, subtract, multiply, and divide fractions by either integers or other fractions. Fractions are automatically 
reduced.

```js
var frac = new Fraction(1, 2);
console.log(frac.toString());

frac = frac.add(new Fraction(3, 4));
console.log(frac.toString());

frac = frac.subtract(2);
console.log(frac.toString());

frac = frac.multiply(new Fraction(4, 3));
console.log(frac.toString());

frac = frac.divide(5);
console.log(frac.toString());
```

```
1/2
5/4
-3/4
-1
-1/5
```

## <a name="expressions"></a> Expressions 

Initialize expressions with a variable name. 

```js
var x = new Expression("x");
```

### <a name="expressions-add-subtract"></a> Add / Subtract

Add or subtract integers, fractions, variables, or other expressions to or from expressions.

```js
var x = new Expression("x");

x = x.add(3);
console.log(x.toString());

x = x.subtract(new Fraction(1, 3));
console.log(x.toString());

x = x.add("y");
console.log(x.toString());

var otherExp = new Expression("x").add(6);

x = x.add(otherExp);
console.log(x.toString());
```

```
x + 3
x + 8/3
x + y + 8/3
2x + y + 26/3
```

When adding / subtracting an expression to / from another expression, any like-terms will be combined.
Keep in mind the distributive property when subtracting expressions.

```js
var expr1 = new Expression("a").add("b").add("c");
var expr2 = new Expression("c").subtract("b");

var expr3 = expr1.subtract(expr2);

console.log(expr1.toString() + " - (" + expr2.toString() + ") = " + expr3.toString());
```

```
a + b + c - (c - b) = a + 2b
```

### <a name="expressions-multiply"></a> Multiply

Multiply expressions by integers, fractions, variables, or other expressions.

```js
var expr1 = new Expression("x");
expr1 = expr1.add(2);
expr1 = expr1.multiply(4);

var expr2 = new Expression("x");
expr2 = expr2.multiply("y");
expr2 = expr2.multiply(new Fraction(1, 3));
expr2 = expr2.add(4);

var expr3 = expr1.multiply(expr2);

console.log("(" + expr1.toString() + ")(" + expr2.toString() + ") = " + expr3.toString());
```

```
(4x + 8)(1/3xy + 4) = 4/3x^2y + 8/3xy + 16x + 32
```

### <a name="expressions-divide"></a> Divide

Divide expressions by either integers or fractions.

```js
var x = new Expression("x").divide(2).divide(new Fraction(1, 5));
console.log(x.toString());
```

```
5/2x
```

### <a name="expressions-summation"></a> Summation

Sum expressions over a particular variable and range with `Expression.summation(variable, lower, upper)`.

$$\sum\limits_{x=3}^6 (x + y + 3) = 4y + 30$$

```js
var exp = new Expression("x");
exp = exp.add("y");
exp = exp.add(3);

console.log(exp.toString());

var sum = exp.summation("x", 3, 6);

console.log(sum.toString());
```

```
x + y + 3
4y + 30
```

### <a name="expressions-raise"></a> Raise

Raise expressions to integer powers.

```js
var exp = new Expression("x").add(2);

var exp3 = exp.pow(3);

console.log("(" + exp.toString() + ")^3 = " + exp3.toString());
```

```
(x + 2)^3 = x^3 + 6x^2 + 12x + 8
```

### <a name="expressions-evaluate"></a> Evaluate

Evaluate expressions by substituting in fractions, integers, or other expressions for variables. Evaluating an expression for only some of its variables returns an expression object. Evaluating an expression for all of its variables returns a fraction object.

#### Integers and Fractions

```js
var expr = new Expression("x");
expr = expr.multiply(2);
expr = expr.multiply("x");
expr = expr.add("y");
expr = expr.add(new Fraction(1, 3));

console.log(expr.toString());

var answer1 = expr.eval({x: 2});
var answer2 = expr.eval({x: 2, y: new Fraction(3, 4)});

console.log(answer1.toString());
console.log(answer2.toString());
```

```
2x^2 + y + 1/3
y + 25/3
109/12
```

#### Other Expressions

```js
var expr = new Expression("x").add(2);

console.log(expr.toString());

var sub = new Expression("y").add(4);
var answer = expr.eval({x: sub});

console.log(answer.toString());
```

```
x + 2
y + 6
```

## <a name="equations"></a> Equations

### <a name="equations-build"></a> Build an Equation

Build an equation by setting an expression equal to another expression or to an integer or fraction.

```js
var z = new Expression("z");

var eq1 = new Equation(z.subtract(4).divide(9), z.add(6));
console.log(eq1.toString());

var eq2 = new Equation(z.add(4).multiply(9), 6);
console.log(eq2.toString());

var eq3 = new Equation(z.divide(2).multiply(7), new Fraction(1, 4));
console.log(eq3.toString());
```

```
1/9z - 4/9 = z + 6
9z + 36 = 6
7/2z = 1/4
```

### <a name="equations-linear"></a> Solve Linear Equations

#### One Variable

If a linear equation only has one variable, solving for that variable will return a fraction object.

```js
var x1 = new Expression("x");
x1 = x1.add(new Fraction(2, 3));
x1 = x1.divide(5);

var x2 = new Expression("x");
x2 = x2.divide(7);
x2 = x2.add(4);

var eq = new Equation(x1, x2);
console.log(eq.toString());

var answer = eq.solveFor("x");

console.log("x = " + answer.toString());
```

```
1/5x + 2/15 = 1/7x + 4
x = 203/3
```

#### Multiple Variables

If a linear equation has more than one variable, solving for a variable will return an expression.

```js
var expr1 = new Expression("x");
expr1 = expr1.add(5);
expr1 = expr1.divide(4);

var expr2 = new Expression("y");
expr2 = expr2.subtract(new Fraction(4, 5));
expr2 = expr2.multiply(3);

var eq = new Equation(expr1, expr2);

console.log(eq.toString());

var xAnswer = eq.solveFor("x");
var yAnswer = eq.solveFor("y");

console.log("x = " + xAnswer.toString());
console.log("y = " + yAnswer.toString());
```

```
1/4x + 5/4 = 3y - 12/5
x = 12y - 73/5
y = 1/12x + 73/60
```

### <a name="equations-quadratic"></a> Solve Quadratic Equations

An equation is quadratic if it can be arranged into the form

$$ax^2 + bx + c = 0$$

where $a \neq 0$.

A quadratic equation has at least one real root if its discriminant, $b^2 - 4ac$, is greater than or equal to 0.
Solving a quadratic equation with a discriminant that is greater than or equal to 0 returns an array of its real roots as either Fraction objects or numbers, 
depending on if the roots are rational or irrational, respectively. Solving a quadratic equation with a discriminant that is less than 0 will return an empty array.

```js
var n1 = new Expression("x").add(5);
var n2 = new Expression("x").subtract(new Fraction(3, 4));

var quad = new Equation(n1.multiply(n2), 0);

console.log(quad.toString());

var answers = quad.solveFor("x");

console.log("x = " + answers.toString());
```

```
x^2 + 17/4x - 15/4 = 0
x = -5,3/4
```

### <a name="equations-cubic"></a> Solve Cubic Equations

An equation is cubic if it can be arranged into the form

$$ax^3 + bx^2 + cx + d = 0$$

where $a \neq 0$.

All cubic equations have at least one real root. Solving a cubic equation returns an array of its real roots as either Fraction objects or numbers.

```js
var n1 = new Expression("x").add(2);
var n2 = new Expression("x").add(3);
var n3 = new Expression("x").add(4);

var cubic = new Equation(n1.multiply(n2).multiply(n3), 0);

console.log(cubic.toString());

var answers = cubic.solveFor("x");

console.log("x = " + answers.toString());
```

```
x^3 + 9x^2 + 26x + 24 = 0
x = -4,-3,-2
```

### <a name="equations-quartic"></a> Solve Quartic Equations

Coming soon.

### <a name="equations-anything-else"></a> Solve Anything Else

Equations will only be solved if there is an [algebraic solution](https://en.wikipedia.org/wiki/Algebraic_solution) or if the variable being solved for can be isolated through arithmetic operations. Attempting to solve an equation that does not fit these criteria returns `undefined`.
 
```js
var expr = new Expression("x");
expr = expr.multiply("x");
expr = expr.add("x");
expr = expr.add("y");

var eq = new Equation(expr, 3);

console.log(eq.toString());

var xAnswer = eq.solveFor("x");
var yAnswer = eq.solveFor("y");

console.log("x = " + xAnswer);
console.log("y = " + yAnswer.toString());
```

```
x^2 + x + y = 3
x = undefined
y = -x^2 - x + 3
```

# <a name="latex"></a> LaTeX

Make things pretty with LaTeX. All classes have a `.toTex()` method for rendering LaTeX. Combining this with
 [KaTeX](https://github.com/Khan/KaTeX), for example, is easy.

## <a name="latex-example"></a> Example

```html
<div id="myEquation"></div>
<div id="mySolution"></div>

<script>
var a = new Expression("x").pow(2);
var b = new Expression("x").multiply(new Fraction(5, 4));
var c = new Fraction(-21, 4);

var expr = a.add(b).add(c);

var quad = new Equation(expr, 0);
katex.render(quad.toTex(), myEquation);

var answers = quad.solveFor("x");
katex.render("x = " + answers.toTex(), mySolution);
</script>
```

<div id="myEquation"></div>
<div id="mySolution"></div>

<script>
var a = new Expression("x").pow(2);
var b = new Expression("x").multiply(new Fraction(5, 4));
var c = new Fraction(-21, 4);

var expr = a.add(b).add(c);

var quad = new Equation(expr, 0);
katex.render(quad.toTex(), myEquation);

var answers = quad.solveFor("x");
katex.render("x = " + answers.toTex(), mySolution);
</script>

## <a name="latex-greek-letters"></a> Greek Letters

Also supports Greek letters, obviously!

```html
<div>
    <div id="expr1"></div>
    <div id="expr2"></div>
</div>

<script>
var lambda = new Expression("lambda").add(3).divide(4);
var Phi = new Expression("Phi").subtract(new Fraction(1, 5)).add(lambda);

katex.render(lambda.toTex(), expr1);
katex.render(Phi.toTex(), expr2);
</script>
```

<div>
    <div id="expr1"></div>
    <div id="expr2"></div>
</div>

<script>
var lambda = new Expression("lambda").add(3).divide(4);
var Phi = new Expression("Phi").subtract(new Fraction(1, 5)).add(lambda);

katex.render(lambda.toTex(), expr1);
katex.render(Phi.toTex(), expr2);
</script>

Check out the [list of Greek letters available](https://www.sharelatex.com/learn/List_of_Greek_letters_and_math_symbols#Greek_letters).
