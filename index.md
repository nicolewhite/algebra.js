---
layout: default
---

<h1>Build a Quadratic Equation</h1>

This is a short example of something you can create using `algebra.js`. First, let's build an expression!
Manipulate the expression with the buttons below while altering the input values.

<div id="expression"></div>

<table>
    <tr>
        <td><button id="multiply">Multiply</button></td>
        <td><button id="divide">Divide</button></td>
        <td><button id="add">Add</button></td>
        <td><button id="subtract">Subtract</button></td>
    </tr>
    <tr>
        <td><input id="multiplyNum" type="number" value="2"></td>
        <td><input id="divideNum" type="number" value="3"></td>
        <td><input id="addNum" type="text" value="x"></td>
        <td><input id="subtractNum" type="text" value="4"></td>
    </tr>
</table>

<p>Now let's set our expression equal to <input id="rhs" type="number" value="0"> and solve for `x`.

<div id="equation"></div>
<div id="answers"></div>

<script>
function render() {
    katex.render(e.toTex(), expression, {displayMode: true});
}

var x = new Expression("x");
var e = x.multiply(x).add(x).subtract(2);

render();
buildEquation();

$("#multiply").on("click", function() {
    var int = parseInt($("#multiplyNum").val());
    e = e.multiply(int);
    render();
    buildEquation();
});

$("#divide").on("click", function() {
    var int = parseInt($("#divideNum").val());
    e = e.divide(int);
    render();
    buildEquation();
});

$("#add").on("click", function() {
    var val = $("#addNum").val();
    
    if (val === "x") {
        e = e.add(val);
    } else {
        var int = parseInt(val);
        e = e.add(int);
    }
    
    render();
    buildEquation();
});

$("#subtract").on("click", function() {
    var val = $("#subtractNum").val();
    
    if (val === "x") {
        e = e.subtract(val);
    } else {
        var int = parseInt(val);
        e = e.subtract(int);
    }
    
    render();
    buildEquation();
});

function buildEquation() {
    var rhs = parseInt($("#rhs").val());
    var eq = new Equation(e, rhs);
    
    var answer = eq.solveFor("x");
    
    katex.render(eq.toTex(), equation, {displayMode: true});
    katex.render("x = " + answer.toTex(), answers, {displayMode: true});
}

