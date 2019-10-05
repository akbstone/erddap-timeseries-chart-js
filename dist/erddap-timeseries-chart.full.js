(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-select')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-select'], factory) :
  (global = global || self, factory(global.d3 = global.d3 || {}, global.d3Select));
}(this, function (exports, d3Select) { 'use strict';

  d3Select = d3Select && d3Select.hasOwnProperty('default') ? d3Select['default'] : d3Select;

  var pi = Math.PI;

  var pi$1 = Math.PI;

  function sign(x) {
    return x < 0 ? -1 : 1;
  }

  // Calculate the slopes of the tangents (Hermite-type interpolation) based on
  // the following paper: Steffen, M. 1990. A Simple Method for Monotonic
  // Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
  // NOV(II), P. 443, 1990.
  function slope3(that, x2, y2) {
    var h0 = that._x1 - that._x0,
        h1 = x2 - that._x1,
        s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
        s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
        p = (s0 * h1 + s1 * h0) / (h0 + h1);
    return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
  }

  // Calculate a one-sided slope.
  function slope2(that, t) {
    var h = that._x1 - that._x0;
    return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
  }

  // According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
  // "you can express cubic Hermite interpolation in terms of cubic Bézier curves
  // with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
  function point$3(that, t0, t1) {
    var x0 = that._x0,
        y0 = that._y0,
        x1 = that._x1,
        y1 = that._y1,
        dx = (x1 - x0) / 3;
    that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
  }

  function MonotoneX(context) {
    this._context = context;
  }

  MonotoneX.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 =
      this._y0 = this._y1 =
      this._t0 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 2: this._context.lineTo(this._x1, this._y1); break;
        case 3: point$3(this, this._t0, slope2(this, this._t0)); break;
      }
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      var t1 = NaN;

      x = +x, y = +y;
      if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; point$3(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
        default: point$3(this, this._t0, t1 = slope3(this, x, y)); break;
      }

      this._x0 = this._x1, this._x1 = x;
      this._y0 = this._y1, this._y1 = y;
      this._t0 = t1;
    }
  };

  function MonotoneY(context) {
    this._context = new ReflectContext(context);
  }

  (MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
    MonotoneX.prototype.point.call(this, y, x);
  };

  function ReflectContext(context) {
    this._context = context;
  }

  ReflectContext.prototype = {
    moveTo: function(x, y) { this._context.moveTo(y, x); },
    closePath: function() { this._context.closePath(); },
    lineTo: function(x, y) { this._context.lineTo(y, x); },
    bezierCurveTo: function(x1, y1, x2, y2, x, y) { this._context.bezierCurveTo(y1, x1, y2, x2, y, x); }
  };

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
  			xDomain = d3.extent(data,x);
  			yDomain = d3.extent(data,y);
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
  			xDomain = d3.extent(data,x);
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
  			z_domain = d3.extent(data,z);
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
  			let xScale = d3.scaleUtc()
  					.domain(xDomain)
  					.range([margin.left, width - margin.right]),

  				yScale = d3.scaleLinear()
  					.domain(yDomain).nice()
  					.range([height - margin.bottom, margin.top]),
  				
  				xAxis = g => g
  					.attr("transform", `translate(0,${height - margin.bottom})`)
  					.call(d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0)),
  					//need to add xLabel if exists here
  				

  				yAxis = g => g
  					.attr("transform", `translate(${margin.left},0)`)
  					.call(d3.axisLeft(yScale))
  					.call(g => g.select(".domain").remove()),
  					//add yLabel here
  				
  				line$$1 = d3.line()
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
  				.attr("d", line$$1);
  			
  			

  			
  			//option to overlay dots on line

  		}

  			



  	}

  	return chart;
  }

  exports.erddap_timeseries_chart = chart;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
