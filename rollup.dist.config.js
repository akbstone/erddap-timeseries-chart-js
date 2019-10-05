export default {
  input: 'src/index.js',
  external: ['d3-shape','d3-axis'],
  output:{
    format: 'umd',
    name:'d3',
    file: 'dist/erddap-timeseries-chart.js',
    moduleId:'erddap-timeseries-chart',
    extend:true,
    globals:{
      'd3-shape':'d3',
      'd3-axis':'d3'
    }
  }
}
