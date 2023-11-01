// Set the dimensions and margins of the graph
var marginAreaChart = { top: 70, right: 30, bottom: 30, left: 50 };
var widthAreaChart = 460 - marginAreaChart.left - marginAreaChart.right;
var heightAreaChart = 400 - marginAreaChart.top - marginAreaChart.bottom;

// Append the svg object to the body of the page
var svgAreaChart = d3
  .select("#area-chart")
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

// Sample data
var dataAreaChart = [
  { date: new Date("2023-01-01"), value: 10 },
  { date: new Date("2023-02-01"), value: 15 },
  { date: new Date("2023-03-01"), value: 12 },
  { date: new Date("2023-04-01"), value: 18 },
  { date: new Date("2023-05-01"), value: 14 },
  { date: new Date("2023-06-01"), value: 20 },
];

// Add X axis
var xAreaChart = d3
  .scaleTime()
  .domain(
    d3.extent(dataAreaChart, function (d) {
      return d.date;
    })
  )
  .range([0, widthAreaChart]);
svgAreaChart
  .append("g")
  .attr("transform", "translate(0," + heightAreaChart + ")")
  .style("font-family", "var(--font-secondary)")
  .call(d3.axisBottom(xAreaChart));

// Add Y axis
var yAreaChart = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(dataAreaChart, function (d) {
      return d.value;
    }),
  ])
  .range([heightAreaChart, 0]);
svgAreaChart
  .append("g")
  .style("font-family", "var(--font-secondary)")
  .call(d3.axisLeft(yAreaChart));

// Add the area
svgAreaChart
  .append("path")
  .datum(dataAreaChart)
  .attr("fill", "#ffbd59")
  //   .attr("stroke", "#000000")
  //   .attr("stroke-width", 1.5)
  .attr(
    "d",
    d3
      .area()
      .x(function (d) {
        return xAreaChart(d.date);
      })
      .y0(yAreaChart(0))
      .y1(function (d) {
        return yAreaChart(d.value);
      })
  );

svgAreaChart
  .append("text")
  .attr("x", widthAreaChart / 2) // Centered horizontally
  .attr("y", -25) // Centered vertically
  .attr("text-anchor", "middle")
  .style("font-size", "30px")
  .style("font-family", "var(--font-primary)") // Use the custom font
  .style("opacity", 0) // Start with opacity set to 0
  .text("Title Goes Here")
  .transition()
  .duration(1000)
  .style("opacity", 1); // Gradually increase opacity for the title
