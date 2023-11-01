// Sample data for the line chart (Market Value of football clubs)
var dataLineChart = [
  { year: 2010, marketValue: 150 },
  { year: 2011, marketValue: 200 },
  { year: 2012, marketValue: 180 },
  { year: 2013, marketValue: 300 },
  { year: 2014, marketValue: 240 },
  { year: 2015, marketValue: 350 },
];

// Set the dimensions for the line chart
var marginLineChart = { top: 70, right: 30, bottom: 50, left: 60 };
var widthLineChart = 600 - marginLineChart.left - marginLineChart.right;
var heightLineChart = 400 - marginLineChart.top - marginLineChart.bottom;

// Append the SVG object to the body of the page
var svgLineChart = d3
  .select("#line-chart")
  .append("svg")
  .attr("width", widthLineChart + marginLineChart.left + marginLineChart.right)
  .attr(
    "height",
    heightLineChart + marginLineChart.top + marginLineChart.bottom
  )
  .append("g")
  .attr(
    "transform",
    "translate(" + marginLineChart.left + "," + marginLineChart.top + ")"
  );

// Define scales for X and Y axes
var xLineChart = d3
  .scaleLinear()
  .domain([
    d3.min(dataLineChart, (d) => d.year),
    d3.max(dataLineChart, (d) => d.year),
  ])
  .range([0, widthLineChart]);

var yLineChart = d3
  .scaleLinear()
  .domain([0, d3.max(dataLineChart, (d) => d.marketValue)])
  .range([heightLineChart, 0]);

// Create the line generator
var lineLineChart = d3
  .line()
  .x((d) => xLineChart(d.year))
  .y((d) => yLineChart(d.marketValue));

// Append the line to the SVG
svgLineChart
  .append("path")
  .datum(dataLineChart)
  .attr("d", lineLineChart)
  .attr("fill", "none")
  .attr("stroke", "var(--color-primary")
  .attr("stroke-width", 2);

// Add X axis with labels and a title
svgLineChart
  .append("g")
  .attr("transform", "translate(0," + heightLineChart + ")")
  .style("font-family", "var(--font-secondary)")
  .call(d3.axisBottom(xLineChart).ticks(6).tickFormat(d3.format("d")))
  .selectAll("text")
  .style("text-anchor", "middle")
  .attr("dy", "1.5em");

svgLineChart
  .append("text")
  .attr(
    "transform",
    "translate(" +
      widthLineChart / 2 +
      "," +
      (heightLineChart + marginLineChart.bottom - 10) +
      ")"
  )
  .style("text-anchor", "middle")
  .text("Year");

// Add Y axis with labels and a title
svgLineChart
  .append("g")
  .style("font-family", "var(--font-secondary)")
  .call(d3.axisLeft(yLineChart).ticks(6))
  .selectAll("text")
  .style("text-anchor", "middle")
  .attr("dx", "-0.5em");

svgLineChart
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - marginLineChart.left)
  .attr("x", 0 - heightLineChart / 2)
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Market Value (Millions)");

// Add a chart title

svgLineChart
  .append("text")
  .attr("x", widthLineChart / 2) // Centered horizontally
  .attr("y", -25) // Centered vertically
  .attr("text-anchor", "middle")
  .style("font-size", "30px")
  .style("font-family", "var(--font-primary)") // Use the custom font
  .style("opacity", 0) // Start with opacity set to 0
  .text("Title Goes Here")
  .transition()
  .duration(1000)
  .style("opacity", 1); // Gradually increase opacity for the title
