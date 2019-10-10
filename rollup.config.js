export default {
  input: 'src/index.js',
  external: [ 'd3-selection','d3-array','d3-shape','d3-axis','d3-scale','d3-dispatch','d3-color'],
  output:{
    format: 'umd',
    name:'d3',
    file: 'build/erddap-timeseries-chart.js',
    moduleId:'erddap-timeseries-chart',
    extend:true,
    globals:{
      'd3-array':'d3',
      'd3-shape':'d3',
      'd3-selection':'d3',
      'd3-axis':'d3',
      'd3-scale':'d3',
      'd3-dispatch':'d3',
      'd3-color':'d3'
    }
  }
}
