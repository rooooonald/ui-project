const renderChart5 = () => {
  // Remove existing chart
  d3.select("#chart5").selectAll("*").remove();

  // set the dimensions and margins of the graph
  var margin_chart5 = { top: 60, right: 30, bottom: 100, left: 90 };
  var width_chart5 = 460 - margin_chart5.left - margin_chart5.right;
  var height_chart5 = 400 - margin_chart5.top - margin_chart5.bottom;

  // append the svg object to the body of the page
  var svg_chart5 = d3
    .select("#chart5")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr(
      "viewBox",
      "0 0 " +
        (width_chart5 + margin_chart5.left + margin_chart5.right) +
        " " +
        (height_chart5 + margin_chart5.top + margin_chart5.bottom)
    )
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr(
      "transform",
      "translate(" + margin_chart5.left + "," + margin_chart5.top + ")"
    );

  d3.csv("/dashboard/data/chart5.csv").then((data_chart5) => {
    // List of subgroups
    var subgroups_chart5 = Object.keys(data_chart5[0]).slice(1);

    // List of groups
    var groups_chart5 = data_chart5.map(function (d) {
      return d.ChannelName;
    });

    // Add X axis
    var x_chart5 = d3
      .scaleLinear()
      .domain([0, 1000000])
      .range([0, width_chart5]);
    svg_chart5
      .append("g")
      .attr("transform", "translate(0," + height_chart5 + ")")
      .attr("class", "text-md")
      .attr("class", "text-secondary-font")
      .call(d3.axisBottom(x_chart5).ticks(5));

    // Add Y axis
    var y_chart5 = d3
      .scaleBand()
      .domain(groups_chart5)
      .range([0, height_chart5])
      .padding(0.4);

    svg_chart5
      .append("g")
      .attr("class", "text-md")
      .attr("class", "text-secondary-font")
      .call(d3.axisLeft(y_chart5));

    // Add axis labels
    svg_chart5
      .append("text")
      .attr("x", width_chart5 / 2)
      .attr("y", height_chart5 + 40)
      .attr("class", "text-xxs")
      .style("font-family", "var(--font-primary)")
      .style("text-anchor", "middle")
      .text("Income (USD)");

    svg_chart5
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height_chart5 / 2)
      .attr("y", -70)
      .attr("class", "text-xxs")
      .style("font-family", "var(--font-primary)")
      .style("text-anchor", "middle")
      .text("Channel");

    // color palette
    var color_chart5 = d3
      .scaleOrdinal()
      .domain(subgroups_chart5)
      .range(["#FED18D", "#FFBD59", "#F99D1C", "#D38105"]);

    const tooltip_chart5 = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Stacked bar chart
    svg_chart5
      .append("g")
      .selectAll("g")
      .data(data_chart5)
      .enter()
      .append("g")
      .attr("transform", function (d) {
        return "translate(0," + y_chart5(d.ChannelName) + ")";
      })
      .selectAll("rect")
      .data(function (d) {
        return subgroups_chart5.map(function (key) {
          return { key: key, value: d[key] };
        });
      })
      .enter()
      .append("rect")
      .attr("class", "chart5-bar")
      .attr("x", 0)
      .attr("y", function (d) {
        return (
          (y_chart5.bandwidth() / subgroups_chart5.length) *
          subgroups_chart5.indexOf(d.key)
        );
      })
      .attr("width", 0)
      .attr("height", y_chart5.bandwidth() / subgroups_chart5.length)
      .attr("fill", function (d) {
        return color_chart5(d.key);
      })
      .on("mouseover", function (event_chart5, d_chart5) {
        d3.select(this).attr("fill", (d) =>
          d3.rgb(color_chart5(d.key)).darker(1)
        );
        // Show the tooltip on hover
        tooltip_chart5.transition().duration(200).style("opacity", 0.9);
        tooltip_chart5
          .html(
            `${d_chart5.key} Income<br>
          <strong>USD ${d_chart5.value}</strong>`
          )
          .style("left", event_chart5.pageX + "px")
          .style("top", event_chart5.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", (d) => d3.rgb(color_chart5(d.key)));
        // Hide the tooltip on mouseout
        tooltip_chart5.transition().duration(500).style("opacity", 0);
      })
      .transition()
      .duration(1000)
      .attr("x", (d_chart5) => y_chart5(d_chart5.count))
      .attr("width", function (d) {
        return x_chart5(d.value);
      });
    // Add legend
    var legend_chart5 = svg_chart5
      .append("g")
      .attr("class", "legend_chart5")
      .attr(
        "transform",
        "translate(" +
          (width_chart5 - color_chart5.domain().length * 100) / 2 +
          "," +
          (height_chart5 + 60) +
          ")"
      );

    legend_chart5
      .selectAll("rect")
      .data(subgroups_chart5)
      .enter()
      .append("rect")
      .attr("x", function (d, i) {
        return i * 100;
      })
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", function (d) {
        return color_chart5(d);
      });

    legend_chart5
      .selectAll("text")
      .data(subgroups_chart5)
      .enter()
      .append("text")
      .attr("x", function (d, i) {
        return i * 100 + 20;
      })
      .attr("y", 12)
      .text(function (d) {
        return d;
      })
      .attr("fill", function (d) {
        return color_chart5(d);
      })
      .attr("cursor", "pointer")
      .on("mouseover", function (event_legend, d_legend) {
        // Dim all bars except the one corresponding to the legend item
        svg_chart5
          .selectAll(".chart5-bar")
          .attr("opacity", 1)
          .filter(function (d) {
            return d.key !== d_legend;
          })
          .transition() // Apply a transition
          .duration(500)
          .attr("opacity", 0.1);
      })
      // Add mouseout event listener to legend lines
      .on("mouseout", function () {
        // Reset the opacity and stroke-width of all lines
        svg_chart5.selectAll(".chart5-bar").attr("opacity", 1);
      });

    svg_chart5
      .append("text")
      .attr("x", width_chart5 / 2)
      .attr("y", -margin_chart5.top / 2)
      .attr("text-anchor", "middle")
      .attr("class", "chart-title-half")
      .style("font-family", "var(--font-primary)")
      .text("Top 5 YouTube Channels' Quarterly Income");
  });
};

document.addEventListener("aos:in:chart5", () => {
  renderChart5();
});
