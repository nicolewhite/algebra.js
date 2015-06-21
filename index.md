---
layout: default
---

<h1 align="center">Build an Equation</h1>

<div id="expressionDiv"></div>

<table>
    <tr>
        <td><button id="multiply">Multiply</button></td>
        <td><button id="divide">Divide</button></td>
        <td><button id="add">Add</button></td>
        <td><button id="subtract">Subtract</button></td>
    </tr>
    <tr>
        <td><input id="multiplyNum" type="number" placeholder="e.g. 2"></td>
        <td><input id="divideNum" type="number" placeholder="e.g. 2"></td>
        <td><input id="addNum" type="text" placeholder="e.g. 2, x"></td>
        <td><input id="subtractNum" type="text" placeholder="e.g. 2, x"></td>
    </tr>
</table>

<p align="center">Set equal to <input id="rhs" type="number" value="0"> and solve.

<div id="equationDiv"></div>
<div id="answersDiv"></div>

<script>
function render() {
    katex.render(e.toTex(), expressionDiv, {displayMode: true});
}

var x = new Expression("x");
var e = x.multiply(x);

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
        e = e.add(new Expression("x"));
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
        e = e.subtract(new Expression("x"));
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
    
    var solved = eq.solveFor("x");
    var answers = [];
    
    for (var i = 0; i < solved.length; i++) {
        answers.push(solved[i].toTex());
    }
    
    katex.render(eq.toTex(), equationDiv, {displayMode: true});
    katex.render("x = [" + answers.join(", ") + "]", answersDiv, {displayMode: true});
}

$("#rhs").on("input", function() {
    buildEquation();
});
</script>

# Contents

