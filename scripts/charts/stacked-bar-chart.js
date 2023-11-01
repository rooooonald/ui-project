// Sample data for the vertical stacked bar chart (City populations in millions by Male, Female, and Other)
var dataStackedBarChart = [
  { city: "New York", male: 4.2, female: 4.2, other: 0.5 },
  { city: "Los Angeles", male: 2.0, female: 1.9, other: 0.3 },
  { city: "Chicago", male: 1.3, female: 1.4, other: 0.2 },
  { city: "Houston", male: 1.1, female: 1.2, other: 0.1 },
  { city: "Phoenix", male: 0.8, female: 0.9, other: 0.15 },
];

// Set the dimensions and margins for the vertical stacked bar chart
var marginStackedBarChart = { top: 70, right: 30, bottom: 60, left: 60 };
var widthStackedBarChart =
  400 - marginStackedBarChart.left - marginStackedBarChart.right;
var heightStackedBarChart =
  400 - marginStackedBarChart.top - marginStackedBarChart.bottom;

// Append the svg object for the vertical stacked bar chart to the body of the page
var svgStackedBarChart = d3
  .select("#stacked-bar-chart")
  .append("svg")
  .attr(
    "width",
    widthStackedBarChart +
      marginStackedBarChart.left +
      marginStackedBarChart.right
  )
  .attr(
    "height",
    heightStackedBarChart +
      marginStackedBarChart.top +
      marginStackedBarChart.bottom
  )
  .append("g")
  .attr(
    "transform",
    "translate(" +
      marginStackedBarChart.left +
      "," +
      marginStackedBarChart.top +
      ")"
  );

// Create the scales for the chart
var xStackedBarChart = d3
  .scaleBand()
  .range([0, widthStackedBarChart])
  .domain(
    dataStackedBarChart.map(function (d) {
      return d.city;
    })
  )
  .padding(0.1);

var yStackedBarChart = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(dataStackedBarChart, function (d) {
      return d.male + d.female + d.other;
    }),
  ])
  .range([heightStackedBarChart, 0]);

// Create the bars for the "Male" category
svgStackedBarChart
  .selectAll(".male-bar")
  .data(dataStackedBarChart)
  .enter()
  .append("rect")
  .attr("class", "male-bar")
  .attr("x", function (d) {
    return xStackedBarChart(d.city);
  })
  .attr("y", function (d) {
    return yStackedBarChart(d.male);
  })
  .attr("width", xStackedBarChart.bandwidth())
  .attr("height", function (d) {
    return heightStackedBarChart - yStackedBarChart(d.male);
  })
  .attr("fill", "#D38105");

// Create the bars for the "Female" category
svgStackedBarChart
  .selectAll(".female-bar")
  .data(dataStackedBarChart)
  .enter()
  .append("rect")
  .attr("class", "female-bar")
  .attr("x", function (d) {
    return xStackedBarChart(d.city);
  })
  .attr("y", function (d) {
    return yStackedBarChart(d.male + d.female);
  })
  .attr("width", xStackedBarChart.bandwidth())
  .attr("height", function (d) {
    return heightStackedBarChart - yStackedBarChart(d.female);
  })
  .attr("fill", "#FCAB32");

// Create the bars for the "Other" category
svgStackedBarChart
  .selectAll(".other-bar")
  .data(dataStackedBarChart)
  .enter()
  .append("rect")
  .attr("class", "other-bar")
  .attr("x", function (d) {
    return xStackedBarChart(d.city);
  })
  .attr("y", function (d) {
    return yStackedBarChart(d.male + d.female + d.other);
  })
  .attr("width", xStackedBarChart.bandwidth())
  .attr("height", function (d) {
    return heightStackedBarChart - yStackedBarChart(d.other);
  })
  .attr("fill", "#FED18D");

// Add X-axis
svgStackedBarChart
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(0," + heightStackedBarChart + ")")
  .style("font-family", "var(--font-secondary)")
  .call(d3.axisBottom(xStackedBarChart));

// Add Y-axis
svgStackedBarChart
  .append("g")
  .attr("class", "y-axis")
  .style("font-family", "var(--font-secondary)")
  .call(d3.axisLeft(yStackedBarChart));

// Add axis labels
svgStackedBarChart
  .append("text")
  .attr("x", widthStackedBarChart / 2)
  .attr("y", heightStackedBarChart + 40)
  .style("text-anchor", "middle")
  .text("Cities");

svgStackedBarChart
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -heightStackedBarChart / 2)
  .attr("y", -30)
  .style("text-anchor", "middle")
  .text("Population (Millions)");

svgStackedBarChart
  .append("text")
  .attr("x", widthStackedBarChart / 2) // Centered horizontally
  .attr("y", -25) // Centered vertically
  .attr("text-anchor", "middle")
  .style("font-size", "30px")
  .style("font-family", "var(--font-primary)") // Use the custom font
  .style("opacity", 0) // Start with opacity set to 0
  .text("Title Goes Here")
  .transition()
  .duration(1000)
  .style("opacity", 1); // Gradually increase opacity for the title
