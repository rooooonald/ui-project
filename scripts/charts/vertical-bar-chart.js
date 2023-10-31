// Sample data as an array of objects
var dataVerticalBarChart = [
  { Country: "USA", Value: 8500 },
  { Country: "Canada", Value: 6000 },
  { Country: "Mexico", Value: 4500 },
  { Country: "Brazil", Value: 7200 },
  { Country: "Argentina", Value: 5800 },
];

// Set the dimensions and margins of the graph
var marginVerticalBarChart = { top: 70, right: 30, bottom: 70, left: 40 };
var widthVerticalBarChart =
  460 - marginVerticalBarChart.left - marginVerticalBarChart.right;
var heightVerticalBarChart =
  450 - marginVerticalBarChart.top - marginVerticalBarChart.bottom;

// Append the SVG object to the body of the page
var svgVerticalBarChart = d3
  .select("#vertical-bar-chart")
  .append("svg")
  .attr(
    "width",
    widthVerticalBarChart +
      marginVerticalBarChart.left +
      marginVerticalBarChart.right
  )
  .attr(
    "height",
    heightVerticalBarChart +
      marginVerticalBarChart.top +
      marginVerticalBarChart.bottom
  )
  .append("g")
  .attr(
    "transform",
    "translate(" +
      marginVerticalBarChart.left +
      "," +
      marginVerticalBarChart.top +
      ")"
  );

// X axis
var xVerticalBarChart = d3
  .scaleBand()
  .range([0, widthVerticalBarChart])
  .domain(
    dataVerticalBarChart.map(function (d) {
      return d.Country;
    })
  )
  .padding(0.2);
svgVerticalBarChart
  .append("g")
  .attr("transform", "translate(0," + heightVerticalBarChart + ")")
  .style("font-family", "var(--secondary-font)")
  .call(d3.axisBottom(xVerticalBarChart))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

// Add Y axis
var yVerticalBarChart = d3
  .scaleLinear()
  .domain([0, 13000])
  .range([heightVerticalBarChart, 0]);
svgVerticalBarChart
  .append("g")
  .style("font-family", "var(--secondary-font)")
  .call(d3.axisLeft(yVerticalBarChart));

// Bars
svgVerticalBarChart
  .selectAll("mybar")
  .data(dataVerticalBarChart)
  .enter()
  .append("rect")
  .attr("x", function (d) {
    return xVerticalBarChart(d.Country);
  })
  .attr("width", xVerticalBarChart.bandwidth())
  .attr("fill", "#FFBD59")
  // no bar at the beginning thus:
  .attr("height", function (d) {
    return heightVerticalBarChart - yVerticalBarChart(0);
  }) // always equal to 0
  .attr("y", function (d) {
    return yVerticalBarChart(0);
  });

// Animation
svgVerticalBarChart
  .selectAll("rect")
  .transition()
  .duration(800)
  .attr("y", function (d) {
    return yVerticalBarChart(d.Value);
  })
  .attr("height", function (d) {
    return heightVerticalBarChart - yVerticalBarChart(d.Value);
  })
  .delay(function (d, i) {
    console.log(i);
    return i * 100;
  });

svgVerticalBarChart
  .append("text")
  .attr("x", widthVerticalBarChart / 2) // Centered horizontally
  .attr("y", -25) // Centered vertically
  .attr("text-anchor", "middle")
  .style("font-size", "30px")
  .style("font-family", "Signika Negative, sans-serif") // Use the custom font
  .style("opacity", 0) // Start with opacity set to 0
  .text("Title Goes Here")
  .transition()
  .duration(1000)
  .style("opacity", 1); // Gradually increase opacity for the title
