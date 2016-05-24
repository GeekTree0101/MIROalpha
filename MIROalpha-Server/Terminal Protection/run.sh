#!/bin/bash

# Install packages
#npm install #halt

# Install typings
#./node_modules/.bin/tsd reinstall -so
/home/snck/MIROalpha/node_modules/.bin/tsd reinstall -so

# Transpile
#./node_modules/.bin/tsc --sourcemap --module commonjs ./bin/www.ts
/home/snck/MIROalpha/node_modules/.bin/tsc --sourcemap --module commonjs /home/snck/MIROalpha/bin/www.ts
#DEBUG=Express-4x-Typescript-Sample:* ./bin/www
DEBUG=Express-4x-Typescript-Sample:* /home/snck/MIROalpha/bin/www
