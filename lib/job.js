var Task = require('./task'),
	util = require('./util'), 
	async = require('async'),
	moment = require('moment');


// ---------------------------------------------------------------- //
//   JOB  --------------------------------------------------------- //	
//      
//
// - Jobs require a Setup, Get, and Post method.
//
// - SETUP: Retreive initial data for subsequent 
//   Get and Post methods.  Must pass an array of items
//   or an object containing "items" which is an array 
//   of items.  For each item, Get and Post are run.
//
// - GET: Retreive data from a specific device.
//
// - POST: Post data returned from Get.


function Job(options) {
	var self = this;

	self.name = options.name;
	self.options = options;

	self.enforceSchema();
	self.configureLogging();

	self.addTasks([self.options.setup, self.options.get, self.options.post]);
}


Job.prototype.run = function(callback) {
	var self = this;

	util.jLog(util.line, true);
	util.jLog("\tNew Job:  " + self.name, true);
	util.jLog(util.line, true);

	// Stats
	var successfulItems = 0,
		totalItems = 0,
		startTime = moment();

	// ------------------------------------- //	
	// Main Process                          //
	// ------------------------------------- //	
	async.waterfall([

		// 1.  Setup
		function(callback){
			util.jLog('\t1.  Setup');
			self.tasks[0].run(null, callback);
		},

		// 1b.  Get + Post for each item
		function(data, callback) {
			var items;

			// Array of items
			if (Object.prototype.toString.call(data) === '[object Array]') {
				items = data;
			// Object containing "items"
			} else if (data.items && Object.prototype.toString.call(data.items) === '[object Array]') {
				items = data.items;
			} else {
				callback("Unable to locate 'items' from Setup response");
			}

			totalItems = items.length;
			if (!self.options.debug && !self.options.verbose) util.progressBar(totalItems);

			async.eachLimit(items, (self.options.parallel) ? self.options.parallel : 1, function(item, callback) {
				
				async.waterfall([

					// 2.  Get - each item
					function(callback) {
						util.jLog('\t2.  Get ' + (items.indexOf(item) + 1));
						self.tasks[1].run(item, callback);
					},

					// 3.  Post for each item
					function(response, callback) {

						util.jLog('\t3.  Post ' + (items.indexOf(item) + 1));
						self.tasks[2].run(item, response, callback);
					}],

					function(err, response) {
						if (util.bar) util.bar.tick();
						// For null items, we return err = 'true' and continue 
						// the series loop.
						if (err === true) {
							callback(null);
						} else if (err) {
							callback(err);
						} else {
							successfulItems++;
							callback(null);
						}
					});

			}, function(err){
				if (err) {
					callback(err);
				}
				callback(null);
			});
		}]

		,function(err, data){

			if (err) {
				callback((self.name).yellow + ' : ' + (err).red);
			} else {
				// Success log
				util.success('\n' + (self.name + ' Results').yellow.underline);
				util.success('  -  ' + successfulItems + ' of ' + totalItems + ' items successful.');
				util.success('  -  Elapsed time: ' + (moment() - startTime)/1000 + ' seconds.');
				util.success((util.line)['gray']);
			}
			callback(null);
		});
}

Job.prototype.addTasks = function(tasks) {
	var self = this;
	if (!self.tasks) { self.tasks = []; }

	tasks.forEach(function(t, i) {
		self.tasks.push(new Task(t, self.name + '-' + i));
	});
}

Job.prototype.configureLogging = function() {
	var self = this;

	if (self.options.verbose) {
		util.verbose = true;
	}
	if (self.options.debug) {
		util.debug = true;
	}
}

// Make sure we have the required methods
Job.prototype.enforceSchema = function() {
	var self = this;

	if (!self.options.setup) {
		throw (util.error("ERROR '"+ (self.name || '') +"' config : Nansen config file reqiures a SETUP object.  See docs for details."))
	} else if (!self.options.get) {
		throw (util.error("ERROR '"+ (self.name || '') +"' config : Nansen config file reqiures a GET object.  See docs for details."))
	} else if (!self.options.post) {
		throw (util.error("ERROR '"+ (self.name || '') +"' config : Nansen config file reqiures a POST object.  See docs for details."))
	} else if (!self.options.name) {
		throw (util.error("ERROR Config : Nansen config file reqiures 'name'."))
	}
}

module.exports = Job;