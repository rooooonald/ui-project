const colorsDonutChart = [
  "#FED18D",
  "#FEC774",
  "#FCAB32",
  "#F99D1C",
  "#D38105",
  "#000000",
];

// Set the dimensions and margins of the graph
var widthDonutChart = 600;
var heightDonutChart = 600;
var marginDonutChart = 100;

// The radius of the pieplot is half the width or half the height (smallest one). Subtract a bit of margin.
var radiusDonutChart =
  Math.min(widthDonutChart, heightDonutChart) / 2 - marginDonutChart;

// Append the SVG object to the div called 'donut-chart'
var svgDonutChart = d3
  .select("#donut-chart")
  .append("svg")
  .attr("width", widthDonutChart)
  .attr("height", heightDonutChart)
  .append("g")
  .attr(
    "transform",
    "translate(" + widthDonutChart / 2 + "," + heightDonutChart / 2 + ")"
  );

// New data
const dataDonutChart = [
  { label: "Category X", value: 20 },
  { label: "Category Y", value: 10 },
  { label: "Category Z", value: 5 },
  { label: "Category W", value: 5 },
  { label: "Category T", value: 20 },
  { label: "Category V", value: 15 },
];

// Set the color scale
var colorDonutChart = d3
  .scaleOrdinal()
  .domain(dataDonutChart.map((d) => d.label))
  .range(colorsDonutChart);

// Compute the position of each group on the pie
var pieDonutChart = d3
  .pie()
  .sort(null) // Do not sort groups by size
  .value(function (d) {
    return d.value;
  });

var dataReadyDonutChart = pieDonutChart(dataDonutChart);

// The arc generator
var arcDonutChart = d3
  .arc()
  .innerRadius(radiusDonutChart * 0.5) // Size of the donut hole
  .outerRadius(radiusDonutChart * 0.8);

// Another arc that won't be drawn, just for labels positioning
var outerArcDonutChart = d3
  .arc()
  .innerRadius(radiusDonutChart * 0.9)
  .outerRadius(radiusDonutChart * 0.9);

// Set initial opacity for the SVG
svgDonutChart
  .style("opacity", 0)
  .transition()
  .duration(1000)
  .style("opacity", 1);

// Add the polylines between chart and labels
svgDonutChart
  .selectAll("allPolylines")
  .data(dataReadyDonutChart)
  .enter()
  .append("polyline")
  .attr("stroke", "black")
  .style("fill", "none")
  .attr("stroke-width", 1)
  .attr("points", function (d) {
    var posA = arcDonutChart.centroid(d); // Line insertion in the slice
    var posB = outerArcDonutChart.centroid(d); // Line break, using the other arc generator
    var posC = outerArcDonutChart.centroid(d); // Label position, almost the same as posB
    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // Angle to determine X position (right or left)
    posC[0] = radiusDonutChart * 0.95 * (midangle < Math.PI ? 1 : -1); // Multiply by 1 or -1 to position it right or left
    return [posA, posB, posC];
  })
  .style("opacity", 0) // Start with opacity set to 0
  .transition()
  .duration(1000)
  .style("opacity", 1);

// Add the labels
svgDonutChart
  .selectAll("allLabels")
  .data(dataReadyDonutChart)
  .enter()
  .append("text")
  .text(function (d) {
    return d.data.value;
  })
  .attr("transform", function (d) {
    var pos = outerArcDonutChart.centroid(d);
    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
    pos[0] = radiusDonutChart * 0.99 * (midangle < Math.PI ? 1 : -1);
    return "translate(" + pos + ")";
  })
  .style("text-anchor", function (d) {
    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
    return midangle < Math.PI ? "start" : "end";
  })
  .style("opacity", 0) // Start with opacity set to 0
  .transition()
  .duration(1000)
  .style("opacity", 1);

// Create the donut chart
svgDonutChart
  .selectAll("allSlices")
  .data(dataReadyDonutChart)
  .enter()
  .append("path")
  .attr("d", arcDonutChart)
  .attr("fill", function (d) {
    return colorDonutChart(d.data.label);
  })
  .attr("stroke", "white")
  .style("stroke-width", "2px")
  .style("opacity", 0.9)
  .on("mouseover", function (d) {
    // Add hover effect with zoom
    d3.select(this)
      .transition()
      .duration(200)
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(radiusDonutChart * 0.5) // Reduce inner radius for zoom
          .outerRadius(radiusDonutChart * 0.9) // Increase outer radius for zoom
      )
      .style("opacity", 1)
      .style("stroke-width", "2px");
  })
  .on("mouseout", function (d) {
    // Remove hover effect
    d3.select(this)
      .transition()
      .duration(200)
      .attr("d", arcDonutChart) // Restore the original path
      .style("opacity", 0.9)
      .attr("stroke", "white")
      .style("stroke-width", "2px");
  });

// Legend and title
var legendDonutChart = svgDonutChart
  .selectAll("legend")
  .data(dataReadyDonutChart)
  .enter()
  .append("g")
  .attr("transform", function (d, i) {
    var x = (i % 4) * 140 - 275;
    var y = Math.floor(i / 4) * 30 + heightDonutChart / 3;
    return "translate(" + x + "," + y + ")";
  });

// Create legend
legendDonutChart
  .append("rect")
  .attr("width", 18)
  .attr("height", 18)
  .attr("rx", 2) // Rounded corners
  .attr("ry", 2) // Rounded corners
  .style("fill", function (d) {
    return colorDonutChart(d.data.label);
  })
  .style("opacity", 0) // Start with opacity set to 0
  .transition()
  .duration(1000)
  .style("opacity", 1);

legendDonutChart
  .append("text")
  .attr("x", 30)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .text(function (d) {
    return d.data.label;
  })
  .style("font-family", "var(--font-secondary)") // Use the custom font
  .style("opacity", 0) // Start with opacity set to 0
  .transition()
  .duration(1000)
  .style("opacity", 1);

// Title
svgDonutChart
  .append("text")
  .attr("x", 0) // Centered horizontally
  .attr("y", -heightDonutChart / 2 + 60) // Centered vertically
  .attr("text-anchor", "middle")
  .style("font-size", "30px")
  .style("font-family", "var(--font-primary)") // Use the custom font
  .style("opacity", 0) // Start with opacity set to 0
  .text("Title Goes Here")
  .transition()
  .duration(1000)
  .style("opacity", 1); // Gradually increase opacity for the title