- [Usage](#usage)
    - [In Node](#usage-in-node)
    - [In the Browser](#usage-in-browser)
    - [Right Now](#usage-right-now)
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

## <a name="usage-in-node"></a> In Node

```
$ npm install algebra.js
```

```js
var algebra = require('algebra.js');
```

## <a name="usage-in-browser"></a> In the Browser

Download <a href="javascripts/algebra.min.js" download><u>`algebra.min.js`</u></a>.

```html
<script src="algebra.min.js"></script>
```

## <a name="usage-right-now"></a> Right Now

Chrome / OS X: Cmd + Option + J

Chrome / Windows: Ctrl + Shift + J

Firefox / OS X: Cmd + Option + K

Firefox / Windows: Ctrl + Shift + K

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
console.log(x.toString());
```

```
x
```

### <a name="expressions-add-subtract"></a> Add / Subtract

Add integers, fractions, or other expressions to expressions.

```js
var x = new Expression("x");

x = x.add(3);
console.log(x.toString());

x = x.subtract(new Fraction(1, 3));
console.log(x.toString());

x = x.add(new Expression("y"));
console.log(x.toString());
```

```
x + 3
x + 8/3
x + y + 8/3
```

When adding / subtracting an expression to / from another expression, any like-terms will be combined.

```js
var a = new Expression("a");
var b = new Expression("b");
var c = new Expression("c");

var expr1 = a.add(b).add(c);
var expr2 = c.subtract(b);

console.log(expr1.toString() + " + " + expr2.toString() + " = " + expr1.add(expr2).toString());
```

```
a + b + c + c - b = a + 2c
```

### <a name="expressions-multiply"></a> Multiply

Multiply expressions by integers, fractions, or other expressions.

```js
var x = new Expression("x");
var y = new Expression("y");

var expr1 = x.multiply(5).add(y);
var expr2 = y.add(x).multiply(new Fraction(1, 3));

console.log("(" + expr1.toString() + ")(" + expr2.toString() + ") = " + expr1.multiply(expr2).toString());
```

```
(5x + y)(1/3y + 1/3x) = 5/3x^2 + 1/3y^2 + 2xy
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
var x = new Expression("x");
var y = new Expression("y");

var expr = x.multiply(2).multiply(x).add(y).add(new Fraction(1, 3));

console.log("If x = 2, then " + expr.toString() + " = " + expr.evaluateAt({x:2}).toString());
console.log("If x = 2 and y = 3/4, then " + expr.toString() + " = " + expr.evaluateAt({x:2, y:new Fraction(3, 4)}).toString());
```

```
If x = 2, then 2x^2 + y + 1/3 = y + 25/3
If x = 2 and y = 3/4, then 2x^2 + y + 1/3 = 109/12
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
var x1 = new Expression("x").add(new Fraction(2, 3)).divide(5);
var x2 = new Expression("x").divide(7).add(4);

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
var x = new Expression("x");
var y = new Expression("y");

var eq = new Equation(x.add(5).divide(4), y.subtract(new Fraction(4, 5)).multiply(3));

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
var x = new Expression("x");

var eq = new Equation(x.multiply(x).add(x).subtract(2), 0);

console.log(eq.toString());

var answers = eq.solveFor("x");

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
<div id="tutorial"></div>

<script>
appendLatex = function(latex) {
    var div = document.getElementById("tutorial");
    var newDiv = document.createElement("div");
    div.appendChild(newDiv);
    katex.render(latex, newDiv, {displayMode: true});
}

appendText = function(text) {
    var div = document.getElementById("tutorial");
    var newDiv = document.createElement("div");
    div.appendChild(newDiv);
    newDiv.innerHTML = text;
}

var LETTER = "x";
var SLOPE1 = 3;
var SLOPE2 = 4;
var INTERCEPT1 = 5
var INTERCEPT2 = new Fraction(5, 7);

var expr1 = new Expression(LETTER).multiply(SLOPE1).add(INTERCEPT1);
var expr2 = new Expression(LETTER).multiply(SLOPE2).add(INTERCEPT2);

appendText("Let's say we have the equations of two lines:");
appendLatex("y = " + expr1.toTex());
appendLatex("y = " + expr2.toTex());

appendText("If we want to find where these two lines intersect, we need to solve for " + LETTER + ":");

var eq = new Equation(expr1, expr2);
appendLatex(eq.toTex());

var x = eq.solveFor(LETTER);
appendLatex(LETTER + " = " + x.toTex());

appendText("Now we need to plug " + x.toString() + " into one of the original expressions to find y:");

var y = expr1.evaluateAt({x: x});
appendLatex("y = " + y.toTex());

appendText("Thus, these lines intersect at the point:");
appendLatex("\\left(" + x.toTex() + "," + y.toTex() + "\\right)");
</script>
```

<div id="tutorial"></div>

<script>
appendLatex = function(latex) {
    var div = document.getElementById("tutorial");
    var newDiv = document.createElement("div");
    div.appendChild(newDiv);
    katex.render(latex, newDiv, {displayMode: true});
}

appendText = function(text) {
    var div = document.getElementById("tutorial");
    var newDiv = document.createElement("div");
    div.appendChild(newDiv);
    newDiv.innerHTML = text;
}

var LETTER = "x";
var SLOPE1 = 3;
var SLOPE2 = 4;
var INTERCEPT1 = 5
var INTERCEPT2 = new Fraction(5, 7);

var expr1 = new Expression(LETTER).multiply(SLOPE1).add(INTERCEPT1);
var expr2 = new Expression(LETTER).multiply(SLOPE2).add(INTERCEPT2);

appendText("Let's say we have the equations of two lines:");
appendLatex("y = " + expr1.toTex());
appendLatex("y = " + expr2.toTex());

appendText("If we want to find where these two lines intersect, we need to solve for " + LETTER + ":");

var eq = new Equation(expr1, expr2);
appendLatex(eq.toTex());

var x = eq.solveFor(LETTER);
appendLatex(LETTER + " = " + x.toTex());

appendText("Now we need to plug " + x.toString() + " into one of the original expressions to find y:");

var y = expr1.evaluateAt({x: x});
appendLatex("y = " + y.toTex());

appendText("Thus, these lines intersect at the point:");
appendLatex("\\left(" + x.toTex() + "," + y.toTex() + "\\right)");
</script>

## <a name="latex-greek-letters"></a> Greek Letters

Also supports Greek letters, obviously!

```html
<div>
    <div id="div1"></div>
    <div id="div2"></div>
</div>

<script>
var lambda = new Expression("lambda").add(3).divide(4);
var Phi = new Expression("Phi").subtract(new Fraction(1, 5)).add(lambda);

katex.render(lambda.toTex(), div1);
katex.render(Phi.toTex(), div2);
</script>
```

<div>
    <div id="div1"></div>
    <div id="div2"></div>
</div>

<script>
var lambda = new Expression("lambda").add(3).divide(4);
var Phi = new Expression("Phi").subtract(new Fraction(1, 5)).add(lambda);

katex.render(lambda.toTex(), div1);
katex.render(Phi.toTex(), div2);
</script>

See [here](https://www.sharelatex.com/learn/List_of_Greek_letters_and_math_symbols#Greek_letters) for a full list of 
all the Greek letters available.
