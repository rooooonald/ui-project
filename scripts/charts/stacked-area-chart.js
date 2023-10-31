// Generate random data for three data series
var dataAreaChart = [];
for (var i = 0; i < 10; i++) {
  dataAreaChart.push({
    date: new Date(2023, 0, i),
    series1: Math.random() * 50,
    series2: Math.random() * 50,
    series3: Math.random() * 50,
  });
}

// Set the dimensions of the graph
var marginAreaChart = { top: 70, right: 30, bottom: 30, left: 40 };
var widthAreaChart = 460 - marginAreaChart.left - marginAreaChart.right;
var heightAreaChart = 400 - marginAreaChart.top - marginAreaChart.bottom;

// Create an SVG container
var svgAreaChart = d3
  .select("#stacked-area-chart")
  .append("svg")
  .attr("width", widthAreaChart + marginAreaChart.left + marginAreaChart.right)
  .attr(
    "height",
    heightAreaChart + marginAreaChart.top + marginAreaChart.bottom
  )
  .append("g")
  .attr(
    "transform",
    "translate(" + marginAreaChart.left + "," + marginAreaChart.top + ")"
  );

// Define scales for x and y
var xScaleAreaChart = d3
  .scaleTime()
  .domain(
    d3.extent(dataAreaChart, function (d) {
      return d.date;
    })
  )
  .range([0, widthAreaChart]);

var yScaleAreaChart = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(dataAreaChart, function (d) {
      return d.series1 + d.series2 + d.series3;
    }),
  ])
  .range([heightAreaChart, 0]);

// Create area generators for each data series
var area1AreaChart = d3
  .area()
  .x(function (d) {
    return xScaleAreaChart(d.date);
  })
  .y0(heightAreaChart)
  .y1(function (d) {
    return yScaleAreaChart(d.series1);
  });

var area2AreaChart = d3
  .area()
  .x(function (d) {
    return xScaleAreaChart(d.date);
  })
  .y0(function (d) {
    return yScaleAreaChart(d.series1);
  })
  .y1(function (d) {
    return yScaleAreaChart(d.series1 + d.series2);
  });

var area3AreaChart = d3
  .area()
  .x(function (d) {
    return xScaleAreaChart(d.date);
  })
  .y0(function (d) {
    return yScaleAreaChart(d.series1 + d.series2);
  })
  .y1(function (d) {
    return yScaleAreaChart(d.series1 + d.series2 + d.series3);
  });

// Append the area paths to the SVG
svgAreaChart
  .append("path")
  .datum(dataAreaChart)
  .attr("fill", "#D38105")
  .attr("d", area1AreaChart);

svgAreaChart
  .append("path")
  .datum(dataAreaChart)
  .attr("fill", "#FCAB32")
  .attr("d", area2AreaChart);

svgAreaChart
  .append("path")
  .datum(dataAreaChart)
  .attr("fill", "#FEC774")
  .attr("d", area3AreaChart);

// Add x and y axes
svgAreaChart
  .append("g")
  .style("font-family", "var(--secondary-font)")
  .attr("transform", "translate(0," + heightAreaChart + ")")
  .call(d3.axisBottom(xScaleAreaChart));

svgAreaChart
  .append("g")
  .style("font-family", "var(--secondary-font)")
  .call(d3.axisLeft(yScaleAreaChart));

svgAreaChart
  .append("text")
  .attr("x", widthAreaChart / 2) // Centered horizontally
  .attr("y", -25) // Centered vertically
  .attr("text-anchor", "middle")
  .style("font-size", "30px")
  .style("font-family", "Signika Negative, sans-serif") // Use the custom font
  .style("opacity", 0) // Start with opacity set to 0
  .text("Title Goes Here")
  .transition()
  .duration(1000)
  .style("opacity", 1); // Gradually increase opacity for the title
