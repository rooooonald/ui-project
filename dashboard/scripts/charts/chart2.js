// Set the dimensions and margins of the graph
const margin_chart2 = { top: 70, right: 50, bottom: 80, left: 100 };
const containerWidth_chart2 = document.getElementById("chart2").offsetWidth;
const width_chart2 =
  containerWidth_chart2 - margin_chart2.left - margin_chart2.right;
const height_chart2 = 400 - margin_chart2.top - margin_chart2.bottom;

// Append the SVG object to the body of the page
var svg_chart2 = d3
  .select("#chart2")
  .append("svg")
  .attr(
    "viewBox",
    "0 0 " +
      (width_chart2 + margin_chart2.left + margin_chart2.right) +
      " " +
      (height_chart2 + margin_chart2.top + margin_chart2.bottom)
  )
  .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g")
  .attr(
    "transform",
    "translate(" + margin_chart2.left + "," + margin_chart2.top + ")"
  );

d3.csv("/data/chart2.csv").then((data_chart2) => {
  data_chart2.forEach(function (d) {
    d.followers = +d.followers;
    d.likes = +d.likes;
  });

  console.log(data_chart2);
  // Add X axis
  var x_chart2 = d3
    .scaleLinear()
    .domain([0, 250000000 / 1000000]) // Adjust the upper bound for more space
    .range([0, width_chart2]);
  svg_chart2
    .append("g")
    .attr("class", "text-md")
    .style("font-family", "var(--font-secondary)")
    .attr("transform", "translate(0," + height_chart2 + ")")
    .call(d3.axisBottom(x_chart2));

  // Add Y axis
  var y_chart2 = d3
    .scaleLinear()
    .domain([0, 2300000000 / 1000000])
    .range([height_chart2, 0]);
  svg_chart2
    .append("g")
    .attr("class", "text-md")
    .style("font-family", "var(--font-secondary)")
    .call(d3.axisLeft(y_chart2));

  // Add axis labels
  svg_chart2
    .append("text")
    .attr("x", width_chart2 / 2)
    .attr("y", height_chart2 + 50)
    .style("fill", "black")
    .style("font-family", "var(--font-primary)")
    .style("text-anchor", "middle")
    .text("Followers (million)");

  svg_chart2
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height_chart2 / 2)
    .attr("y", -70)
    .style("fill", "black")
    .style("font-family", "var(--font-primary)")
    .style("text-anchor", "middle")
    .text("Likes (million)");

  // Define your desired color palette
  var colorPalette_chart2 = d3
    .scaleOrdinal()
    .domain(["setosa", "versicolor"])
    .range(["#FFBD59", "#F99D1C"]); // Replace with your desired colors

  const tooltip_chart2 = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Add dots
  var myCircle_chart2 = svg_chart2
    .append("g")
    .selectAll("circle")
    .data(data_chart2)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x_chart2(d.followers / 1000000);
    })
    .attr("cy", function (d) {
      return y_chart2(d.likes / 1000000);
    })
    .attr("r", 5) // Set a fixed radius for all dots
    .style("fill", function (d) {
      return colorPalette_chart2(d.Species);
    }) // Use the new color palette
    .style("opacity", 0.5);

  // Add brushing
  svg_chart2.call(
    d3
      .brush()
      .extent([
        [0, 0],
        [width_chart2, height_chart2],
      ])
      .on("start brush", updateChart_chart2)
  );

  // Function that is triggered when brushing is performed
  function updateChart_chart2(event) {
    var extent_chart2 = event.selection;
    myCircle_chart2.classed("selected-chart2", function (d_chart2) {
      return isBrushed_chart2(
        extent_chart2,
        x_chart2(d_chart2.followers / 1000000),
        y_chart2(d_chart2.likes / 1000000)
      );
    });
  }

  // A function that returns TRUE or FALSE according to if a dot is in the selection or not
  function isBrushed_chart2(brush_coords_chart2, cx_chart2, cy_chart2) {
    var x0_chart2 = brush_coords_chart2[0][0],
      x1_chart2 = brush_coords_chart2[1][0],
      y0_chart2 = brush_coords_chart2[0][1],
      y1_chart2 = brush_coords_chart2[1][1];
    return (
      x0_chart2 <= cx_chart2 &&
      cx_chart2 <= x1_chart2 &&
      y0_chart2 <= cy_chart2 &&
      cy_chart2 <= y1_chart2
    );
  }

  svg_chart2
    .append("text")
    .attr("x", width_chart2 / 2) // Centered horizontally
    .attr("y", -25) // Centered vertically
    .attr("text-anchor", "middle")
    .attr("class", "chart-title-full")
    .style("font-family", "var(--font-primary)") // Use the custom font
    .style("fill", "black")
    .text("Relationship between the Likes and Followers");
});
