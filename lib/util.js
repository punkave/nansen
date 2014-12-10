var colors = require('colors');

var util = {};
module.exports = util;


// Logging ---------------------------- //

util.log = function(s, c) {
	if (s === null) {
		console.log("NULL".red);
	} else if (s === undefined)  {
		console.log("UNDEFINED".red);
	} else if (typeof(s) === 'object') {
		console.log(JSON.stringify(s)[c]);
	}	else {
		console.log(s[c]);
	}
}

util.success = function(s) {
	console.log(' ');
	util.log(s, 'green');
}

util.error = function(s) {
	console.log(' ');
	util.log(s, 'red');
}

util.debug = function(s) {
	util.log(s, 'blue');
}
// jobs
util.jLog = function(s) {
	util.log(s, 'yellow');
}
// tasks
util.tLog = function(s) {
	util.log(s, 'cyan');
}
