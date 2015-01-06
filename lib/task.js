var request = require('request'),
	async = require('async'),
	util = require('./util');


// ---------------------------------------------------------------- //
//   TASK  -------------------------------------------------------- //	
//      
//
//   A task is initiated for the SETUP request and for each item's 
//   GET and POST.  Every task has the same sequential execution 
//   of the following methods:
//
//     -  request
//     -  errors
//     -  validate
//     -  complete
//
//   See README.md for more information on each method.


function Task (options, i) {
	var self = this;
	self.options = options;
	self.i = i;

	return self;
}

Task.prototype.request = function(item, data, options, callback) {
	var self = this;

	// task.request(data, options, callback)
	if (callback === undefined) { return self.request(null, item, data, options) }

	// Function - Run it and pass result to request module
	if (typeof(options.request) === 'function') {

		var cb = function(err, reqOpts) {
			// Null item support
			if (reqOpts === undefined || reqOpts === null) {
				util.dLog('Item discarded');
				callback(true);
			} else if (err) {
				callback(err);
			} else {
				self.doRequest(reqOpts, options, callback);
			}
		}	

		// Support (response, callback) & (item, response, callback) 
		// request functions.  Typically used for Post method.
		if (options.request.length === 2) { options.request(data, cb) }
		else if (options.request.length === 3) { options.request(item, data, cb) }
	}

	// Options object - pass it to request module
	else if (typeof(options.request === 'object')) {

		self.doRequest(options.request, options, callback);
	}
}

Task.prototype.doRequest = function(reqOpts, options, callback) {
	var self = this;

	request(reqOpts, function(err, response, body){
		if (err) {
			// Check if we're in the 'setup' phase.  If we are,
			// end the job.  If we're in the 'get' phase, fail the item
			// but keep the job going.
			if (self.i == 0){
				util.error('\nERROR: Request failure in setup phase: \n\t' + err + '\n');
				return callback(err);
			} else {
				util.error('\nERROR: Request failure for item #' + self.index + '\n\t' + err + '\n');
			    return callback(true);
			}
			
		} else {
			util.dLog(body);
		}
		callback(null, body, options);
	});
}

Task.prototype.errors = function(data, options, callback) {
	// TODO!

	callback(null, data, options);
}

Task.prototype.validate = function(data, options, callback) {
	var self = this;

	// Function
	if (options && typeof(options.validate) === 'function') {

		options.validate(data, function(err, newData) {
			if (err) {
				util.error("\nERROR: Validation failure for item #" + self.index + '\n\t' + err + '\n');
				callback(true);
			} else {
				callback(null, data, options);
			}
		});

	// Array of response formats to validate
	} else if (options && Object.prototype.toString.call( options.validate ) === '[object Array]'){

	async.eachSeries(options.validate, function(format, callback) {

			switch(format.toLowerCase()) {
				case 'json':
					try {
				        JSON.parse(data);
				        break;
				    } catch (e) {
				        util.error("ERROR: Unable to validate JSON response from Item: " + self.index);
				        callback(true);
				        break;
				    }
				default:
					util.error("WARNING: '" + format + "' does not have validation support in nansen.  Please provide a function for your validation instead.");
			}
			callback(null);

		}, function(err){
			callback(err, data, options);
		});
	    
		
	} else {
		// No validation - pass it along
		callback(null, data, options);
	}
	
}

Task.prototype.complete = function(data, options, callback) {

	// Function
	if (options && typeof(options.complete) === 'function') {

		options.complete(data, callback);

	// No completion task, send the data along. 
	} else  {
		callback(null, data);
	}
}

Task.prototype.run = function(item, data, callback){
	var self = this;

	if (item) self.index = item._index || '';

	// task.run(data, callback)
	if (callback === undefined) { return self.run(null, item, data); }

	async.waterfall([ 

			// 1.  Request
			function(callback){
				self.request(item, data, self.options, callback);
			},

			// 2.  Errors
			function(results, options, callback) {
				self.errors(results, options, callback);
			},

			// 3.  Validate
			function(results, options, callback) {
				self.validate(results, options, callback);
			},

			// 4.  Complete
			function(results, options, callback) {
				self.complete(results, options, callback);
			}
			
		], 

		function (err, results){	
			if (err) {
				callback(err);
			} else {
				callback(null, results);
			}
	});
}

module.exports = Task;