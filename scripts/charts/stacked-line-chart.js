// Sample data for the stacked line chart
var dataStackedLineChart = [
  { year: 2010, value1: 150, value2: 50, value3: 80 },
  { year: 2011, value1: 180, value2: 60, value3: 100 },
  { year: 2012, value1: 200, value2: 70, value3: 120 },
  { year: 2013, value1: 240, value2: 80, value3: 140 },
  { year: 2014, value1: 300, value2: 90, value3: 160 },
  { year: 2015, value1: 350, value2: 100, value3: 180 },
];

// Set the dimensions for the stacked line chart
var marginStackedLineChart = { top: 70, right: 30, bottom: 50, left: 60 };
var widthStackedLineChart =
  600 - marginStackedLineChart.left - marginStackedLineChart.right;
var heightStackedLineChart =
  400 - marginStackedLineChart.top - marginStackedLineChart.bottom;

// Append the SVG object to the body of the page
var svgStackedLineChart = d3
  .select("#stacked-line-chart")
  .append("svg")
  .attr(
    "width",
    widthStackedLineChart +
      marginStackedLineChart.left +
      marginStackedLineChart.right
  )
  .attr(
    "height",
    heightStackedLineChart +
      marginStackedLineChart.top +
      marginStackedLineChart.bottom
  )
  .append("g")
  .attr(
    "transform",
    "translate(" +
      marginStackedLineChart.left +
      "," +
      marginStackedLineChart.top +
      ")"
  );

// Define scales for X and Y axes
var xStackedLineChart = d3
  .scaleLinear()
  .domain([
    d3.min(dataStackedLineChart, (d) => d.year),
    d3.max(dataStackedLineChart, (d) => d.year),
  ])
  .range([0, widthStackedLineChart]);

var yStackedLineChart = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(dataStackedLineChart, (d) => d.value1 + d.value2 + d.value3),
  ])
  .range([heightStackedLineChart, 0]);

// Create line generators for each data series
var line1StackedLineChart = d3
  .line()
  .x((d) => xStackedLineChart(d.year))
  .y((d) => yStackedLineChart(d.value1));

var line2StackedLineChart = d3
  .line()
  .x((d) => xStackedLineChart(d.year))
  .y((d) => yStackedLineChart(d.value1 + d.value2));

var line3StackedLineChart = d3
  .line()
  .x((d) => xStackedLineChart(d.year))
  .y((d) => yStackedLineChart(d.value1 + d.value2 + d.value3));

// Append the lines to the SVG
svgStackedLineChart
  .append("path")
  .datum(dataStackedLineChart)
  .attr("d", line1StackedLineChart)
  .attr("fill", "none")
  .attr("stroke", "#D38105")
  .attr("stroke-width", 2);

svgStackedLineChart
  .append("path")
  .datum(dataStackedLineChart)
  .attr("d", line2StackedLineChart)
  .attr("fill", "none")
  .attr("stroke", "#000000")
  .attr("stroke-width", 2);

svgStackedLineChart
  .append("path")
  .datum(dataStackedLineChart)
  .attr("d", line3StackedLineChart)
  .attr("fill", "none")
  .attr("stroke", "#FEC774")
  .attr("stroke-width", 2);

// Add X axis with labels and a title
svgStackedLineChart
  .append("g")
  .attr("transform", "translate(0," + heightStackedLineChart + ")")
  .style("font-family", "var(--font-secondary)")
  .call(d3.axisBottom(xStackedLineChart).ticks(6).tickFormat(d3.format("d")))
  .selectAll("text")
  .style("text-anchor", "middle")
  .attr("dy", "1.5em");

svgStackedLineChart
  .append("text")
  .attr(
    "transform",
    "translate(" +
      widthStackedLineChart / 2 +
      "," +
      (heightStackedLineChart + marginStackedLineChart.bottom - 10) +
      ")"
  )
  .style("text-anchor", "middle")
  .text("Year");

// Add Y axis with labels and a title
svgStackedLineChart
  .append("g")
  .style("font-family", "var(--font-secondary)")
  .call(d3.axisLeft(yStackedLineChart).ticks(6))
  .selectAll("text")
  .style("text-anchor", "middle")
  .attr("dx", "-0.5em");

svgStackedLineChart
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - marginStackedLineChart.left)
  .attr("x", 0 - heightStackedLineChart / 2)
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Value");

// Add a chart title

svgStackedLineChart
  .append("text")
  .attr("x", widthStackedLineChart / 2) // Centered horizontally
  .attr("y", -25) // Centered vertically
  .attr("text-anchor", "middle")
  .style("font-size", "30px")
  .style("font-family", "var(--font-primary)") // Use the custom font
  .style("opacity", 0) // Start with opacity set to 0
  .text("Title Goes Here")
  .transition()
  .duration(1000)
  .style("opacity", 1); // Gradually increase opacity for the title
