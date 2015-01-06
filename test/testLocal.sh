#!/bin/sh
echo '\nStarting local server...'
./node_modules/.bin/jsonplaceholder &
sleep 2
echo "Running nansen test..."
./node_modules/.bin/mocha -t 3000
echo "Stopping server..."
killall -2 node
echo "Done."