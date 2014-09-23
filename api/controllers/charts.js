'use strict';

var util = require('util');
var moment = require('moment');
var url = require('url');
var request = require('request');
module.exports = {
  renderChart: renderChart
}



var part1 = '<!DOCTYPE html><html><head> <meta http-equiv="content-type" content="text/html; charset=UTF-8"> <title> - jsFiddle demo by masayuki0812</title> <script type="text/javascript" src="http://d3js.org/d3.v3.min.js"></script><script type="text/javascript" src="https://rawgit.com/masayuki0812/c3/master/c3.js"></script> <link rel="stylesheet" type="text/css" href="https://rawgit.com/masayuki0812/c3/master/c3.css"> <style type="text/css"> </style> <script type="text/javascript"> window.onload=function(){ var chart = c3.generate({ axis: {x: {type: "timeseries",tick: {format:"%H:%M"}}}, data: { x:"x",xFormat:"%Y-%m-%d %H:%M",columns:' ;
var part2 = '[ ["data1", 100, 200, 150, 300, 200], ["data2", 400, 500, 250, 700, 300], ]' ;
var part3 = ' } }); } </script></head> <body><div id="chart"></div> </body> </html>';

function renderChart(req, res) {

  var select = req.swagger.params.select.value;
  var timeRange = req.swagger.params.timeRange.value;
  var timeUnit = req.swagger.params.timeUnit.value;
  var sortBy = req.swagger.params.sortBy.value;
  if(!req.get('Authorization')){
  	res.header('WWW-Authenticate', 'Basic');
  	res.send(401);

  }else{
	  console.log(req.url);
	  var url = 'https://api.enterprise.apigee.com/v1/' + req.url ;
	  var app_options = {
	  	"url": url,
	  	headers: {
	  		"Authorization": req.get('Authorization'),
	  	}
	  };
	  request(app_options, function(err,analyticsResponse,analyticsData){
	  	console.log(analyticsResponse.statusCode);
		  	if( analyticsResponse.statusCode == 200 )
		  	{
			  	var d = JSON.parse(analyticsData);
			  	var columns = [] ;
			  	var dims = d.environments[0].dimensions;
			  	var xaxis = ['x'];
			  				  		
			  	var dimension = dims[0];
			  	if(dimension){
			  		if(dimension.metrics[0])
			  		{
					  	var vals = dimension.metrics[0].values;
					  	for(var j in vals){
					  		xaxis.push(moment(vals[j].timestamp).format('YYYY-MM-DD h:mm'));
					  	}
					  	columns.push(xaxis);
					 }
			  	}
			  	for(var i in dims){
			  		var dataColumn = [] ;
			  		var dimension = dims[i];
			  		var name = dimension.name ;
			  		dataColumn.push(name);
			  		var vals = dimension.metrics[0].values;
			  		for(var j in vals){
			  			dataColumn.push(vals[j].value);
			  		}
			  		columns.push(dataColumn);
			  	}
			  	part2 = JSON.stringify(columns);
			  	res.header('Content-Type','text/html');
			  	res.send(part1+part2+part3);
		  }else{
		  	res.send(analyticsResponse.statusCode);
		  }
	  });
	}
  // console.log(select + ' ' + timeRange + ' ' + timeUnit + ' ' + sortBy);
  // res.header('Content-Type','text/html');
  // res.send(part1+part2+part3);
}
