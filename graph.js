// Dados de exemplo
const data = [30, 86, 168, 281, 303, 365];

const width = 600;
const height = 400;

const svg = d3.select('#chart')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

svg.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('width', 40)
  .attr('height', d => d)
  .attr('x', (d, i) => i * 50)
  .attr('y', d => height - d)
  .attr('fill', '#ff6600');
