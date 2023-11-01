// Generate random data for three data series
var dataStackedAreaChart = [];
for (var i = 0; i < 10; i++) {
  dataStackedAreaChart.push({
    date: new Date(2023, 0, i),
    series1: Math.random() * 50,
    series2: Math.random() * 50,
    series3: Math.random() * 50,
  });
}

// Set the dimensions of the graph
var marginStackedAreaChart = { top: 70, right: 30, bottom: 30, left: 40 };
var widthStackedAreaChart =
  460 - marginStackedAreaChart.left - marginStackedAreaChart.right;
var heightStackedAreaChart =
  400 - marginStackedAreaChart.top - marginStackedAreaChart.bottom;

// Create an SVG container
var svgStackedAreaChart = d3
  .select("#stacked-area-chart")
  .append("svg")
  .attr(
    "width",
    widthStackedAreaChart +
      marginStackedAreaChart.left +
      marginStackedAreaChart.right
  )
  .attr(
    "height",
    heightStackedAreaChart +
      marginStackedAreaChart.top +
      marginStackedAreaChart.bottom
  )
  .append("g")
  .attr(
    "transform",
    "translate(" +
      marginStackedAreaChart.left +
      "," +
      marginStackedAreaChart.top +
      ")"
  );

// Define scales for x and y
var xScaleStackedAreaChart = d3
  .scaleTime()
  .domain(
    d3.extent(dataStackedAreaChart, function (d) {
      return d.date;
    })
  )
  .range([0, widthStackedAreaChart]);

var yScaleStackedAreaChart = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(dataStackedAreaChart, function (d) {
      return d.series1 + d.series2 + d.series3;
    }),
  ])
  .range([heightStackedAreaChart, 0]);

// Create area generators for each data series
var area1StackedAreaChart = d3
  .area()
  .x(function (d) {
    return xScaleStackedAreaChart(d.date);
  })
  .y0(heightStackedAreaChart)
  .y1(function (d) {
    return yScaleStackedAreaChart(d.series1);
  });

var area2StackedAreaChart = d3
  .area()
  .x(function (d) {
    return xScaleStackedAreaChart(d.date);
  })
  .y0(function (d) {
    return yScaleStackedAreaChart(d.series1);
  })
  .y1(function (d) {
    return yScaleStackedAreaChart(d.series1 + d.series2);
  });

var area3StackedAreaChart = d3
  .area()
  .x(function (d) {
    return xScaleStackedAreaChart(d.date);
  })
  .y0(function (d) {
    return yScaleStackedAreaChart(d.series1 + d.series2);
  })
  .y1(function (d) {
    return yScaleStackedAreaChart(d.series1 + d.series2 + d.series3);
  });

// Append the area paths to the SVG
svgStackedAreaChart
  .append("path")
  .datum(dataStackedAreaChart)
  .attr("fill", "#D38105")
  .attr("d", area1StackedAreaChart);

svgStackedAreaChart
  .append("path")
  .datum(dataStackedAreaChart)
  .attr("fill", "#FCAB32")
  .attr("d", area2StackedAreaChart);

svgStackedAreaChart
  .append("path")
  .datum(dataStackedAreaChart)
  .attr("fill", "#FEC774")
  .attr("d", area3StackedAreaChart);

// Add x and y axes
svgStackedAreaChart
  .append("g")
  .style("font-family", "var(--font-secondary)")
  .attr("transform", "translate(0," + heightStackedAreaChart + ")")
  .call(d3.axisBottom(xScaleStackedAreaChart));

svgStackedAreaChart
  .append("g")
  .style("font-family", "var(--font-secondary)")
  .call(d3.axisLeft(yScaleStackedAreaChart));

svgStackedAreaChart
  .append("text")
  .attr("x", widthStackedAreaChart / 2) // Centered horizontally
  .attr("y", -25) // Centered vertically
  .attr("text-anchor", "middle")
  .style("font-size", "30px")
  .style("font-family", "var(--font-primary)") // Use the custom font
  .style("opacity", 0) // Start with opacity set to 0
  .text("Title Goes Here")
  .transition()
  .duration(1000)
  .style("opacity", 1); // Gradually increase opacity for the title

// End of StackedAreaChart
