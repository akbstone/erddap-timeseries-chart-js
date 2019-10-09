import {extent,bisector} from "d3-array";
import {line} from "d3-shape";
import {axisLeft,axisBottom} from "d3-axis";
import {scaleUtc, scaleLinear} from "d3-scale";
import {mouse} from "d3-selection";
import {dispatch} from "d3-dispatch";

function chart(){

	let x = function(d){return d[0]},
		y = function(d){return d[1]},
		z = function(d){return d[2]},
		qc = function(d){return d[3]},
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
		zDomain,
	    xLabel,
	    yLabel,
	    qcOptions,
		data,
		chartType = 'line',
		chartOptions,
		_selection;

	function calculateDomains(){
		let domains = {}
		if(data){
			if(x){
				domains.xDomain = extent(data,x);
			}
			if(y){
				domains.yDomain = extent(data,y);
			}
			if(z){
				domains.zDomain = extent(data,z);
			}
		}

		return domains;


	}

	function chart(context){
		_selection = context.selection ? context.selection() : context;
		chart.draw();
	}

	chart.data = function(_){
		if (!arguments.length) return data;
				
		data = _;
		return chart;

	}

	chart.x = function(_){

		if (!arguments.length) return x;

		if(typeof _ !== 'function'){
			throw(Error('x must be a function'))
		}
				
		x = _;

		if(data){
			xDomain = extent(data,x)
		}
		return chart;

	}

	chart.y = function(_){

		if (!arguments.length) return y;

		if(typeof _ !== 'function'){
			throw(Error('y must be a function'))
		}
				
		y = _;
		return chart;

	}

	chart.z = function(_){

		if (!arguments.length) return z;

		if(typeof _ !== 'function'){
			throw(Error('y must be a function'))
		}
				
		z = _;
		if(data){
			z_domain = extent(data,z)
		}
		return chart;

	}

	chart.qc = function(_){

		if (!arguments.length) return qc;

		if(typeof _ !== 'function'){
			throw(Error('qc must be a function'))
		}
				
		qc = _;
		return chart;

	}

	chart.width = function(_){
		if (!arguments.length) return width;

		_ = +_;

		if(typeof _ !== 'number' && !isNaN(_)){
			throw(Error('width must be a number'))
		}
				
		width = _;
		return chart;
	}

	chart.height = function(_){
		if (!arguments.length) return height;

		_ = +_;

		if(typeof _ !== 'number' && !isNaN(_)){
			throw(Error('height must be a number'))
		}
				
		height = _;
		return chart;
	}

	chart.yLabel = function(_){
		if (!arguments.length) return yLabel;

		if(typeof _ !== 'string' || typeof _ !== 'number'){
			throw(Error('yLabel must be a number or a string'))
		}
				
		yLabel = _;
		return yLabel;

	}

	chart.xLabel = function(_){

		if (!arguments.length) return xLabel;

		if(typeof _ !== 'string' || typeof _ !== 'number'){
			throw(Error('xLabel must be a number or a string'))
		}
				
		xLabel = _;
		return xLabel;

	}

	chart.qcOptions = function(_){
		if (!arguments.length) return qcOptions;

		if(!Array.isArray(_)){
			throw(Error('qcOptions must be an array'))
		}
				
		qcOptions = _;
		return chart;
	}

	chart.chartType = function(_, options){
		if (!arguments.length) return chartType;

		if(typeof _ !== 'string' && typeof _ !== 'function'){
			throw(Error('chartType must be a string or function'))
		}

		if(options && typeof options !== 'object'){
			throw(Error('chartOptions must be an object'))
		}
				
		chartType = _;
		if(options){
			chartOptions = options;
		}
		return chart;
	}

	chart.draw = function(){

		let domains = calculateDomains();
		xDomain = domains.xDomain;
		yDomain = domains.yDomain;
		zDomain = domains.zDomain;

		switch(chartType){
			case 'line':
				drawLine();
				break;
			
			default:
				throw(Error('Unsupported chart type'))
		}

	}


	function drawLine(){

		if(!_selection){
			throw(Error('must be called from a selection'))
		}
		
		if(xDomain && yDomain){
      let fn = (xDomain[0] instanceof Date) ? scaleUtc : scaleLinear,
          xScale = fn()
					.domain(xDomain)
					.range([margin.left, width - margin.right]),

				yScale = scaleLinear()
					.domain(yDomain).nice()
					.range([height - margin.bottom, margin.top]),
				
				xAxis = g => g
					.attr("transform", `translate(0,${height - margin.bottom})`)
					.call(axisBottom(xScale).ticks(width / 80).tickSizeOuter(0)),
					//need to add xLabel if exists here
				

				yAxis = g => g
					.attr("transform", `translate(${margin.left},0)`)
					.call(axisLeft(yScale))
					.call(g => g.select(".domain").remove()),
					//add yLabel here
				
				chartLine = line()
					.defined(d => !isNaN(+x(d)) && x(d) !== null)
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
				.attr("d", chartLine)
			
			_selection
				.on("mousemove touchmove", mousemove)
				.on("mouseout", mouseout)
			
			const rule = _selection
				.append("g")
				.append("line")
				.attr("y0", 0)
				.attr("y1", height - margin.bottom - margin.top)
				.attr("stroke", "steelblue");

			let nonNullData = data.filter(d=>x(d) !== null && !isNaN(x(d)));

			function mouseout() {
				rule.style("display", "none");
			}

			function mousemove() {
				const bisect = bisector(d => x(d)).left;
				const selected_x_value = xScale.invert(mouse(this)[0]);
				const index = bisect(nonNullData, selected_x_value, 1);
				const a = nonNullData[Math.max(0,Math.min(index - 1,nonNullData.length - 1))];
				const b = nonNullData[Math.max(0,Math.min(index,nonNullData.length - 1))];
				const d = selected_x_value - x(a) > x(b) - selected_x_value ? b : a;
				console.log(d);
				rule.style("display", null);
				rule.attr("transform", `translate(${xScale(d.time)},${margin.top})`);
				// rule.select("line1text").text(d.pCO2_uatm_Avg.toFixed(2));
				// rule.attr("transform", "translate(" + x(d.time) + ",0)");
			}
			
			

			
			//option to overlay dots on line

		}

			



	}

	return chart;
}


export default chart;
