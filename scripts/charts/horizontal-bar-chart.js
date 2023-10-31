// Sample data for the horizontal bar chart (City populations in millions)
var dataHorizontalBarChart = [
  { City: "New York", Population: 8.4 },
  { City: "Los Angeles", Population: 3.9 },
  { City: "Chicago", Population: 2.7 },
  { City: "Houston", Population: 2.3 },
  { City: "Phoenix", Population: 1.7 },
];

// Set the dimensions and margins for the horizontal bar chart
var marginHorizontalBarChart = { top: 70, right: 30, bottom: 40, left: 90 };
var widthHorizontalBarChart =
  460 - marginHorizontalBarChart.left - marginHorizontalBarChart.right;
var heightHorizontalBarChart =
  400 - marginHorizontalBarChart.top - marginHorizontalBarChart.bottom;

// Append the svg object for the horizontal bar chart to the body of the page
var svgHorizontalBarChart = d3
  .select("#horizontal-bar-chart")
  .append("svg")
  .attr(
    "width",
    widthHorizontalBarChart +
      marginHorizontalBarChart.left +
      marginHorizontalBarChart.right
  )
  .attr(
    "height",
    heightHorizontalBarChart +
      marginHorizontalBarChart.top +
      marginHorizontalBarChart.bottom
  )
  .append("g")
  .attr(
    "transform",
    "translate(" +
      marginHorizontalBarChart.left +
      "," +
      marginHorizontalBarChart.top +
      ")"
  );

// Create the horizontal bars
var xHorizontalBarChart = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(dataHorizontalBarChart, function (d) {
      return d.Population;
    }),
  ])
  .range([0, widthHorizontalBarChart]);

var yHorizontalBarChart = d3
  .scaleBand()
  .range([0, heightHorizontalBarChart])
  .domain(
    dataHorizontalBarChart.map(function (d) {
      return d.City;
    })
  )
  .padding(0.1);

svgHorizontalBarChart
  .append("g")
  .style("font-family", "var(--secondary-font)")
  .call(d3.axisLeft(yHorizontalBarChart));

var barsHorizontalBarChart = svgHorizontalBarChart
  .selectAll("rect")
  .data(dataHorizontalBarChart)
  .enter()
  .append("rect")
  .attr("x", 0)
  .attr("y", function (d) {
    return yHorizontalBarChart(d.City);
  })
  .attr("width", 0)
  .attr("height", yHorizontalBarChart.bandwidth())
  .attr("fill", "#D38105");

// Add animation to the bars
barsHorizontalBarChart
  .transition()
  .duration(800)
  .attr("width", function (d) {
    return xHorizontalBarChart(d.Population);
  });

svgHorizontalBarChart
  .append("text")
  .attr("x", widthHorizontalBarChart / 2) // Centered horizontally
  .attr("y", -25) // Centered vertically
  .attr("text-anchor", "middle")
  .style("font-size", "30px")
  .style("font-family", "Signika Negative, sans-serif") // Use the custom font
  .style("opacity", 0) // Start with opacity set to 0
  .text("Title Goes Here")
  .transition()
  .duration(1000)
  .style("opacity", 1); // Gradually increase opacity for the title
