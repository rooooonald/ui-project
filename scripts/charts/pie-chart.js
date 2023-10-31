// Sample data for the pie chart
var dataPieChart = [
  { label: "Category X", value: 20 },
  { label: "Category Y", value: 10 },
  { label: "Category Z", value: 5 },
  { label: "Category W", value: 5 },
  { label: "Category T", value: 20 },
  { label: "Category V", value: 15 },
];

// Set the color scale
var colorsPieChart = [
  "#FED18D",
  "#FEC774",
  "#FCAB32",
  "#F99D1C",
  "#D38105",
  "#000000",
];

// Set the dimensions and margins of the pie chart
var widthPieChart = 600;
var heightPieChart = 600;
var marginPieChart = 100;

// The radius of the pie chart is half the width or half the height (smallest one). Subtract a bit of margin.
var radiusPieChart =
  Math.min(widthPieChart, heightPieChart) / 2 - marginPieChart;

// Append the SVG object for the pie chart to the div called 'pieGraph'
var svgPieChart = d3
  .select("#pie-chart")
  .append("svg")
  .attr("width", widthPieChart)
  .attr("height", heightPieChart)
  .append("g")
  .attr(
    "transform",
    "translate(" + widthPieChart / 2 + "," + heightPieChart / 2 + ")"
  );

// Set the color scale
var colorPieChart = d3
  .scaleOrdinal()
  .domain(dataPieChart.map((d) => d.label))
  .range(colorsPieChart);

// Compute the position of each group on the pie
var piePieChart = d3
  .pie()
  .sort(null) // Do not sort groups by size
  .value(function (d) {
    return d.value;
  });

var dataReadyPieChart = piePieChart(dataPieChart);

// The arc generator
var arcPieChart = d3
  .arc()
  .innerRadius(radiusPieChart * 0) // This is the size of the donut hole
  .outerRadius(radiusPieChart * 0.8);

// Another arc that won't be drawn, just for labels positioning
var outerArcPieChart = d3
  .arc()
  .innerRadius(radiusPieChart * 0.9)
  .outerRadius(radiusPieChart * 0.9);

svgPieChart.style("opacity", 0).transition().duration(1000).style("opacity", 1);

// Add the polylines between chart and labels
svgPieChart
  .selectAll("allPolylines")
  .data(dataReadyPieChart)
  .enter()
  .append("polyline")
  .attr("stroke", "black")
  .style("fill", "none")
  .attr("stroke-width", 1)
  .attr("points", function (d) {
    var posA = arcPieChart.centroid(d); // Line insertion in the slice
    var posB = outerArcPieChart.centroid(d); // Line break: use the other arc generator built only for that
    var posC = outerArcPieChart.centroid(d); // Label position = almost the same as posB
    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // Need the angle to determine if the X position will be at the extreme right or left
    posC[0] = radiusPieChart * 0.95 * (midangle < Math.PI ? 1 : -1); // Multiply by 1 or -1 to put it on the right or left
    return [posA, posB, posC];
  })
  .style("opacity", 0) // Start with opacity set to 0
  .transition()
  .duration(2000)
  .style("opacity", 1);

// Add the labels to the pie chart
svgPieChart
  .selectAll("allLabels")
  .data(dataReadyPieChart)
  .enter()
  .append("text")
  .text(function (d) {
    return d.data.value;
  })
  .attr("transform", function (d) {
    var pos = outerArcPieChart.centroid(d);
    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
    pos[0] = radiusPieChart * 0.99 * (midangle < Math.PI ? 1 : -1);
    return "translate(" + pos + ")";
  })
  .style("text-anchor", function (d) {
    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
    return midangle < Math.PI ? "start" : "end";
  })
  .style("opacity", 0) // Start with opacity set to 0
  .transition()
  .duration(2500)
  .style("opacity", 1);

// Create the donut chart
svgPieChart
  .selectAll("allSlices")
  .data(dataReadyPieChart)
  .enter()
  .append("path")
  .attr("d", arcPieChart)
  .attr("fill", function (d) {
    return colorPieChart(d.data.label);
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
          .innerRadius(radiusPieChart * 0) // Reduce inner radius for zoom
          .outerRadius(radiusPieChart * 0.9) // Increase outer radius for zoom
      )
      .style("opacity", 1)
      .style("stroke-width", "2px");
  })
  .on("mouseout", function (d) {
    // Remove hover effect
    d3.select(this)
      .transition()
      .duration(200)
      .attr("d", arcPieChart) // Restore the original path
      .style("opacity", 0.9)
      .attr("stroke", "white")
      .style("stroke-width", "2px");
  });

// Legend and Title
var legendPieChart = svgPieChart
  .selectAll("legend")
  .data(dataReadyPieChart)
  .enter()
  .append("g")
  .attr("transform", function (d, i) {
    var x = (i % 4) * 140 - 275;
    var y = Math.floor(i / 4) * 30 + heightPieChart / 3;
    return "translate(" + x + "," + y + ")";
  });

legendPieChart
  .append("rect")
  .attr("width", 18)
  .attr("height", 18)
  .attr("rx", 2) // Rounded corners
  .attr("ry", 2) // Rounded corners
  .style("fill", function (d) {
    return colorPieChart(d.data.label);
  })
  .style("opacity", 0)
  .transition()
  .duration(2500)
  .style("opacity", 1);

legendPieChart
  .append("text")
  .attr("x", 30)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .text(function (d) {
    return d.data.label;
  })
  .style("fontFamily", "Montserrat, sans-serif") // Use the custom font
  .style("opacity", 0)
  .transition()
  .duration(1000)
  .style("opacity", 1);

// Title
svgPieChart
  .append("text")
  .attr("x", 0) // Centered horizontally
  .attr("y", -heightPieChart / 2 + 60) // Centered vertically
  .attr("text-anchor", "middle")
  .style("font-size", "30px")
  .style("font-family", "Signika Negative, sans-serif") // Use the custom font
  .style("opacity", 0) // Start with opacity set to 0
  .text("Title Goes Here")
  .transition()
  .duration(1000)
  .style("opacity", 1); // Gradually increase opacity for the title
