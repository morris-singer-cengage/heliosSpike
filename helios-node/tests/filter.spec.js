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

describe('Filter', function() {

    describe('index => [i]', function() {
        it("should return the second item", function(done){
            g.v().index(1).then(function (result) {
				expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
				done();
			});
        });

        it("should return the second and third item", function(done){
            g.v().index(1,2).then(function (result) {
				expect(result.length).to.be.equal(2);
				expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
				expect(result).to.be.an('array').with.deep.property('[1]._id', 3);
				done();
			});
        });
        it("should return the second item passing in array", function(done){
            g.v().index([1]).then(function (result) {
				expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
				done();
			});
        });

        it("should return the second  and third item passing in array", function(done){
            g.v().index([1,2]).then(function (result) {
				expect(result.length).to.be.equal(2);
				expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
				expect(result).to.be.an('array').with.deep.property('[1]._id', 3);
				done();
			});
        });
    });

    describe('range => [i..j]', function() {
        it("should return item at index 1 to 3 inclusive", function(done){
            g.v().range(1,3).then(function (result) {
				expect(result.length).to.be.equal(3);
				expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
				expect(result).to.be.an('array').with.deep.property('[1]._id', 3);
				expect(result).to.be.an('array').with.deep.property('[2]._id', 4);
				done();
			});
        });
    });

    describe('g.v(1).out.out.in.in.back(3)', function() {
        it("should return v[4]", function(done){
            g.v(1).out().out().in().in().back(3).then(function (result) {
				expect(result.length).to.be.equal(1);
				expect(result).to.be.an('array').with.deep.property('[0]._id', 4);
				done();
			});
        });
    });

    describe('g.v(1).out.out.back(1)', function() {
        it("should return array len = 1 of arrays with v[4]", function(done){
            g.v(1).out().out().back(1).then(function (result) {
				expect(result.length).to.be.equal(1);
				expect(result).to.be.an('array').with.deep.property('[0]._id', 4);
				done();
			});
        });
    });

    describe('g.v(1).out.out.back(1).path', function() {
        it("should return array len = 1 of arrays with v[1], v[4]", function(done){
            g.v(1).out().out().back(1).path().then(function (result) {
				expect(result.length).to.be.equal(1);
				expect(result[0]).to.be.an('array').with.deep.property('[0]._id', 1);
				expect(result[0]).to.be.an('array').with.deep.property('[1]._id', 4);
				done();
			});
        });
    });

    describe('g.v(1).out.out.optional(1)', function() {
        it("should return array len = 3 of arrays with v[2], v[3], v[4]", function(done){
            g.v(1).out().out().optional(1).then(function (result) {
				expect(result.length).to.be.equal(3);
				expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
				expect(result).to.be.an('array').with.deep.property('[1]._id', 4);
				expect(result).to.be.an('array').with.deep.property('[2]._id', 3);
				done();
			});
        });
    });

    describe('g.v(1).out.out.optional(1).path', function() {
        it("should return array len = 3 of arrays with v[1] @ [0]", function(done){
            g.v(1).out().out().optional(1).path().then(function (result) {
				expect(result.length).to.be.equal(3);
				expect(result[0].length).to.be.equal(2);
				expect(result[0]).to.be.an('array').with.deep.property('[0]._id', 1);
				expect(result[0]).to.be.an('array').with.deep.property('[1]._id', 2);
				expect(result[1]).to.be.an('array').with.deep.property('[0]._id', 1);
				expect(result[1]).to.be.an('array').with.deep.property('[1]._id', 4);
				expect(result[2]).to.be.an('array').with.deep.property('[0]._id', 1);
				expect(result[2]).to.be.an('array').with.deep.property('[1]._id', 3);
				done();
			});
        });
    });

    describe('g.v(1).out.as("x").out.in.in.back("x")', function() {
        it("should return v[4]", function(done){
            g.v(1).out().as('x').out().in().in().back('x').then(function (result) {
				expect(result.length).to.be.equal(1);
				expect(result).to.be.an('array').with.deep.property('[0]._id', 4);
				done();
			});
        });
    });

    describe('g.v(1).out.as("x").out.back("x")', function() {
        it("should return array len = 1 of arrays with v[4]", function(done){
            g.v(1).out().as('x').out().back('x').then(function (result) {
				expect(result.length).to.be.equal(1);
				expect(result).to.be.an('array').with.deep.property('[0]._id', 4);
				done();
			});
        });
    });

    describe('g.v(1).out.as("x").out.back("x").path', function() {
        it("should return array len = 1 of arrays with v[1], v[4]", function(done){
            g.v(1).out().as('x').out().back('x').path().then(function (result) {
				expect(result.length).to.be.equal(1);
				expect(result[0]).to.be.an('array').with.deep.property('[0]._id', 1);
				expect(result[0]).to.be.an('array').with.deep.property('[1]._id', 4);
				done();
			});
        });
    });

    describe('g.v(1).out.as("x").out.optional("x")', function() {
        it("should return array len = 3 of arrays with v[2], v[3], v[4]", function(done){
            g.v(1).out().as('x').out().optional('x').then(function (result) {
				expect(result.length).to.be.equal(3);
				expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
				expect(result).to.be.an('array').with.deep.property('[1]._id', 4);
				expect(result).to.be.an('array').with.deep.property('[2]._id', 3);
				done();
			});
        });
    });

    describe('g.v(1).out.as("x").out.optional("x").path', function() {
        it("should return array len = 3 of arrays with v[1] @ [0]", function(done){
            g.v(1).out().as('x').out().optional('x').path().then(function (result) {
				expect(result.length).to.be.equal(3);
				expect(result[0].length).to.be.equal(2);
				expect(result[0]).to.be.an('array').with.deep.property('[0]._id', 1);
				expect(result[0]).to.be.an('array').with.deep.property('[1]._id', 2);
				expect(result[1]).to.be.an('array').with.deep.property('[0]._id', 1);
				expect(result[1]).to.be.an('array').with.deep.property('[1]._id', 4);
				expect(result[2]).to.be.an('array').with.deep.property('[0]._id', 1);
				expect(result[2]).to.be.an('array').with.deep.property('[1]._id', 3);
				done();
			});
        });
    });

    describe('g.V().out.has("name","vadas").out.back(1).path', function() {
        it("should return empty array", function(done){
            g.v(1).out().where({'name':{$eq:'vadas'}}).out().back(1).path().then(function (result) {
				expect(result).to.be.empty;
				done();
			});
        });
    });

    describe('g.V().out.has("name","vadas").out.optional(1).path', function() {
        it("should return array len = 1 of arrays with v[1],v[4]", function(done){
            g.v().out().where({'name':{$eq:'vadas'}}).out().optional(1).path().then(function (result) {
				expect(result.length).to.be.equal(1);
				expect(result[0]).to.be.an('array').with.deep.property('[0]._id', 1);
				expect(result[0]).to.be.an('array').with.deep.property('[1]._id', 2);
				done();
			});
        });
    });

    describe("g.V().as('x').outE('knows').inV().where({'age':{$gt:30}}).back('x').property('age')", function() {
        it("should return array with 29", function(done){
            g.v().as('x').outE('knows').inV().where({'age':{$gt:30}}).back('x').property('age').then(function (result) {
				expect(result.length).to.be.equal(1);
				expect(result).to.be.an('array').with.deep.property('[0]', 29);
				done();
			});
        });
    });
});