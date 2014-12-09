var Job = require('./job'),
	async = require('async');


function Nansen() {
	var self = this;

	self.jobs = [];
}

Nansen.prototype.job = function(config) {
	var self = this;

	self.jobs.push(new Job(config));
}


Nansen.prototype.run = function() {
	var self = this;

	async.eachSeries(self.jobs, function(job, callback){

		job.run(callback);

	}, function(err){
		if (err) {
			console.log("Nansen Job Failure:");
			console.log(err);
		} else 
		{
			console.log("All nansen jobs are complete.");
		}

	});
}

module.exports = exports = new Nansen();


