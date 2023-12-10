const colors_chart1 = [
  "#3a59f2",
  "#5EBB47",
  "#EC4724",
  "#FCAB32",
  "#fe74ee",
  "#D38105",
  "#74e0fe",
  "#c6ff36",
  "#7bb0d1",
  "#000000",
];

// Set the dimensions and margins of the graph
var margin_chart1 = { top: 60, right: 30, bottom: 120, left: 30 };
var width_chart1 = 460 - margin_chart1.left - margin_chart1.right;
var height_chart1 = 400 - margin_chart1.top - margin_chart1.bottom;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius_chart1 = width_chart1 / 3;

// Append the svg object to the div called 'donutGraph'
var svg_chart1 = d3
  .select("#chart1")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr(
    "viewBox",
    "0 0 " +
      (width_chart1 + margin_chart1.left + margin_chart1.right) +
      " " +
      (height_chart1 + margin_chart1.top + margin_chart1.bottom)
  )
  .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g")
  .attr(
    "transform",
    "translate(" + margin_chart1.left + "," + margin_chart1.top + ")"
  );

d3.csv("/data/chart1.csv").then((data_chart1) => {
  // Set the color scale
  var color_chart1 = d3
    .scaleOrdinal()
    .domain(data_chart1.map((d) => d.label))
    .range(colors_chart1);

  // Compute the position of each group on the pie
  var pie_chart1 = d3
    .pie()
    .sort(null) // Do not sort group by size
    .value(function (d) {
      return d.value;
    });

  var data_ready_chart1 = pie_chart1(data_chart1);

  // The arc generator
  var arc_chart1 = d3
    .arc()
    .innerRadius(radius_chart1 * 0.5) // This is the size of the donut hole
    .outerRadius(radius_chart1 * 0.8);

  // Another arc that won't be drawn. Just for labels positioning
  var outerArc_chart1 = d3
    .arc()
    .innerRadius(radius_chart1 * 0.9)
    .outerRadius(radius_chart1 * 0.9);

  // Tooltip div setup

  const tooltip_chart1 = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Mouseover function for tooltip
  var mouseover_chart1 = function (event_chart1, d_chart1) {
    tooltip_chart1.style("opacity", 0.9);
    tooltip_chart1
      .html(`${d_chart1.key}: $${d_chart1.value}`)
      .style("left", event_chart1.pageX + "px")
      .style("top", event_chart1.pageY - 28 + "px");
    d3.select(this)
      .transition()
      .duration(200)
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(radius_chart1 * 0.5)
          .outerRadius(radius_chart1 * 0.9)
      )
      .style("opacity", 1)
      .style("stroke-width", "2px");
  };

  // Mousemove function for tooltip
  var mousemove_chart1 = function (event_chart1, d_chart1) {
    var percentage_chart1 = (
      (d_chart1.data.value / d3.sum(data_chart1, (d) => d.value)) *
      100
    ).toFixed(2);
    tooltip_chart1
      .html(
        `<strong>${d_chart1.data.label}</strong><br>${d_chart1.data.value} channels (${percentage_chart1}%)`
      )
      .style("left", event_chart1.pageX + 10 + "px")
      .style("top", event_chart1.pageY + "px");
  };

  // Mouseleave function for tooltip
  var mouseleave_chart1 = function (d) {
    tooltip_chart1.style("opacity", 0);
    d3.select(this)
      .transition()
      .duration(500)
      .attr("d", arc_chart1)
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("stroke", "white");
  };

  // Create the donut chart
  svg_chart1
    .selectAll("allSlices")
    .data(data_ready_chart1)
    .enter()
    .append("path")
    .attr("d", arc_chart1)
    .attr("fill", function (d) {
      return color_chart1(d.data.label);
    })
    .attr("stroke", "white")
    .attr("class", "chart1-slice")
    .style("stroke-width", "2px")
    .attr("transform", `translate(200,100)`)
    .on("mouseover", mouseover_chart1)
    .on("mousemove", mousemove_chart1)
    .on("mouseleave", mouseleave_chart1)
    .transition() // Apply a transition
    .duration(1000) // Set the duration of the transition
    .attrTween("d", function (d) {
      var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
      return function (t) {
        d.endAngle = i(t);
        return arc_chart1(d);
      };
    });

  // Legend and title
  var legend_chart1 = svg_chart1
    .selectAll("legend")
    .data(data_ready_chart1)
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
      let x = (i % 3) * 140 + 10;
      let y = Math.floor(i / 3) * 30 + height_chart1 + 10;
      return "translate(" + x + "," + y + ")";
    });

  legend_chart1
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("rx", 2)
    .attr("ry", 2)
    .style("fill", function (d) {
      return color_chart1(d.data.label);
    });

  legend_chart1
    .append("text")
    .attr("x", 30)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function (d) {
      return d.data.label;
    })
    .style("font-family", "Montserrat, sans-serif")
    .style("font-size", "10px")
    .attr("cursor", "pointer")
    .on("mouseover", function (event_legend, d_legend) {
      // Dim all  except the one corresponding to the legend item
      svg_chart1
        .selectAll(".chart1-slice")
        .filter(function (d) {
          return d.data.label !== d_legend.data.label;
        })
        .attr("opacity", 0.1);
    })
    // Add mouseout event listener to legend lines
    .on("mouseout", function () {
      // Reset the opacity and stroke-width of all lines
      svg_chart1.selectAll(".chart1-slice").attr("opacity", 1);
    });

  svg_chart1
    .append("text")
    .attr("x", width_chart1 / 2) // Centered horizontally
    .attr("y", -25) // Centered vertically
    .attr("text-anchor", "middle")
    .attr("class", "chart-title-half")
    .style("font-family", "var(--font-primary)") // Use the custom font
    .style("fill", "black")
    .text("Proportion of the top 100 YouTube channels");
});
