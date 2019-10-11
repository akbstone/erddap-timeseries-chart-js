import chart from './erddap-timeseries-chart';
import { select } from 'd3-selection';

const gliderData = require('../test/glider-data.json').map(d=>{
  return {
    ...d,
    time: new Date(d.time)
  }
});

let data = [
  {
    time:new Date(2019,10,1),
    value:10,
    qc:1
  },
  {
    time:new Date(2019,10,2),
    value:11,
    qc:3
  },
  {
    time:new Date(2019,10,3),
    value:4,
    qc:3
  },
  {
    time:new Date(2019,10,4),
    value:5,
    qc:4
  },
  {
    time:new Date(2019,10,5),
    value:10,
    qc:1
  }
]

function makeEl(chart, width = 800, height = 400, elType = 'svg') {
  const containerEl = document.createElement('div'),
    el = select(containerEl)
      .append(elType)
      .attr('width', width)
      .attr('height', height)
      .call(chart);

  return containerEl;
}

export default { title: 'ERDDAP Timeseries Chart' };

export const basic = () => {
  const ch = chart()
    .data(data)
    .width(800)
    .height(400)
    .chartType('line')
    .x(d => d.time)
    .y(d => d.value);

  return makeEl(ch);
};

export const basicSquare = () => {
  const ch = chart()
    .data(data)
    .width(500)
    .height(500)
    .chartType('line')
    .x(d => d.time)
    .y(d => d.value);

  return makeEl(ch, 500, 500);
};

export const nonDateX = () => {
  const ch = chart()
    .data(data)
    .chartType('line')
    .width(800)
    .height(400)
    .x(d => d.qc)
    .y(d => d.value);

  return makeEl(ch);
}

export const gliderDataTemperature = () => {
  const ch = chart()
    .data(gliderData)
    .chartType('line')
    .width(800)
    .height(400)
    .x(d => d.time)
    .y(d => +d.temperature);

  return makeEl(ch);
}

export const gliderDataDepth = () => {
  const ch = chart()
    .data(gliderData)
    .chartType('line')
    .width(800)
    .height(400)
    .x(d => d.time)
    .y(d => 0 - +d.depth);

  return makeEl(ch);
}

export const gliderCurtainPlot = () => {
  const ch = chart()
    .data(gliderData)
    .chartType('curtain')
    .width(800)
    .height(400)
    .x(d => d.time)
    .y(d => +d.temperature)
    .z(d => -1 * +d.depth);

  return makeEl(ch, 800, 400, 'canvas');
}

export const gliderCurtainPlotSmaller = () => {
  const ch = chart()
    .data(gliderData)
    .chartType('curtain')
    .width(800)
    .height(200)
    .x(d => d.time)
    .y(d => +d.temperature)
    .z(d => -1 * +d.depth);

  return makeEl(ch, 800, 200, 'canvas');
}


export const gliderCurtainPlotViridis = () => {
  const ch = chart()
    .data(gliderData)
    .chartType('curtain')
    .width(800)
    .height(400)
    .curtainScheme('viridis')
    .x(d => d.time)
    .y(d => +d.temperature)
    .z(d => -1 * +d.depth);

  return makeEl(ch, 800, 400, 'canvas');
}
