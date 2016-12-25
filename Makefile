.PHONY: test

$(info version is $(PACKAGE_VERSION))

test:
	./node_modules/.bin/jasmine-node test

bundle:
	./node_modules/.bin/browserify algebra.js --standalone algebra > build/algebra-$(PACKAGE_VERSION).js

minify: bundle
	./node_modules/.bin/uglifyjs --mangle --beautify ascii_only=true,beautify=false build/algebra-$(PACKAGE_VERSION).js > build/algebra-$(PACKAGE_VERSION).min.js

sync: minify
	git checkout gh-pages
	cp build/*.min.js javascripts

coveralls:
	./node_modules/.bin/istanbul cover ./node_modules/.bin/jasmine-node --captureExceptions test && \
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage

lint:
	./node_modules/jshint/bin/jshint algebra.js src/*.js test/*.js
