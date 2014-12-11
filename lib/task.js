var request = require('request'),
	async = require('async'),
	util = require('./util');

function Task (options, id) {
	var self = this;
	self._id = id;
	self.options = options;

	return self;
}


Task.prototype.request = function(data, options, callback) {
	var self = this;

	// Function - Run it and pass result to request module
	if (typeof(options.request) === 'function') {

		options.request(data, function(err, reqOpts) {
			if (err) { 
				util.error(err) 
				callback(null, null, options);
			}
			self.doRequest(reqOpts, options, callback);
		});	
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
			util.error(self._id + " : Request Task Error : " + err);
		} else {
			util.tLog(body);
		}
		callback(err, body, options);
	});
}

Task.prototype.errors = function(data, options, callback) {

	callback(null, data, options);
}

Task.prototype.validate = function(data, options, callback) {

	// Function
	if (typeof(options.validate) === 'function') {

		options.validate(data, function(err, newData) {
			callback(err, data, options);
		});

	// Array of response formats to validate
	} else if (Object.prototype.toString.call( options.validate ) === '[object Array]' ){

		async.eachSeries(options.validate, function(format, callback) {

			switch(format.toLowerCase()) {
				case 'json':
					try {
				        JSON.parse(data);
				        break;
				    } catch (e) {
				        callback(e);
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
	if (typeof(options.complete) === 'function') {

		options.complete(data, callback);

	// No completion task, send the data along. 
	} else  {
		callback(null, data);
	}
}


Task.prototype.run = function(data, callback){
	var self = this;

	// util.debug(self._id + " : data : ");
	// util.debug(data);

	async.waterfall([ 

			// 1.  Request
			function(callback){
				self.request(data, self.options, callback);
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

		function(err, results){
			if (err) {
				callback(err);
			} else {
				callback(null, results);
			}
	});
}

module.exports = Task;