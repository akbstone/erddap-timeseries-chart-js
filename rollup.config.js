export default {
  input: 'index.js',
  external: [ 'd3-array','d3-time','d3-time-format','underscore' ],
  output:{
    format: 'umd',
    name:'d3',
    file: 'build/d3-series-stats.js',
    moduleId:'d3-series-stats',
    extend:true,
    globals:{
      'd3-array':'d3',
      'd3-time':'d3',
      'd3-time-format':'d3',
      'underscore':'_'
    }
  }
}
