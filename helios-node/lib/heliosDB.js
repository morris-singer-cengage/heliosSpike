"use strict";

/* Third party libraries. */
var Q = require('q'),
	sax = require('sax'),
	Utils = require('./utils.js');

/* Our Modules */
var Element = require('./element.js'),
	Vertex = require('./vertex.js'),
	Edge = require('./edge.js'),
	GraphDatabase = require('./graphdatabase.js'),
	Mogwai = require('./mogwai.js');

var Helios = {
	Element: Element,
	Vertex: Vertex,
	Edge: Edge,
	GraphDatabase: GraphDatabase,
	Mogwai: Mogwai
};

//var graphDb, r;
//var mockWorker = {
//	dbCommand: function (params) {
//		r = graphDb = graphDb || new Helios.GraphDatabase();
//		for(var i = 0; i < params.length; i++) {
//			r = r[params[i].method].apply(r, params[i].parameters);
//		}
//		return r;
//	},
//	run: function (params) {
//		r = graphDb;
//		params.push({
//			method: 'emit',
//			parameters: []
//		});
//		for(var i = 0; i < params.length; i++) {
//			r = r[params[i].method].apply(r, params[i].parameters);
//		}
//		graphDb.startTrace(false);
//		return r;
//	},
//	startTrace: function (param) {
//		graphDb.startTrace(param);
//	},
//	invoke: function(functionName, args) {
//		var deferred = Q.defer();
//
//		// Next Tick
//		setTimeout(function() {
//			deferred.resolve(mockWorker[functionName](args));
//		}, 0);
//
//		return deferred.promise;
//	}
//};
//
//module.exports = mockWorker;

module.exports = Helios;