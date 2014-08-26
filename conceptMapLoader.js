var Q = require('q');
var request = require('request');
var _ = require('underscore')


var Loader = function(url) {
	this.url = url;
}

Loader.prototype.loadData = function() {
	var that = this;

	that.startLoad = new Date();

	function prepareDataForHelios (data) {
		var graphSON = {
			graph: {
				mode: 'NORMAL'
			}
		};

		graphSON.graph.vertices = data.nodes;
		graphSON.graph.edges = data.arcs;

		var id = 0;
		_.each(['vertices', 'edges'], function (type) {
			_.map(graphSON.graph[type], function (object) {
				object._id = ++id;
				return object;
			});
		});

		graphSON.graph.vertices = _.map(graphSON.graph.vertices, function(vertex){
			vertex._type = 'vertex';
			return vertex;
		});

		graphSON.graph.edges = _.map(graphSON.graph.edges, function (edge) {
			var source = _.findWhere(graphSON.graph.vertices, {objectID: edge.objectID1}),
				target = _.findWhere(graphSON.graph.vertices, {objectID: edge.objectID2});

			if (!!source && !!target) {
				edge._inV = source._id;
				edge._outV = target._id;
				edge._label = edge.type;
				edge._type = 'edge';
				return edge;
			}
		});

		graphSON.graph.edges = _.reject(graphSON.graph.edges, function (edge) {
			return (typeof edge === 'undefined');
		});

		return graphSON;
	}

	var deferred = Q.defer();

	if(typeof that.url === 'undefined') {
		throw new Error('Error: URL of JSON data required to build concept map.');
	}

	request(that.url, function(error, response, body) {
		if (error || (response.statusCode !== 200)) {
			throw new Error('Error loading json from url: '+that.url)
		}
		var data = JSON.parse(body);
		data = prepareDataForHelios(data);

		that.endLoad = new Date();

		console.log('Data loaded from '+that.url+' in '+(that.endLoad-that.startLoad)+' milliseconds.');
		deferred.resolve(data);
	});

	return deferred.promise;

};

module.exports = Loader;