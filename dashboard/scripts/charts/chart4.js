// set the dimensions and margins of the graph
var margin_chart4 = { top: 60, right: 30, bottom: 180, left: 60 };
var width_chart4 = 460 - margin_chart4.left - margin_chart4.right;
var height_chart4 = 400 - margin_chart4.top - margin_chart4.bottom;

// append the svg object to the body of the page
var svg_chart4 = d3
  .select("#chart4")
  .append("svg")
  .attr(
    "viewBox",
    `0 0 ${width_chart4 + margin_chart4.left + margin_chart4.right} ${
      height_chart4 + margin_chart4.top + margin_chart4.bottom
    }`
  )
  .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g")
  .attr(
    "transform",
    "translate(" + margin_chart4.left + "," + margin_chart4.top + ")"
  );

d3.csv("/dashboard/data/chart4.csv").then((data) => {
  var parseDate = d3.timeParse("%Y");
  // Add X axis, linear scale since "Year_chart4" is numeric
  var x_chart4 = d3
    .scaleTime()
    .domain(
      d3.extent(data, function (d) {
        return parseDate(d.Year);
      })
    )
    .range([0, width_chart4]);

  svg_chart4
    .append("g")
    .attr("class", "text-md")
    .attr("class", "text-secondary-font")
    .attr("transform", "translate(0," + height_chart4 + ")")
    .call(d3.axisBottom(x_chart4).ticks(5));

  // Add Y axis
  var y_chart4 = d3.scaleLinear().domain([0, 60]).range([height_chart4, 0]);

  svg_chart4
    .append("g")
    .attr("class", "text-md")
    .attr("class", "text-secondary-font")
    .call(d3.axisLeft(y_chart4).ticks(6));

  // Add axis labels
  svg_chart4
    .append("text")
    .attr("x", width_chart4 / 2)
    .attr("y", height_chart4 + 40)
    .attr("class", "text-xxs")
    .style("font-family", "var(--font-primary)")
    .style("text-anchor", "middle")
    .text("Year");

  svg_chart4
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height_chart4 / 2)
    .attr("y", -40)
    .attr("class", "text-xxs")
    .style("font-family", "var(--font-primary)")
    .style("text-anchor", "middle")
    .text("Views (millions)");

  // Color palette
  var color_chart4 = d3
    .scaleOrdinal()
    .range(["#FED18D", "#FEC774", "#FCAB32", "#F99D1C", "#D38105"]);

  const tooltip_chart4 = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Draw the lines
  svg_chart4
    .selectAll(".line_chart4")
    .data(Object.keys(data[0]).slice(1))
    .enter()
    .append("path")
    .attr("class", "line_chart4")
    .attr("fill", "none")
    .attr("stroke", function (d) {
      return color_chart4(d);
    })
    .attr("stroke-width", 2)
    .attr("d", function (key) {
      return d3
        .line()
        .x(function (d) {
          return x_chart4(parseDate(d.Year));
        })
        .y(function (d) {
          return y_chart4(+d[key] / 1000000);
        })(data);
    })
    .on("mouseover", function (event_chart4, d_chart4) {
      d3.select(this).attr("stroke-width", 5);

      // Show the tooltip on hover
      tooltip_chart4.transition().duration(200).style("opacity", 0.9);
      tooltip_chart4
        .html(`<strong>${d_chart4}</strong>`)
        .style("left", event_chart4.pageX + "px")
        .style("top", event_chart4.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("stroke-width", 2);
      // Hide the tooltip on mouseout
      tooltip_chart4.transition().duration(500).style("opacity", 0);
    });

  // Add legend
  var legend_chart4 = svg_chart4
    .append("g")
    .attr("class", "legend_chart4")
    .attr(
      "transform",
      "translate(" +
        (width_chart4 - color_chart4.domain().length * 80) / 2 +
        "," +
        (height_chart4 + 75) +
        ")"
    );

  legend_chart4
    .selectAll("line")
    .data(Object.keys(data[0]).slice(1))
    .enter()
    .append("line")
    .attr("x1", function (d, i) {
      return 0;
    })
    .attr("x2", function (d, i) {
      return 18;
    })
    .attr("y1", function (d, i) {
      return i * 18;
    })
    .attr("y2", function (d, i) {
      return i * 18;
    })
    .style("stroke", function (d) {
      return color_chart4(d);
    })
    .style("stroke-width", 2);

  legend_chart4
    .selectAll("text")
    .data(Object.keys(data[0]).slice(1))
    .enter()
    .append("text")
    .attr("x", function (d, i) {
      return 25;
    })
    .attr("y", function (d, i) {
      return i * 18;
    })
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .attr("class", "text-sm")
    .text(function (d) {
      return d;
    })
    .attr("fill", function (d) {
      return color_chart4(d);
    })
    .attr("cursor", "pointer")
    .on("mouseover", function (event_legend, d_legend) {
      // Dim all lines except the one corresponding to the legend item
      svg_chart4
        .selectAll(".line_chart4")
        .filter(function (d) {
          return d !== d_legend;
        })
        .attr("opacity", 0.1);
      // Highlight the corresponding line
      svg_chart4
        .selectAll(".line_chart4")
        .filter(function (d) {
          return d === d_legend;
        })
        .attr("stroke-width", 5);
    })
    // Add mouseout event listener to legend
    .on("mouseout", function () {
      // Reset the opacity and stroke-width of all lines
      svg_chart4
        .selectAll(".line_chart4")
        .attr("opacity", 1)
        .attr("stroke-width", 2);
    });

  // Add title
  svg_chart4
    .append("text")
    .attr("x", width_chart4 / 2)
    .attr("y", -margin_chart4.top / 2)
    .attr("text-anchor", "middle")
    .attr("class", "chart-title-half")
    .style("font-family", "var(--font-primary)")
    .text("Top 5 YouTube Channels' Average Views");
});
