import {extent,mean,bisector, group} from "d3-array";
import {line} from "d3-shape";
import {axisLeft,axisBottom} from "d3-axis";
import {scaleUtc, scaleLinear} from "d3-scale";
import {mouse} from "d3-selection";
import {dispatch} from "d3-dispatch";
import {rgb} from "d3-color";
import * as scaleChromatic from "d3-scale-chromatic";

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
		chartOptions = {},
		rule,
		chart_dispatcher = dispatch("mousemove","mouseout"),
    interpolateFn = scaleChromatic.interpolateMagma,
		selection;

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
		chart.selection(context.selection ? context.selection() : context);
		rule = selection
				.append("g")
				.append("line")
				.attr("y0", 0)
				.attr("y1", height - margin.bottom - margin.top)
				.attr("stroke", "steelblue");

		chart.draw();
	}

	chart.on = function(){
		chart_dispatcher.on.apply(chart_dispatcher,arguments);
		return chart;
	}

	chart.selection = function(_){
		if (!arguments.length) return selection;
				
		selection = _;
		return chart;
	}

	chart.getXDomain = function(){
		return xDomain;
	}

	chart.getYDomain = function(){
		return yDomain;
	}

	chart.getZDomain = function(){
		return zDomain;
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
			throw(Error('z must be a function'))
		}
				
		z = _;
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

		data = data.sort(function(a,b){
			return x(a) - x(b);
		})

		let domains = calculateDomains();
		xDomain = domains.xDomain;
		yDomain = domains.yDomain;
		zDomain = domains.zDomain;

		if(typeof chartType == 'function'){
			chartType.call(chart);
		}else{
			switch(chartType){
				case 'line':
					drawLine.call(chart);
					break;
				
				case 'curtain':
					drawCurtain.call(chart);
					break;
				
				default:
					throw(Error('Unsupported chart type'))
			}
		}
	}

  chart.curtainScheme = function(colorScheme) {
    if (!colorScheme.startsWith("interpolate")) {
      colorScheme = `interpolate${colorScheme.charAt(0).toUpperCase()}${colorScheme.slice(1)}`;
    }

    if (typeof scaleChromatic[colorScheme] !== "function") {

      throw new Error(`Interpolation colorScheme ${colorScheme} not found in d3.scaleChromatic`);
    }

    interpolateFn = scaleChromatic[colorScheme];
    return chart;
  }
	
	function drawCurtain(){

		if(!selection){
			throw(Error('must be called from a selection'))
		}
		
		let	canvas = this.selection().node(),
			ctx = canvas.getContext('2d'),
			yScale = scaleLinear()
						.domain(yDomain)
						.range([0,1]),

			xScale = scaleUtc()
						.domain(xDomain)
						.range([0,width]),

			zScale = scaleLinear()
						.domain(zDomain)
						.range([height,0]),
			bisect = bisector(d => d).left,
			gpd = group(data,d=>String(x(d))),
			isDate = x(data[0]) instanceof Date ? true : false,
			uniq_x_vals = Array.from(gpd.keys()).map(d=>isDate ? new Date(d) : d),

			cell_width = chartOptions.cell_width || 1,
			cell_height = chartOptions.cell_height || 1,
			grid = new Array(Math.floor(height/cell_height)),
			pixels = Array(Math.floor(width) * Math.floor(height)),
			alpha = 255;

		for(var _y=0;_y < grid.length; ++ _y){
			grid[_y] = new Array(Math.floor(width/cell_width));
		}

		chart.data().forEach(d=>{

			let x_cell = Math.max(0,
					Math.min(
						Math.floor(xScale(x(d))/cell_width),
						grid[0].length - 1
					)
				),
				z_cell = Math.max(0,
					Math.min(
						Math.floor(zScale(z(d))/cell_height),
						grid.length - 1
					)
				);
			
			if(!isNaN(x_cell) && !isNaN(z_cell)){
				if(grid[z_cell] === undefined){
					debugger;
				}
				if(grid[z_cell][x_cell]){
					if(!Array.isArray(grid[z_cell][x_cell])){
						debugger;
					}
					grid[z_cell][x_cell].push(y(d))
				}else{
					grid[z_cell][x_cell] = [y(d)];
				}
			}

		})

		for(var gy=0;gy < grid.length;gy ++){
			for(var gx=0;gx < grid[gy].length;gx ++){
				let vals = grid[gy][gx],
					//pixel_index = gx*grid[0].length + gy,
					_gy = gy*grid[0].length*cell_height,
					_gx = gx*cell_width,
					c = vals ? rgb(interpolateFn(yScale(mean(vals)))) : null,
					b = c ? (c.r << 0) + (c.g << 8) + (c.b << 16) + (alpha << 24) : 0x00FFFFFF;

				for(var cy = 0;cy < cell_height;cy ++){
					for(var cx =0;cx < cell_width;cx ++){
						let pixel_index = _gy + cy + _gx + cx;
						pixels[pixel_index] = b;
					}
				}
				

				//grid[j][k] = b;
				/* if(vals){
					let c = rgb(interpolateMagma(yScale(mean(vals))));
					pixels[pixel_index] = (c.r << 0) + (c.g << 8) + (c.b << 16) + (alpha << 24);
				}else{
					pixels[pixel_index] = 0x00FFFFFF
				} */
			}
		}
		
		var buf8 = new Uint8Array((new Uint32Array(pixels)).buffer),
		imageData = ctx.getImageData(0,0,Math.floor(width),Math.floor(height));

		imageData.data.set(buf8);
		ctx.putImageData(imageData,0,0);

		selection
			.on("mousemove touchmove", mousemove)
			.on("mouseout touchend", mouseout);

		// let nonNullData = data.filter(d=>x(d) !== null && !isNaN(x(d)));

		function mouseout() {
			rule.style("display", "none");
			chart_dispatcher.call('mouseout',chart);
		}

		function mousemove() {
			
			const selected_x_value = xScale.invert(mouse(this)[0]);
			let index = bisect(uniq_x_vals, selected_x_value, 1),
				profile = gpd.get(String(uniq_x_vals[index]));
			// let grouped_by_x = group(data,d=>x(d)),
			// 	uniq_x_vals = Array.from(grouped_by_x.keys()),
			// 	index = bisect(uniq_x_vals, selected_x_value, 1),
			// 	// profile = Array.from(grouped_by_x)[index];
			// 	profile = Array.from(grouped_by_x)
			// 		.filter(d => d[0] == String(uniq_x_vals[index]))
			// 		.map(d => d[1]).flat();

			// 

			// console.log(uniq_x_vals[index])
			rule.style("display", null);
			rule.attr("transform", `translate(${xScale(uniq_x_vals[index])},${margin.top})`);
			chart_dispatcher.call("mousemove", chart, profile);
			// rule.select("line1text").text(d.pCO2_uatm_Avg.toFixed(2));
			// rule.attr("transform", "translate(" + x(d.time) + ",0)");
		}


	}

	function drawLine(){

		if(!selection){
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
          // @TODO: need to add xLabel if exists here
				

				yAxis = g => g
					.attr("transform", `translate(${margin.left},0)`)
					.call(axisLeft(yScale).ticks(height / 40).tickSizeOuter(0))
					.call(g => g.select(".domain").remove()),
					// @TODO add yLabel here
				
				chartLine = line()
					.defined(d => !isNaN(+x(d)) && x(d) !== null && !isNaN(+y(d)))
					.x(d=>xScale(x(d)))
					.y(d=>yScale(y(d)));
				

			
			selection.append("g")
				.call(xAxis);
			
			selection.append("g")
				.call(yAxis);
			
			// @TODO should make styles properties that can be overridden
			selection.append("path")
				.datum(data)
				.attr("fill", "none")
				.attr("stroke", "#333")
				.attr("stroke-width", 1.5)
				.attr("stroke-linejoin", "round")
				.attr("stroke-linecap", "round")
				.attr("d", chartLine)
			
			selection
				.on("mousemove touchmove", mousemove)
				.on("mouseout touchend", mouseout)
			

			let nonNullData = data.filter(d=>x(d) !== null && !isNaN(x(d)));

			function mouseout() {
				rule.style("display", "none");
				chart_dispatcher.call('mouseout',chart);
			}

			function mousemove() {
				const bisect = bisector(d => x(d)).left;
				const mouse_pos = mouse(this);
				const selected_x_value = xScale.invert(mouse_pos[0]);
				const index = bisect(nonNullData, selected_x_value, 1);
				const a = nonNullData[Math.max(0,Math.min(index - 1,nonNullData.length - 1))];
				const b = nonNullData[Math.max(0,Math.min(index,nonNullData.length - 1))];
				const d = selected_x_value - x(a) > x(b) - selected_x_value ? b : a;
				//console.log(d);
				rule.style("display", null);
				rule.attr("transform", `translate(${xScale(d.time)},${margin.top})`);
				chart_dispatcher.call("mousemove",chart,d);
				// rule.select("line1text").text(d.pCO2_uatm_Avg.toFixed(2));
				// rule.attr("transform", "translate(" + x(d.time) + ",0)");
			}
			
			

			
      // @TODO: option to overlay dots on line

		}

			



	}

	return chart;
}


export default chart;