$("#rhs").on("input", function() {
    buildEquation();
});
</script>

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
        - [Evaluate](#expressions-evaluate)
    - [Equations](#equations)
        - [Build an Equation](#equations-build)
        - [Solving Linear Equations](#equations-linear)
            - [Linear Equations with One Variable](#equations-linear-one-variable)
            - [Linear Equations with Multiple Variables](#equations-linear-multiple-variables)
        - [Solving Quadratic Equations](#equations-quadratic)
        - [Solving Cubic Equations](#equations-cubic)
- [LaTeX](#latex)
    - [Tutorial-Like Example](#latex-tutorial-like-example)
    - [Greek Letters](#latex-greek-letters)

# <a name="usage"></a> Usage

## <a name="usage-right-now"></a> Right Now

Chrome / OS X: Cmd + Option + J

Chrome / Windows: Ctrl + Shift + J

Firefox / OS X: Cmd + Option + K

Firefox / Windows: Ctrl + Shift + K

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

Add, subtract, multiply, and divide fractions by either integers or other fractions. Fractions are not automatically 
reduced.

```js
var frac = new Fraction(1, 2);
console.log(frac.toString());

frac = frac.add(new Fraction(3, 4));
console.log(frac.toString());

frac = frac.subtract(5);
console.log(frac.toString());

frac = frac.multiply(new Fraction(6, 7));
console.log(frac.toString());

frac = frac.divide(5);
console.log(frac.toString());

frac = frac.reduce();
console.log(frac.toString());
```

```
1/2
5/4
-15/4
-90/28
-90/140
-9/14
```

## <a name="expressions"></a> Expressions 

Initialize expressions with a variable name. 

```js
var x = new Expression("x");
```

### <a name="expressions-add-subtract"></a> Add / Subtract

Add integers, fractions, variables, or other expressions to expressions.

```js
var x = new Expression("x");

x = x.add(3);
console.log(x.toString());

x = x.subtract(new Fraction(1, 3));
console.log(x.toString());

x = x.add("y");
console.log(x.toString());

var otherExp = new Expression("z").add(6);

x = x.add(otherExp);
console.log(x.toString());
```

```
x + 3
x + 8/3
x + y + 8/3
x + y + z + 26/3
```

When adding / subtracting an expression to / from another expression, any like-terms will be combined.

```js
var expr1 = new Expression("a").add("b").add("c");
var expr2 = new Expression("c").subtract("b");
var expr3 = expr1.subtract(expr2);

console.log(expr1.toString());
console.log(expr2.toString());
console.log(expr3.toString());
```

```
a + b + c
c - b
a + 2b
```

### <a name="expressions-multiply"></a> Multiply

Multiply expressions by integers, fractions, variables, or other expressions.

```js
var expr1 = new Expression("x");
expr1 = expr1.multiply(4);
expr1 = expr1.add(6);

var expr2 = new Expression("x");
expr2 = expr2.multiply(new Fraction(1, 3));
expr2 = expr2.multiply("y");

var expr3 = expr1.multiply(expr2);

console.log(expr1.toString());
console.log(expr2.toString());
console.log(expr3.toString());
```

```
4x + 6
1/3xy
4/3x^2y + 2xy
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

### <a name="expressions-evaluate"></a> Evaluate

Evaluate expressions by substituting in fractions or integers for variables. Evaluating for only some of its variables returns an expression object. Evaluating an expression for all of its variables returns a reduced fraction object.

```js
var expr = new Expression("x");
expr = expr.multiply(2);
expr = expr.multiply("x");
expr = expr.add("y");
expr = expr.add(new Fraction(1, 3));

var xSub = 2;
var ySub = new Fraction(3, 4);

var answer1 = expr.evaluateAt({x: xSub});
var answer2 = expr.evaluateAt({x: xSub, y: ySub});

console.log(expr.toString());
console.log(answer1.toString());
console.log(answer2.toString());
```

```
2x^2 + y + 1/3
y + 25/3
109/12
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

### <a name="equations-linear"></a> Solving Linear Equations

#### <a name="equations-linear-one-variable"></a> Linear Equations with One Variable

If a linear equation only has one variable, solving for that variable will return a reduced fraction object.

```js
var x1 = new Expression("x");
x1 = x.add(new Fraction(2, 3));
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

#### <a name="equations-linear-multiple-variables"></a> Linear Equations with Multiple Variable

If a linear equation contains more than one variable, solving for a variable will return an expression.

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

### <a name="equations-quadratic"></a> Solving Quadratic Equations

An equation is quadratic if it can be arranged into the form

<div id="quadratic"></div>

where <span id="aNot0"></span>.

A quadratic equation has at least one real root if its discriminant, <span id="discriminant"></span>, is greater than or equal to 0. 
Solving a quadratic equation with a discriminant that is greater than or equal to 0 returns an array of its real roots as either Fraction or Number objects, 
depending on if the roots are rational or irrational, respectively. Solving a quadratic equation with a discriminant that is less than 0 will return an empty array.

<script>
katex.render("ax^2 + bx + c = 0", quadratic, {displayMode: true});
katex.render("a \\neq 0", aNot0);
katex.render("b^2 - 4ac", discriminant);
</script>

```js
var expr = new Expression("x").multiply("x").add("x").subtract(2);

var quad = new Equation(expr, 0);

console.log(quad.toString());

var answers = quad.solveFor("x");

console.log("x = " + answers.toString());
```

```
x^2 + x - 2 = 0
x = -2,1
```

### <a name="equations-cubic"></a> Solving Cubic Equations

Coming soon.

# <a name="latex"></a> LaTeX

Make things pretty with LaTeX. All classes have a `.toTex()` method for rendering LaTeX. Combining this with
 [KaTeX](https://github.com/Khan/KaTeX), for example, is easy.

## <a name="latex-tutorial-like-example"></a> Tutorial-Like Example

```html
<div id="myEquation"></div>
<div id="mySolution"></div>

<script>
var expr = new Expression("x");
expr = expr.add("x");
expr = expr.subtract(2);

var eq = new Equation(expr, new Fraction(1, 3));
katex.render(eq.toTex(), myEquation);

var x = eq.solveFor("x");
katex.render("x = " + x.toTex(), mySolution);
</script>
```

<div id="myEquation"></div>
<div id="mySolution"></div>

<script>
var expr = new Expression("x");
expr = expr.add("x");
expr = expr.subtract(2);

var eq = new Equation(expr, new Fraction(1, 3));
katex.render(eq.toTex(), myEquation);

var x = eq.solveFor("x");
katex.render("x = " + x.toTex(), mySolution);
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

See [here](https://www.sharelatex.com/learn/List_of_Greek_letters_and_math_symbols#Greek_letters) for a full list of 
all the Greek letters available.
