# algebra.js 

[![Build Status](https://travis-ci.org/nicolewhite/algebra.js.svg?branch=master)](https://travis-ci.org/nicolewhite/algebra.js) 
[![Coverage Status](https://coveralls.io/repos/nicolewhite/algebra.js/badge.svg?branch=master)](https://coveralls.io/r/nicolewhite/algebra.js?branch=master)
[![npm version](https://badge.fury.io/js/algebra.js.svg)](http://badge.fury.io/js/algebra.js)

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

[Read more at the project site](http://algebra.js.org).