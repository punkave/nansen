var Job = require('./job'),
	util = require('./util'), 
	async = require('async'),
	extend = require('extend');


function Nansen() {
	var self = this;

	self.jobs = [];
}

Nansen.prototype.job = function(config, options) {
	var self = this;
	options = extend(config, options || {});

	self.jobs.push(new Job(options));
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

Nansen.prototype.ready = function() {
	var self = this;
	return self.jobs.length;
}

module.exports = exports = new Nansen();


