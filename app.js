var express = require('express');
var app = express();
var Helios = require('./helios-node/helios.js');

app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies


var graph;

var Loader = require('./conceptMapLoader.js');
var loader = new Loader('http://dev-stable.cxp.corp.web/contentservice/assets/mtng_chemistry/protected/course_definitions/concept_map.json');

loader.loadData().then(function(data) {
	graph = new Helios.GraphDatabase({
		heliosDBPath: './helios-node/lib/heliosDB.js'
	});

	graph.loadGraphSON(data).then(function(graph) {});
});

app.post('/query', function(req, res) {
	var query = req.body.q;
	eval('graph.'+query).then(function (result) {
		res.json(result);
	});
});

app.listen(3000);