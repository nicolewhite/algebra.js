.PHONY: test

test:
	./node_modules/.bin/jasmine-node test

bundle:
	./node_modules/.bin/browserify algebra.js --standalone algebra > build/algebra.js

minify: bundle
	./node_modules/.bin/uglifyjs --mangle --beautify ascii_only=true,beautify=false build/algebra.js > build/algebra.min.js

sync: minify
	git checkout gh-pages
	cp build/algebra.min.js javascripts/algebra.min.js