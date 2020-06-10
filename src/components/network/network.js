import * as d3 from "d3";

function init(elem, data) {
  const svgWidth = 1200;
  const svgHeight = 1000;
  const svg = d3
    .select(elem)
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  const width = svgWidth;
  const height = svgHeight;

  const simulation = d3
    .forceSimulation()
    .force("charge", d3.forceManyBody().strength(-60))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force(
      "link",
      d3.forceLink().id((d) => d.id)
    );

  const nodes = data.nodes;
  const links = data.links;

  const pathEnter = svg.selectAll("path").data(links).enter().append("path");
  pathEnter.classed("link", true);

  const diagonal = d3
    .linkHorizontal()
    .x((d) => d.x)
    .y((d) => d.y);

  const nodeEnter = svg
    .selectAll("g.node")
    .data(nodes)
    .enter()
    .append("g")
    .classed("node", true);
  nodeEnter
    .append("circle")
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );
  nodeEnter
    .append("text")
    .attr("dy", ".35em")
    .attr("x", 13)
    .text((d) => d.id);

  simulation.nodes(nodes).on("tick", tick);
  simulation.force("link").links(links);

  function tick() {
    nodeEnter.attr("transform", (d) => `translate(${d.x},${d.y})`);
    pathEnter.attr("d", diagonal);
  }

  function dragstarted() {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
  }

  function dragged() {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  }

  function dragended() {
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  }
}

export default init;