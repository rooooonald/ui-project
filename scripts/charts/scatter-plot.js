// Set the dimensions and margins of the scatter plot
var marginScatterPlot = { top: 70, right: 30, bottom: 30, left: 60 },
  widthScatterPlot = 460 - marginScatterPlot.left - marginScatterPlot.right,
  heightScatterPlot = 400 - marginScatterPlot.top - marginScatterPlot.bottom;

// Your new data array with 10 different data points
var scatterPlotData = [
  { Sepal_Length: 5.1, Petal_Length: 1.4, Species: "setosa" },
  { Sepal_Length: 6.2, Petal_Length: 4.5, Species: "versicolor" },
  { Sepal_Length: 6.7, Petal_Length: 5.8, Species: "virginica" },
  { Sepal_Length: 5.6, Petal_Length: 3.9, Species: "setosa" },
  { Sepal_Length: 7.0, Petal_Length: 5.1, Species: "versicolor" },
  { Sepal_Length: 6.3, Petal_Length: 6.0, Species: "virginica" },
  { Sepal_Length: 4.9, Petal_Length: 1.5, Species: "setosa" },
  { Sepal_Length: 5.8, Petal_Length: 4.0, Species: "versicolor" },
  { Sepal_Length: 7.1, Petal_Length: 5.9, Species: "virginica" },
  { Sepal_Length: 4.8, Petal_Length: 1.4, Species: "setosa" },
];

// Append the svg object to the body of the page
var svgScatterPlot = d3
  .select("#scatter-plot")
  .append("svg")
  .attr(
    "width",
    widthScatterPlot + marginScatterPlot.left + marginScatterPlot.right
  )
  .attr(
    "height",
    heightScatterPlot + marginScatterPlot.top + marginScatterPlot.bottom
  )
  .append("g")
  .attr(
    "transform",
    "translate(" + marginScatterPlot.left + "," + marginScatterPlot.top + ")"
  );

// Replace the data reading part with your scatterPlotData
// Add X axis
var xScatterPlot = d3.scaleLinear().domain([4, 8]).range([0, widthScatterPlot]);
svgScatterPlot
  .append("g")
  .style("font-family", "var(--font-secondary)")
  .attr("transform", "translate(0," + heightScatterPlot + ")")
  .call(d3.axisBottom(xScatterPlot));

// Add Y axis
var yScatterPlot = d3
  .scaleLinear()
  .domain([0, 9])
  .range([heightScatterPlot, 0]);

svgScatterPlot
  .append("g")
  .style("font-family", "var(--font-secondary)")
  .call(d3.axisLeft(yScatterPlot));

// Color scale: give me a species name, I return a color
var colorScatterPlot = d3
  .scaleOrdinal()
  .domain(["grandis", "meteor", "black"])
  .range(["#fed18d", "#d38105", "#000000"]);

// Add dots
svgScatterPlot
  .append("g")
  .selectAll("dot")
  .data(scatterPlotData) // Use your scatterPlotData
  .enter()
  .append("circle")
  .attr("cx", function (d) {
    return xScatterPlot(d.Sepal_Length);
  })
  .attr("cy", function (d) {
    return yScatterPlot(d.Petal_Length);
  })
  .attr("r", 5)
  .style("fill", function (d) {
    return colorScatterPlot(d.Species);
  });

svgScatterPlot
  .append("text")
  .attr("x", widthScatterPlot / 2) // Centered horizontally
  .attr("y", -25) // Centered vertically
  .attr("text-anchor", "middle")
  .style("font-size", "30px")
  .style("font-family", "var(--font-primary)") // Use the custom font
  .style("opacity", 0) // Start with opacity set to 0
  .text("Title Goes Here")
  .transition()
  .duration(1000)
  .style("opacity", 1); // Gradually increase opacity for the title
