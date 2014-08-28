var express = require('express');
var app = express();
var PonyDB = require('./ponydb/ponydb.js');
var _ = require('underscore');

app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies


var Loader = require('./conceptMapLoader.js');

var historyLoader = new Loader('http://dev-stable.cxp.corp.web/contentservice/assets/easd01h/course_definitions/9781285846200.json');
var chemistryLoader = new Loader('http://dev-stable.cxp.corp.web/contentservice/assets/easd01h/course_definitions/9781285846415.json');

var Q = require('q');

var historyGraph, chemistryGraph;

historyLoader.loadData().then(function(data) {
	var graphStart = new Date();
	historyGraph = new PonyDB.GraphDatabase();
	var graphEnd = new Date();
	console.log('History graph db created in '+(graphEnd-graphStart)+' milliseconds');

	var startLoadGraphSON = new Date();
	historyGraph.loadGraphSON(data).then(function(graph) {
		var endLoadGraphSON = new Date();
		historyGraph = graph;
		console.log('History GraphSON data loaded in '+(endLoadGraphSON - startLoadGraphSON)+' milliseconds.');
	});

});

chemistryLoader.loadData().then(function(data) {
	var chemistryGraphStart = new Date();
	chemistryGraph = new PonyDB.GraphDatabase();
	var chemistryGraphEnd = new Date();
	console.log('Chemistry graph db created in '+(chemistryGraphEnd - chemistryGraphStart)+' milliseconds');

	var startLoadGraphSON = new Date();
	chemistryGraph.loadGraphSON(data).then(function(graph) {
		var endLoadGraphSON = new Date();
		chemistryGraph = graph;
		console.log('Chemistry GraphSON data loaded in '+(endLoadGraphSON - startLoadGraphSON)+' milliseconds.');
	});
})

Q.all([historyLoader.loadData(), chemistryLoader.loadData()]).then(function (data) {

});

app.post('/query', function(req, res) {
	var query = req.body.q;

	var chemistryQuery = eval('chemistryGraph.'+query)
	var historyQuery = eval('historyGraph.'+query)

	var responseData = {
		history: historyQuery.emit(),
		chemistry:chemistryQuery.emit()
	};
	res.json(responseData);

});

app.listen(3000);