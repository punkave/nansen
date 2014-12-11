var Job = require('./job'),
	util = require('./util'), 
	async = require('async');


function Nansen() {
	var self = this;

	self.jobs = [];
}

Nansen.prototype.job = function(config) {
	var self = this;

	self.jobs.push(new Job(config, self.job.length + 1));
}


Nansen.prototype.run = function() {
	var self = this;

	async.eachSeries(self.jobs, function(job, callback){

		job.run(callback);

	}, function(err){
		if (err) {
			util.error("Nansen Job Failure".underline);
			util.error(err);
		} else 
		{
			util.success("All nansen jobs are complete.");
		}
	});
}

module.exports = exports = new Nansen();


