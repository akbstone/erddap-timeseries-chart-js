const tape = require("tape"),
      erddap_timeseries_chart = require('../');

const etc = erddap_timeseries_chart.erddapTimeseriesChart();

tape("x, y, z, qc should be a function when getted", function(test){
	test.equal(typeof etc.x(), "function");
	test.equal(typeof etc.y(), "function");
	test.equal(typeof etc.z(), "function");
	test.equal(typeof etc.qc(), "function");
	test.end();
})

tape("width, height should be numbers when getted", function(test){
	test.true(typeof etc.width() === "number" && !isNaN(etc.width()));
	test.true(typeof etc.height() === "number" && !isNaN(etc.height()));
	test.end();
})

tape("ylabel, xlabel should be strings, numbers, or undefined when getted", function(test){
	test.true(typeof etc.xLabel() === "string" || typeof etc.xLabel() === "number" || typeof etc.xLabel() === "undefined");
	test.true(typeof etc.yLabel() === "string" || typeof etc.yLabel() === "number" || typeof etc.yLabel() === "undefined");
	test.end();
})

tape("qcOptions should be an array or undefined when getted", function(test){
	test.true(Array.isArray(etc.qcOptions()) || typeof etc.qcOptions() === "undefined");
	test.end();
})

tape("chartType should be a string or function when getted", function(test){
	console.log(etc.chartType())
	test.true(typeof etc.chartType() === "string" || typeof etc.chartType() === "function");
	test.end();
})