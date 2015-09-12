# algebra.js 

[![Build Status](https://travis-ci.org/nicolewhite/algebra.js.svg?branch=master)](https://travis-ci.org/nicolewhite/algebra.js)
[![Coverage Status](https://coveralls.io/repos/nicolewhite/algebra.js/badge.svg?branch=master)](https://coveralls.io/r/nicolewhite/algebra.js?branch=master)
[![npm version](https://badge.fury.io/js/algebra.js.svg)](http://badge.fury.io/js/algebra.js)
[![Join the chat at https://gitter.im/nicolewhite/algebra.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/nicolewhite/algebra.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Quick Start

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

[Read the full documentation at the project site](http://algebra.js.org).

## Install

### Stable Release

#### In Node

```
npm install algebra.js
```

#### In the Browser

Download [algebra.min.js](http://algebra.js.org/javascripts/algebra.min.js).

### Latest Development Release

```
git clone https://github.com/nicolewhite/algebra.js.git
cd algebra.js
```

#### In Node

```js
var algebra = require("./algebra");
```

#### In the Browser

The following will build `algebra.js` in the `build` directory.

```
make bundle
```

The following will build `algebra.min.js` in the `build` directory.

```
make minify
```
