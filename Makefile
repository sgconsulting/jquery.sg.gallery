TEST_DIR = test

VSN = 0.0.1

TOLINT = lib/*.js

.PHONY: all

all: build

build: build.foo

build.foo: 
	rm build/*.*; \
	cat license_header.txt                           > build/jquery.sg.gallery-$(VSN).js.txt; \
	echo "var sg_gallery={version: '$(VSN)'};"        >> build/jquery.sg.gallery-$(VSN).js.txt; \
	python tools/jsmin.py < lib/jquery.sg.gallery.js  >> build/jquery.sg.gallery-$(VSN).js.txt;

lint: ${TOLINT}

lib/%.js: lint.foo
	rhino tools/jslint.js $@

lint.foo:
	echo "Running lint...";

clean: 
	rm build/*.*;