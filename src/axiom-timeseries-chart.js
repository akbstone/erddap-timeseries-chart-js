


export default function(){

	let x = function(d){return d[0]},
	    y = function(d){return d[1]},
	    qc = function(d){return d[2]},
	    x_label,
	    y_label,
	    qc_options,
	    data;



	function chart(){
		

		
		
		return chart;
	}

	chart.data = function(_){
		if (!arguments.length) return data;
				
		data = _;
		return data;

	}

	chart.x = function(_){

		if (!arguments.length) return x;

		if(!typeof _ !== 'function'){
			throw(Error('x must be a function'))
		}
				
		x = _;
		return x;

	}

	chart.y = function(_){

		if (!arguments.length) return y;

		if(!typeof _ !== 'function'){
			throw(Error('y must be a function'))
		}
				
		y = _;
		return y;

	}

	chart.y_label = function(_){
		if (!arguments.length) return y_label;

		if(typeof _ !== 'string' || typeof _ !== 'number'){
			throw(Error('y_label must be a number or a string'))
		}
				
		y_label = _;
		return y_label;

	}

	chart.x_label = function(_){

		if (!arguments.length) return x_label;

		if(typeof _ !== 'string' || typeof _ !== 'number'){
			throw(Error('x_label must be a number or a string'))
		}
				
		x_label = _;
		return x_label;

	}

	chart.qc_options = function(_){
		if (!arguments.length) return qc_options;

		if(typeof _ !== 'array'){
			throw(Error('qc_options must be a number or a string'))
		}
				
		qc_options = _;
		return qc_options;
	}



}