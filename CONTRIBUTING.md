# Contributing

## Dependencies

* [git](https://git-scm.com/downloads)
* [node](https://nodejs.org/download/)

## Fork the Repository

Fork the repository with the "Fork" button on GitHub.

![fork](http://i.imgur.com/fsJeKPy.png)

## Clone the Repository

Clone your fork.

```
$ git clone https://github.com/yourusername/algebra.js.git
```

## Install Dependencies

```
$ cd algebra.js
$ npm install
```

This will create a `node_modules` directory in the current working directory.

## Run Tests

```
$ make test
```

## Add Tests

Tests are written in [Jasmine](http://jasmine.github.io/edge/introduction.html). The test files are located in the `test` directory. If your tests fit into one of the current test file categories, just go ahead and add them there. Otherwise, you can create a new test file. It has to end in `-spec.js`.

## Contribute Code

### New Features

If you're adding something completely new, it's probably best if you first [create an issue](https://github.com/nicolewhite/algebra.js/issues) to describe the feature you want to add so that it can be discussed. 

### Bug Fixes

If you're just fixing a bug or making a patch change, no need to create an issue; just jump straight to the pull request.

### Project Page

The documentation for this project is maintained at http://algebra.js.org. You can edit this page by checking out the `gh-pages` branch.

```
$ git checkout gh-pages
```

You can then edit the project page in `index.md`.

## Commit Your Changes

Commit your changes with a descriptive commit message. Ideally, include an example of what you fixed or added. [This](https://github.com/nicolewhite/algebra.js/commit/3d9b1dbab5d984a270db536378f09519d5df5c8c) is a good example.

```
$ git commit
```

## Push Your Changes

Push your changes to your fork.

```
$ git push
```

## Pull Request

Go to your fork on GitHub. You'll see a "Pull Request" button.

![pr](http://i.imgur.com/3QjkSMP.png)

Write a description of what you did and submit!

