var Task = require('./task'),
	util = require('./util'), 
	async = require('async');


function Job(options, id) {
	var self = this;

	self._id = id;
	self.name = options.name || "Job_"+ self._id;
	self.options = options;

	self.enforceSchema();

	self.addTasks([self.options.setup, self.options.get, self.options.post]);
}


Job.prototype.run = function(callback) {
	var self = this;

	util.jLog("------- Starting Job: " + self.name + ' --------');

	async.waterfall([

		// 1.  Setup
		function(callback){
			self.tasks[0].run(null, callback);
		},

		// 1b.  Get + Post for each item
		function(data, callback) {

			if (data && data.items) {
				async.eachSeries(data.items, function(item, callback){
					
					async.waterfall([

						// 2.  Get - each item
						function(callback) {

							self.tasks[1].run(item, callback);
						},

						// 3.  Post for each item
						function(response, callback) {
							self.tasks[2].run(response, callback);
						}],

						function(err) {
							if (err) {
								util.error('JOB ERROR: ' + self.name);
								util.error(err);
								callback(err);
							} else {
								util.success('Post is complete.');
								callback(null);
							}
						});

				}, function(err){
					if (err) {
						util.error(err);
						callback(err);
					}
					callback(null);
				});
			} else {
				util.error("ERROR: No 'items' received from <setup>");
			}
		}]

		,function(err, data){

			if (err) {
				util.error('JOB ERROR: ' + self.name);
				util.error(err);
				return callback(err);
			} else {
				util.success((self.name).yellow + (' is complete.').green);
			}
			callback(null);
		});
}

Job.prototype.addTasks = function(tasks) {
	var self = this;
	if (!self.tasks) { self.tasks = []; }

	tasks.forEach(function(t, i){
		self.tasks.push(new Task(t, self.name + '-' + i));
	});
}


Job.prototype.enforceSchema = function() {
	var self = this;

	if (!self.options.setup) {
		throw (util.error("ERROR: Nansen configuration file reqiures a SETUP object.  See docs for details."))
	} else if (!self.options.get) {
		throw (util.error("ERROR: Nansen configuration file reqiures a GET object.  See docs for details."))
	} else if (!self.options.post) {
		throw (util.error("ERROR: Nansen configuration file reqiures a POST object.  See docs for details."))
	}
}

module.exports = Job;