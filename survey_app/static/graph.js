function renderGraph(responses) {
  const nodes = new Map();
  const links = [];

  responses.forEach(resp => {
    for (const [q, answer] of Object.entries(resp)) {
      if (!nodes.has(answer)) nodes.set(answer, {id: answer});
    }
  });

  responses.forEach((resp, idx) => {
    const source = 'Responder ' + (idx + 1);
    nodes.set(source, {id: source});
    for (const answer of Object.values(resp)) {
      links.push({source, target: answer});
    }
  });

  const nodeArray = Array.from(nodes.values());

  const svg = d3.select('#graph').append('svg')
    .attr('width', 600)
    .attr('height', 400);

  const simulation = d3.forceSimulation(nodeArray)
    .force('link', d3.forceLink(links).id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(300, 200));

  const link = svg.append('g').selectAll('line')
    .data(links).enter().append('line')
    .attr('stroke', '#999');

  const node = svg.append('g').selectAll('circle')
    .data(nodeArray).enter().append('circle')
    .attr('r', 5)
    .attr('fill', 'steelblue');

  node.append('title').text(d => d.id);

  simulation.on('tick', () => {
    link.attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
    node.attr('cx', d => d.x)
        .attr('cy', d => d.y);
  });
}
