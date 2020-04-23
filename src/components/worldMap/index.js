import * as d3 from 'd3';

function init(elem, data) {
  const margin = { top: 10, right: 20, bottom: 10, left: 20 };
  const width = 1000;
  const height = 600;
  const svg = d3.select(elem)
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  const mapGroup = svg.append('g');

  const projection = d3.geoMercator()
    // .scale(340)
    // .center([33, 100])
    .translate([width / 2, height / 2]);
  const path = d3.geoPath()
    .projection(projection);

  // const zoom = d3.zoom()
  //   .scaleExtent([1, 40])
  //   .translateExtent([[0, 0], [width, height]])
  //   .extent([[0, 0], [width, height]])
  //   .on('zoom', zoomed);

  let active;

  mapGroup.selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('class', 'area')
    .on('mouseenter', function(d) {
      d3.select(this).classed('selected', true);
      mapGroup.append('text')
        .classed('tooltip', true)
        .style('text-anchor', 'middle')
        .attr('x', 100)
        .attr('y', 300)
        .text(d.properties.name);
    })
    .on('mouseleave', function(d) {
      d3.select(this).classed('selected', false);
      d3.selectAll('.tooltip').remove();
    })
    .on('click', function(d) {
      if (active === d) return reset();
      mapGroup.selectAll('.active').classed('active', false);
      d3.select('#' + d.properties.name).classed('active', active = d);

      const b = path.bounds(d);

      mapGroup.transition().duration(700).attr('transform',
        'translate(' + projection.translate() + ')'
        + 'scale(' + .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height) + ')'
        + 'translate(' + -(b[1][0] + b[0][0]) / 2 + ',' + -(b[1][1] + b[0][1]) / 2 + ')');
    });


  function reset() {
    mapGroup.selectAll('.active').classed('active', active = false);
    mapGroup.transition().duration(700).attr('transform', '');
  }

}

export default init;