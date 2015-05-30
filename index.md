---
layout: default
---

# Inspiration
I was completing the Intersecting Lines challenge on [CoderByte](http://coderbyte.com/). This challenge isn't timed, 
so I got a little carried away. I ended up making classes for Point, Line, and Fraction, where the latter was necessary 
because the final answer needed to be a fraction and not a decimal. The Line class had a method for finding its 
intersection with another Line; the Fraction class had methods for adding, subtracting, multiplying, and dividing other 
Fractions; and so on.

Long story short, I had a lot of fun writing that code so I decided to extend it a bit into a library called algebra.js.

# Basics
Numbers need to be either a fraction or an integer. Currently, only linear expressions and equations are supported. 
The main classes available are Fraction, Expression, and Equation.

```js
var Fraction = algebra.Fraction;
var Expression = algebra.Expression;
var Equation = algebra.Equation;
```

## Fractions

Add, subtract, multiply, and divide fractions by either integers or other fractions.

```js
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

```js
var x = new Expression("x");
x = x.add(5);
x = x.divide(4);

console.log(x.print());

var y = new Expression("y");
y = y.subtract(new Fraction(4, 5));
y = y.multiply(3);

console.log(y.print());

x = x.add(y)
console.log(x.print())
```

```
1/4x + 5/4
3y - 12/5
1/4x + 3y - 23/20
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

# LaTeX

Make things pretty with LaTeX. All classes have a `.tex()` method for rendering LaTeX. Combining this with
 [KaTeX](https://github.com/Khan/KaTeX), for example, is easy.

## Tutorial-Like Example

```html
<div id="latex"></div>

<script>
appendLatex = function(latex) {
    var div = document.getElementById("latex");
    var newDiv = document.createElement("div");
    div.appendChild(newDiv);
    katex.render(latex, newDiv);
}

appendText = function(text) {
    var div = document.getElementById("latex");
    var newDiv = document.createElement("div");
    div.appendChild(newDiv);
    newDiv.innerHTML = text;
}

var letter = "x";
var n1 = 3;
var n2 = 4;
var n3 = new Fraction(5, 7);

var expr = new Expression(letter);

appendText("Let's start with an expression of a single variable " + letter + ":");
appendLatex(expr.tex());

appendText("Now let's add " + n1 + " to this expression:");
expr = expr.add(n1);
appendLatex(expr.tex());

appendText("Now let's divide this expression by " + n2 + ":");
expr = expr.divide(n2);
appendLatex(expr.tex());

appendText("If we set this expression equal to " + n3.print() + "...");
var eq = new Equation(expr, n3);
appendLatex(eq.tex());

appendText("...we can solve for " + letter + ":");
appendLatex(letter + " = " + eq.solveFor(letter).tex());
</script>
```

<div id="latex"></div>

<script>
appendLatex = function(latex) {
    var div = document.getElementById("latex");
    var newDiv = document.createElement("div");
    div.appendChild(newDiv);
    katex.render(latex, newDiv);
}

appendText = function(text) {
    var div = document.getElementById("latex");
    var newDiv = document.createElement("div");
    div.appendChild(newDiv);
    newDiv.innerHTML = text;
}

var letter = "x";
var n1 = 3;
var n2 = 4;
var n3 = new Fraction(5, 7);

var expr = new Expression(letter);

appendText("Let's start with an expression of a single variable " + letter + ":");
appendLatex(expr.tex());

appendText("Now let's add " + n1 + " to this expression:");
expr = expr.add(n1);
appendLatex(expr.tex());

appendText("Now let's divide this expression by " + n2 + ":");
expr = expr.divide(n2);
appendLatex(expr.tex());

appendText("If we set this expression equal to " + n3.print() + "...");
var eq = new Equation(expr, n3);
appendLatex(eq.tex());

appendText("...we can solve for " + letter + ":");
appendLatex(letter + " = " + eq.solveFor(letter).tex());
</script>

## Greek Letters

Also supports Greek letters, obviously!

```html
<div>
    <div id="lambda"></div>
    <div id="Phi"></div>
</div>

<script>
var div1 = document.getElementById("lambda");
var div2 = document.getElementById("Phi");

var lambda = new Expression("lambda").add(3).divide(4);
var Phi = new Expression("Phi").subtract(new Fraction(1, 5)).add(lambda);

katex.render(lambda.tex(), div1);
katex.render(Phi.tex(), div2);
</script>
```

<div>
    <div id="lambda"></div>
    <div id="Phi"></div>
</div>

<script>
var div1 = document.getElementById("lambda");
var div2 = document.getElementById("Phi");

var lambda = new Expression("lambda").add(3).divide(4);
var Phi = new Expression("Phi").subtract(new Fraction(1, 5)).add(lambda);

katex.render(lambda.tex(), div1);
katex.render(Phi.tex(), div2);
</script>

<br>
See [here](https://www.sharelatex.com/learn/List_of_Greek_letters_and_math_symbols#Greek_letters) for a full list of 
all the Greek letters available.
