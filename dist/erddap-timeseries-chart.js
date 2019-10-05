(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array'), require('d3-selection'), require('d3-shape'), require('d3-axis'), require('d3-scale')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3-array', 'd3-selection', 'd3-shape', 'd3-axis', 'd3-scale'], factory) :
	(global = global || self, factory(global.d3 = global.d3 || {}, global.d3, global.d3, global.d3, global.d3, global.d3));
}(this, function (exports, d3Array, d3Selection, d3Shape, d3Axis, d3Scale) { 'use strict';

	d3Array = d3Array && d3Array.hasOwnProperty('default') ? d3Array['default'] : d3Array;
	d3Shape = d3Shape && d3Shape.hasOwnProperty('default') ? d3Shape['default'] : d3Shape;
	d3Axis = d3Axis && d3Axis.hasOwnProperty('default') ? d3Axis['default'] : d3Axis;
	d3Scale = d3Scale && d3Scale.hasOwnProperty('default') ? d3Scale['default'] : d3Scale;

	function chart(){

		let x = function(d){return d[0]},
			y = function(d){return d[1]},
			z = function(d){return d[2]},
			width = 800,
			height = 400,
			margin = {
				top:20,
				right:30,
				bottom:30,
				left:40
			},
			xDomain,
			yDomain,
			xLabel,
		    yLabel,
		    qcOptions,
			data,
			chartType = 'line',
			_selection;

		function calculateDomains(){
			if(x && y && data){
				xDomain = d3Array.extent(data,x);
				yDomain = d3Array.extent(data,y);
			}
		}

		function chart(context){
			_selection = context.selection ? context.selection() : context;
			chart.draw();
		}

		chart.data = function(_){
			if (!arguments.length) return data;
					
			data = _;
			return chart;

		};

		chart.x = function(_){

			if (!arguments.length) return x;

			if(typeof _ !== 'function'){
				throw(Error('x must be a function'))
			}
					
			x = _;

			if(data){
				xDomain = d3Array.extent(data,x);
			}
			return chart;

		};

		chart.y = function(_){

			if (!arguments.length) return y;

			if(typeof _ !== 'function'){
				throw(Error('y must be a function'))
			}
					
			y = _;
			return chart;

		};

		chart.z = function(_){

			if (!arguments.length) return z;

			if(typeof _ !== 'function'){
				throw(Error('y must be a function'))
			}
					
			z = _;
			if(data){
				z_domain = d3Array.extent(data,z);
			}
			return chart;

		};

		chart.width = function(_){
			if (!arguments.length) return width;

			_ = +_;

			if(typeof _ !== 'number' && !isNaN(_)){
				throw(Error('width must be a number'))
			}
					
			width = _;
			return chart;
		};

		chart.height = function(_){
			if (!arguments.length) return height;

			_ = +_;

			if(typeof _ !== 'number' && !isNaN(_)){
				throw(Error('width must be a number'))
			}
					
			height = _;
			return chart;
		};

		chart.yLabel = function(_){
			if (!arguments.length) return yLabel;

			if(typeof _ !== 'string' || typeof _ !== 'number'){
				throw(Error('yLabel must be a number or a string'))
			}
					
			yLabel = _;
			return yLabel;

		};

		chart.xLabel = function(_){

			if (!arguments.length) return xLabel;

			if(typeof _ !== 'string' || typeof _ !== 'number'){
				throw(Error('xLabel must be a number or a string'))
			}
					
			xLabel = _;
			return xLabel;

		};

		chart.qcOptions = function(_){
			if (!arguments.length) return qcOptions;

			if(typeof _ !== 'array'){
				throw(Error('qcOptions must be an array'))
			}
					
			qcOptions = _;
			return chart;
		};

		chart.chartType = function(_,options){
			if (!arguments.length) return qcOptions;

			if(typeof _ !== 'string'){
				//eventually support function
				throw(Error('chartType must be an array'))
			}

			if(options && typeof options !== 'object'){
				throw(Error('chartOptions must be an object'))
			}
					
			chartType = _;
			return chart;
		};

		chart.draw = function(){

			switch(chartType){
				case 'line':
					drawLine();
					break;
				
				default:
					throw(Error('Unsupported chart type'))
			}

		};


		function drawLine(){

			if(!_selection){
				throw(Error('must be called from a selection'))
			}

			//could allow scales to be passed in
			calculateDomains();
			
			
			if(xDomain && yDomain){
				let xScale = d3Scale.scaleUtc()
						.domain(xDomain)
						.range([margin.left, width - margin.right]),

					yScale = d3Scale.scaleLinear()
						.domain(yDomain).nice()
						.range([height - margin.bottom, margin.top]),
					
					xAxis = g => g
						.attr("transform", `translate(0,${height - margin.bottom})`)
						.call(d3Axis.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0)),
						//need to add xLabel if exists here
					

					yAxis = g => g
						.attr("transform", `translate(${margin.left},0)`)
						.call(d3Axis.axisLeft(yScale))
						.call(g => g.select(".domain").remove()),
						//add yLabel here
					
					line = d3Shape.line()
						.defined(d => !isNaN(+x(d)))
						.x(d=>xScale(x(d)))
						.y(d=>yScale(y(d)));
					

				
				_selection.append("g")
					.call(xAxis);
				
				_selection.append("g")
					.call(yAxis);
				
				//should make styles properties that can be overridden
				_selection.append("path")
					.datum(data)
					.attr("fill", "none")
					.attr("stroke", "#333")
					.attr("stroke-width", 1.5)
					.attr("stroke-linejoin", "round")
					.attr("stroke-linecap", "round")
					.attr("d", line);
				
				

				
				//option to overlay dots on line

			}

				



		}

		return chart;
	}

	exports.erddap_timeseries_chart = chart;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
