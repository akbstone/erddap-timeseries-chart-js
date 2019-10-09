import chart from './erddap-timeseries-chart';
import { select } from 'd3-selection';

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

function makeEl(chart, width = 800, height = 400) {
  const svgEl = document.createElement('div'),
    svg = select(svgEl)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .call(chart);

  return svgEl;
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

export const nonDate = () => {
  const ch = chart()
    .data(data)
    .chartType('line')
    .width(800)
    .height(400)
    .x(d => d.qc)
    .y(d => d.value);

  return makeEl(ch);
}
