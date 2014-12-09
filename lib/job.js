var async = require('async'),
	Task = require('./task');


function Job(options) {
	var self = this;

	self._id = Math.floor((Math.random() * 10000) + 1);  // Nansen needs to do this
	self.name = options.name || "Job_"+ self._id;
	self.options = options;

	self.enforceSchema();

	self.addTasks([self.options.setup, self.options.get, self.options.post]);
}


Job.prototype.run = function(callback) {
	var self = this;

	console.log("----- Running job " + self.name + ' ------');

	async.eachSeries(self.tasks, 

		function(task, callback){

			task.run(callback);	

		},function(err, data){

			if (err) {
				self.log('ERR: ' + self.name);
				self.log(err);
				return callback(err);
			} else {
				self.log(self.name + ' is complete.');
			}
			callback(null);
	});
}

Job.prototype.addTasks = function(tasks) {
	var self = this;
	if (!self.tasks) { self.tasks = []; }

	tasks.forEach(function(t, i){
		self.tasks.push(new Task(t));
	});
}


Job.prototype.log = function(s) {
	var self = this;
	
	console.log(s);
}

Job.prototype.enforceSchema = function() {
	var self = this;

	if (!self.options.setup) {
		throw ("ERROR: Nansen configuration file reqiures a SETUP object.  See docs for details.")
	} else if (!self.options.get) {
		throw ("ERROR: Nansen configuration file reqiures a GET object.  See docs for details.")
	} else if (!self.options.post) {
		throw ("ERROR: Nansen configuration file reqiures a POST object.  See docs for details.")
	}
}

module.exports = Job;