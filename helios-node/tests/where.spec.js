var expect = require('./chai.js').expect;
var Helios = require('../helios.js');
var g;
before(function(done){
	var db = new Helios.GraphDatabase({
		heliosDBPath: './lib/heliosDB.js'
	});
	var testData = {
		"graph": {
			"mode":"NORMAL",
			"vertices":[
				{"name":"marko","age":29,"_id":1,"_type":"vertex", "dow":["mon", "tue"], "dob":"1984-05-05", "active":true, "salary":"$120,000", "device":{"qty":3,"mobile":{"phone":["iphone", "samsung"], "tablet":["galaxy"]}}},
				{"name":"vadas","age":27,"_id":2,"_type":"vertex", "dow":["mon", "wed", "thu"], "dob":"1986-03-12", "active":false, "salary":"$100,000", "device":{"qty":1,"mobile":{"phone":["iphone"]}}},
				{"name":"lop","lang":"java","_id":3,"_type":"vertex"},
				{"name":"josh","age":32,"_id":4,"_type":"vertex", "dow":["fri"], "dob":"1981-09-01T00:00:00.000Z", "active":true, "salary":"$80,000", "device":{"qty":2,"mobile":{"phone":["iphone"], "tablet":["ipad"]}}},
				{"name":"ripple","lang":"java","_id":5,"_type":"vertex"},
				{"name":"peter","age":35,"_id":6,"_type":"vertex", "dow":["mon","fri"], "dob":"1978-12-13", "active":true, "salary":"$70,000", "device":{"qty":2,"mobile":{"phone":["iphone"], "tablet":["ipad"]}}}
			],
			"edges":[
				{"weight":0.5,"_id":7,"_type":"edge","_outV":1,"_inV":2,"_label":"knows"},
				{"weight":1.0,"_id":8,"_type":"edge","_outV":1,"_inV":4,"_label":"knows"},
				{"weight":0.4,"_id":9,"_type":"edge","_outV":1,"_inV":3,"_label":"created"},
				{"weight":1.0,"_id":10,"_type":"edge","_outV":4,"_inV":5,"_label":"created"},
				{"weight":0.4,"_id":11,"_type":"edge","_outV":4,"_inV":3,"_label":"created"},
				{"weight":0.2,"_id":12,"_type":"edge","_outV":6,"_inV":3,"_label":"created"}
			]
		}
	};

	db.loadGraphSON(testData).then(function(_g_) {
		g = _g_;
		done();
	});
});

after(function(done){
	g.shutdown();
	done();
});

describe('where', function() {

	describe('$eq', function() {
		it("should return id 1 from v", function(done) {
			g.v({name:{$eq:'marko'}}).then(function (result) {
				expect(result).to.be.an('array').with.deep.property('[0]._id', 1);
				done();
			});
		});

		it("should return id 1", function(done) {
			g.v().where({name:{$eq:'marko'}}).then(function (result) {
				expect(result.length).to.be.equal(1);
				expect(result).to.be.an('array').with.deep.property('[0]._id', 1);
				done();
			});
		});
	});

	describe('$btw', function() {
		it("should return id 1 and id 2 from v", function(done) {
			g.v({age:{$btw:['27','31']}}).then(function (result) {
				expect(result.length).to.be.equal(2);
				expect(result).to.be.an('array').with.deep.property('[0].age', 29);
				expect(result).to.be.an('array').with.deep.property('[1].age', 27);
				done();
			});
		});

		it("should return id 1 and id 2", function(done) {
			g.v().where({age:{$btw:[27,31]}}).then(function (result) {
				expect(result.length).to.be.equal(2);
				expect(result).to.be.an('array').with.deep.property('[0].age', 29);
				expect(result).to.be.an('array').with.deep.property('[1].age', 27);
				done();
			});
		});
	});

//
	describe('$includes', function() {
		it("should return id 1 and 2 from v", function(done) {
			g.v({age:{$in:[27,29]}}).then(function (result) {
				expect(result.length).to.be.equal(2);
				expect(result).to.be.an('array').with.deep.property('[0].age', 29);
				expect(result).to.be.an('array').with.deep.property('[1].age', 27);
				done();
			});
		});

		it("should return id 2", function(done) {
			g.v().where({age:{$in:[27,29]}}).then(function (result) {
				expect(result.length).to.be.equal(2);
				expect(result).to.be.an('array').with.deep.property('[0].age', 29);
				expect(result).to.be.an('array').with.deep.property('[1].age', 27);
				done();
			});
		});

		it("check array for values", function(done) {
			g.v().where({age:{$in:[27,29]}}).then(function (result) {
				expect(result.length).to.be.equal(2);
				expect(result).to.be.an('array').with.deep.property('[0].age', 29);
				expect(result).to.be.an('array').with.deep.property('[1].age', 27);
				done();
			});
		});
	});

	describe('$ex', function() {
		it("should return values that don't have any matching values in an array from v", function(done) {
			g.v().where({dow:{$ex:['fri']}}).then(function (result) {
				expect(result.length).to.be.equal(2);
				expect(result).to.be.an('array').with.deep.property('[0]._id', 1);
				expect(result).to.be.an('array').with.deep.property('[1]._id', 2);
				done();
			});
		});

		it("should return values that don't have any matching values in an array", function(done) {
			g.v().where({dow:{$ex:['mon','wed','thu']}}).then(function (result) {
				expect(result.length).to.be.equal(1);
				expect(result).to.be.an('array').with.deep.property('[0]._id', 4);
				done();
			});
		});
	});

	describe('$every', function() {
		it("should return id 2 from v", function(done) {
			g.v({dow:{$all:['mon','wed']}}).then(function (result) {
				expect(result.length).to.be.equal(1);
				expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
				done();
			});
		});

		it("should return id 2", function(done) {
			g.v().where({dow:{$all:['mon','wed']}}).then(function (result) {
				expect(result.length).to.be.equal(1);
				expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
				done();
			});
		});
	});

	describe('$match', function() {
		it("should return values exactly matching an array from v", function(done) {
			g.v({dow:{$match:['mon','wed','thu']}}).then(function (result) {
				expect(result.length).to.be.equal(1);
				expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
				done();
			});
		});

		it("should return values exactly matching an array", function(done) {
			g.v().where({dow:{$match:['mon','wed','thu']}}).then(function (result) {
				expect(result.length).to.be.equal(1);
				expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
				done();
			});
		});
	});
});