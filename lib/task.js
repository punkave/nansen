var request = require('request'),
	async = require('async');

function Task (options) {
	var self = this;
	self.options = options;

	return self;
}


Task.prototype.request = function(options, callback) {

	console.log("* in taskRequest");

	if (typeof(options.request === 'object')) {

		request(options.request, function(err, response, body){

			if (err) {
				console.log("TASK REQUEST ERROR: " + err);
			} else {
				console.log('TASK REQUEST BODY: ');
				console.log(body);
			}

			return callback(err, body, options);
		});
	}
}

Task.prototype.errors = function(data, options, callback) {
	console.log("* in errors");

	return callback(null, data, options);
}

Task.prototype.validate = function(data, options, callback) {
	console.log("* in validate");

	// Validate JSON
    try {
        JSON.parse(data);
    } catch (e) {
        callback(e);
    }

	return callback(null, data, options);
}

Task.prototype.complete = function(data, options, callback) {
	console.log("* in complete");

	return callback(null, data);
}


Task.prototype.run = function(callback){
	var self = this;

	return async.waterfall([ 

			// 1.  Request
			function(callback){
				self.request(self.options, callback);
			},

			// 2.  Errors
			function(data, options, callback) {
				self.errors(data, options, callback);
			},

			// 3.  Validate
			function(data, options, callback) {
				self.validate(data, options, callback);
			},

			// 4.  Complete
			function(data, options, callback) {
				self.complete(data, options, callback);
			}
			
		], 

		function(err, results){
			if (err) {
				callback(err);
			} else {
				callback(null);
			}
		});
}

module.exports = Task;