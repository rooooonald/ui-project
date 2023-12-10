const renderChart2 = (mode) => {
  const chart2BtnGrp = document.querySelectorAll(".chart2-btnGrp");

  for (let button of chart2BtnGrp) {
    button.classList.remove("alert-btn");
    button.value === mode && button.classList.add("alert-btn");
  }

  d3.select("#chart2").selectAll("*").remove();

  // Set the dimensions and margins of the graph
  const margin_chart2 = { top: 70, right: 50, bottom: 80, left: 100 };
  const containerWidth_chart2 = document.getElementById("chart2").offsetWidth;
  const width_chart2 =
    containerWidth_chart2 - margin_chart2.left - margin_chart2.right;
  const height_chart2 = 500 - margin_chart2.top - margin_chart2.bottom;

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

  d3.csv("/dashboard/data/chart2.csv").then((data_chart2) => {
    data_chart2.forEach(function (d) {
      d.followers = +d.followers;
      d.likes = +d.likes;
    });

    // Add X axis
    var x_chart2 = d3
      .scaleLinear()
      .domain([0, 250000000 / 1000000]) // Adjust the upper bound for more space
      .range([0, width_chart2]);

    // Add Y axis
    var y_chart2 = d3
      .scaleLinear()
      .domain([0, 2300000000 / 1000000])
      .range([height_chart2, 0]);

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

    // Define color palette
    var colorPalette_chart2 = d3
      .scaleOrdinal()
      .domain(["setosa", "versicolor"])
      .range(["#FFBD59", "#F99D1C"]);

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

    if (mode === "brush") {
      svg_chart2
        .append("g")
        .attr("class", "x-axis text-md")
        .style("font-family", "var(--font-secondary)")
        .attr("transform", "translate(0," + height_chart2 + ")")
        .call(d3.axisBottom(x_chart2).ticks(5));

      svg_chart2
        .append("g")
        .attr("class", "y-axis text-md")
        .style("font-family", "var(--font-secondary)")
        .call(d3.axisLeft(y_chart2));

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
    } else {
      // Add zoom functionality
      var zoom = d3
        .zoom()
        .scaleExtent([0.5, 5]) // Adjust the zoom scale limits
        .on("zoom", zoomed);

      svg_chart2.call(zoom);

      // Add a rect element for zooming
      svg_chart2
        .append("rect")
        .attr("width", width_chart2)
        .attr("height", height_chart2)
        .style("fill", "none")
        .attr("cursor", "zoom-in")
        .style("pointer-events", "all") // This allows the rect to capture events
        .call(zoom); // Attach zoom behavior to the rect

      function zoomed(event) {
        var new_x_scale = event.transform.rescaleX(x_chart2);
        var new_y_scale = event.transform.rescaleY(y_chart2);

        // Update the scatter plot circles
        myCircle_chart2
          .attr("cx", function (d) {
            var newX = new_x_scale(d.followers / 1000000);
            return newX < 0 || newX > width_chart2 ? null : newX;
          })
          .attr("cy", function (d) {
            var newY = new_y_scale(d.likes / 1000000);
            return newY < 0 || newY > height_chart2 ? null : newY;
          })
          .style("display", function (d) {
            // Set display to "none" for dots outside the chart boundaries
            var newX = new_x_scale(d.followers / 1000000);
            var newY = new_y_scale(d.likes / 1000000);
            return newX < 0 ||
              newX > width_chart2 ||
              newY < 0 ||
              newY > height_chart2
              ? "none"
              : "initial";
          });

        // Update the X and Y axes
        svg_chart2.select(".x-axis").call(d3.axisBottom(new_x_scale).ticks(5));
        svg_chart2.select(".y-axis").call(d3.axisLeft(new_y_scale));
      }

      svg_chart2
        .append("g")
        .attr("class", "x-axis text-md")
        .style("font-family", "var(--font-secondary)")
        .attr("transform", "translate(0," + height_chart2 + ")")
        .call(d3.axisBottom(x_chart2).ticks(5));

      svg_chart2
        .append("g")
        .attr("class", "y-axis text-md")
        .style("font-family", "var(--font-secondary)")
        .call(d3.axisLeft(y_chart2));
    }

    svg_chart2
      .append("text")
      .attr("x", width_chart2 / 2)
      .attr("y", -25)
      .attr("text-anchor", "middle")
      .attr("class", "chart-title-full")
      .style("font-family", "var(--font-primary)")
      .style("fill", "black")
      .text("Relationship between the Likes and Followers");
  });
};

renderChart2("brush");
