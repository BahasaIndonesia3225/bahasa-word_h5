import React from 'react';
import { Chart, Geom, Coord, Legend } from 'bizgoblin';

const pixelRatio = window.devicePixelRatio * 2;

const map = {
  'A': '40%',
  'B': '20%',
  'C': '18%',
  'D': '15%',
  'E': '5%',
  'F': '2%',
};

const data = [
  {
    name: 'A',
    percent: 0.4,
    a: '1',
  }, {
    name: 'B',
    percent: 0.2,
    a: '1',
  }, {
    name: 'C',
    percent: 0.18,
    a: '1',
  }, {
    name: 'D',
    percent: 0.15,
    a: '1',
  }, {
    name: 'E',
    percent: 0.05,
    a: '1',
  }, {
    name: 'F',
    percent: 0.02,
    a: '1',
  },
];

const defs = [{
  dataKey: 'percent',
  formatter: val => `${val * 100}%`,
}];

export default () => {
  return (
    <Chart width="100%" data={data} defs={defs} pixelRatio={pixelRatio} >
      <Coord type="polar" transposed radius={0.85} />
      <Geom
        geom="interval"
        position="a*percent"
        color={['name', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0']]}
        adjust="stack"
        style={{
          lineWidth: 1,
          stroke: '#fff',
          lineJoin: 'round',
          lineCap: 'round',
        }}
      />
      <Legend position="right" itemFormatter={value => `${value} ${map[value]}`} />
    </Chart>
  )
}
