.PHONY: test

test:
	./node_modules/.bin/jasmine-node test

bundle:
	./node_modules/.bin/browserify algebra.js --standalone algebra > bundle.js

sync:
	git checkout gh-pages