var assert = require('assert'),
    config,
	  nansen;


describe('Nansen', function() {
  describe('module exists:', function(){ 
  	nansen = require('../lib/nansen');
    it('exists', function() {
    	assert(nansen);
    });
  });
  describe('test config file exists:', function(){
    config = require('./testConfig.js');
    it('exists', function() {
      assert(config);
    });
  });
    
  describe('run test job:', function() {
    it('loads configuration file', function() {
      nansen.job(config, {verbose: true, parellel: 3});
    });
    it('consume test api', function(done) {
      nansen.run( function(e) {
        assert.ifError(e);
        return done();
    });
    });
  });
});