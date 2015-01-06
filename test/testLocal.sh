#!/bin/sh

./node_modules/.bin/jsonplaceholder &
sleep 2
./node_modules/.bin/mocha -t 3000
killall -2 node