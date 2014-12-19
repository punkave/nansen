var colors = require('colors'),
	ProgressBar = require('progress');

var util = {

	// Options
	verbose:    false,
	debug:      false,
	progress:   false,

	// Print
	line:       '-------------------------------------------',
	dashed:     '- - - - - - - - - - - - - - - - - - - - - -'
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
	util.print(s, 'red');
}

// debug
util.dLog = function(s) {
	var self = this;

	if (self.debug) {
		util.print(s, 'blue');
	}
}

util.gray = function(s) {
	var self = this;

	if (self.verbose) {
		util.print(s, 'gray');
	}
}
// jobs
util.jLog = function(s, force) {
	var self = this;

	if (self.verbose || force) {
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

util.std = function(s) {
	var self = this;

	if (self.progress) {
		process.stdout.cursorTo(0);
		process.stdout.clearLine();
		process.stdout.write(s);
	}
}

util.progressBar = function(itemCount) {
	var self = this;

	self.bar = new ProgressBar('[:bar] :current/:total :etas', {
	    complete: '=',
	    incomplete: ' ',
	    width: 30,
	    total: itemCount
    });
}


module.exports = util;
