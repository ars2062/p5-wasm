INPUT_FILES = $(shell find . -name "*.cpp" -size +0b)

all:
	emcc $(INPUT_FILES) -o p5.js -O3 -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 --no-entry -s ENVIRONMENT="web" -s 'EXPORTED_FUNCTIONS=["_free", "_malloc"]' -s PRECISE_F32=1