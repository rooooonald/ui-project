const colors = [
  "#FED18D",
  "#FEC774",
  "#FCAB32",
  "#F99D1C",
  "#D38105",
  "#000000",
];
// set the dimensions and margins of the graph
var width = 500,
  height = 500,
  margin = 100;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin;

// append the svg object to the div called 'my_dataviz'
var svg = d3
  .select("#donut-chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// New data
const data1 = [
  { label: "Category X", value: 20 },
  { label: "Category Y", value: 10 },
  { label: "Category Z", value: 5 },
  { label: "Category W", value: 5 },
  { label: "Category T", value: 20 },
  { label: "Category V", value: 15 },
];

// set the color scale
var color = d3
  .scaleOrdinal()
  .domain(data1.map((d) => d.label))
  .range(colors); // Use the custom color array

// Compute the position of each group on the pie:
var pie = d3
  .pie()
  .sort(null) // Do not sort group by size
  .value(function (d) {
    return d.value;
  });

var data_ready = pie(data1);

// The arc generator
var arc = d3
  .arc()
  .innerRadius(radius * 0.5) // This is the size of the donut hole
  .outerRadius(radius * 0.8);

// Another arc that won't be drawn. Just for labels positioning
var outerArc = d3
  .arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9);

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.

// Add the polylines between chart and labels:
svg
  .selectAll("allPolylines")
  .data(data_ready)
  .enter()
  .append("polyline")
  .attr("stroke", "black")
  .style("fill", "none")
  .attr("stroke-width", 1)
  .attr("points", function (d) {
    var posA = arc.centroid(d); // line insertion in the slice
    var posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
    var posC = outerArc.centroid(d); // Label position = almost the same as posB
    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
    posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
    return [posA, posB, posC];
  });

// Add the polylines between chart and labels:
svg
  .selectAll("allLabels")
  .data(data_ready)
  .enter()
  .append("text")
  .text(function (d) {
    return d.data.label;
  })
  .attr("transform", function (d) {
    var pos = outerArc.centroid(d);
    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
    pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
    return "translate(" + pos + ")";
  })
  .style("text-anchor", function (d) {
    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
    return midangle < Math.PI ? "start" : "end";
  });

svg
  .selectAll("allSlices")
  .data(data_ready)
  .enter()
  .append("path")
  .attr("d", arc)
  .attr("fill", function (d) {
    return color(d.data.label);
  }) // Use the custom color scale
  .attr("stroke", "white")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)
  .on("mouseover", function (d) {
    // Add hover effect with zoom
    d3.select(this)
      .transition()
      .duration(200)
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(radius * 0.5) // Reduce inner radius for zoom
          .outerRadius(radius * 0.9) // Increase outer radius for zoom
      )
      .style("opacity", 1)
      .style("stroke-width", "2px");
  })
  .on("mouseout", function (d) {
    // Remove hover effect
    d3.select(this)
      .transition()
      .duration(200)
      .attr("d", arc) // Restore the original path
      .style("opacity", 0.7)
      .attr("stroke", "white")
      .style("stroke-width", "2px");
  });

svg
  .append("text")
  .attr("x", 0) // Centered horizontally
  .attr("y", -height / 2 + 60) // Centered vertically
  .attr("text-anchor", "middle")
  .style("font-size", "30px")
  .style("font-family", "Signika Negative, sans-serif") // Use the custom font
  .style("opacity", 0) // Start with opacity set to 0
  .text("Donut Chart")
  .transition()
  .duration(1000)
  .style("opacity", 1); // Gradually increase opacity for the title
