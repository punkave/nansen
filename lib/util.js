var colors = require('colors');

var util = {

	// Options
	verbose:    false,
	debug:      false,

	// Print
	line:       '-----------------------------------',
	dashed:     '- - - - - - - - - - - - - - - - - -'
};


// Logging ---------------------------- //

util.print = function(s, c) {
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
	util.print(s, 'green');
}

util.error = function(s) {
	console.log(' ');
	util.print(s, 'red');
}

util.debug = function(s) {
	var self = this;

	if (self.debug) {
		util.print(s, 'blue');
	}
}

util.gray = function(s) {
	util.print(s, 'gray');
}
// jobs
util.jLog = function(s) {
	var self = this;

	if (self.verbose) {
		util.print(s, 'yellow');
	}
}
// tasks
util.tLog = function(s) {
	var self = this;

	if (self.verbose) {
		util.print(s, 'cyan');
	}
}


module.exports = util;
