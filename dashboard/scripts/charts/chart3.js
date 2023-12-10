const renderChart3 = () => {
  // Remove existing chart
  d3.select("#chart3").selectAll("*").remove();

  d3.csv("/data/chart3.csv").then((data_chart3) => {
    // Chart dimensions
    const margin_chart3 = { top: 45, right: 60, bottom: 100, left: 60 };
    var width_chart3 = 460 - margin_chart3.left - margin_chart3.right;
    var height_chart3 = 300 - margin_chart3.top - margin_chart3.bottom;

    var tooltip_chart3 = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Create SVG with responsive viewbox
    const svg_chart3 = d3
      .select("#chart3")
      .append("svg")
      .attr(
        "viewBox",
        `0 0 ${width_chart3 + margin_chart3.left + margin_chart3.right} ${
          height_chart3 + margin_chart3.top + margin_chart3.bottom
        }`
      )
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr(
        "transform",
        `translate(${margin_chart3.left},${margin_chart3.top})`
      );

    // X scale
    const x_chart3 = d3
      .scaleBand()
      .domain(data_chart3.map((d) => d.country))
      .range([0, width_chart3])
      .padding(0.1);

    // Y scale
    const y_chart3 = d3
      .scaleLinear()
      .domain([0, 40])
      .nice()
      .range([height_chart3, 0]);

    // Mouseover function for tooltip
    var mouseover_chart3 = function (event_chart3, d_chart3) {
      tooltip_chart3.style("opacity", 1);
      tooltip_chart3
        .html(
          `<strong>${d_chart3.country}</strong><br>${d_chart3.count} ${
            d_chart3.count > 1 ? "Channels" : "Channel"
          }`
        )
        .style("left", event_chart3.pageX + "px")
        .style("top", event_chart3.pageY - 50 + "px");
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke-width", "2px")
        .style("fill", "#D38105")
        .style("opacity", 1);
    };

    // Mouseleave function for tooltip
    var mouseleave_chart3 = function () {
      tooltip_chart3.style("opacity", 0);
      d3.select(this)
        .transition()
        .duration(200)
        .style("stroke-width", "2px")
        .style("fill", "#FFBD59");
    };

    // Create bars with animation
    svg_chart3
      .selectAll(".bar")
      .data(data_chart3)
      .enter()
      .append("rect")
      .on("mouseover", mouseover_chart3)
      .on("mouseleave", mouseleave_chart3)
      .attr("class", "bar-chart3")
      .attr("x", (d) => x_chart3(d.country))
      .attr("y", height_chart3) // Start the bars at the bottom of the chart
      .attr("width", x_chart3.bandwidth())
      .attr("height", 0) // Start the bars with zero height
      .transition() // Apply transition
      .duration(1000) // Duration of the animation in milliseconds
      .delay((d, i) => i * 100) // Delay each bar's animation
      .attr("y", (d) => y_chart3(d.count))
      .attr("height", (d) => height_chart3 - y_chart3(d.count));

    // Add X axis
    svg_chart3
      .append("g")
      .attr("transform", `translate(0,${height_chart3})`)
      .attr("class", "text-xxs")
      .style("font-family", "var(--font-secondary)")
      .call(d3.axisBottom(x_chart3))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Add X axis title
    svg_chart3
      .append("text")
      .attr(
        "transform",
        `translate(${width_chart3 / 2},${
          height_chart3 + margin_chart3.bottom - 20
        })`
      )
      .style("text-anchor", "middle")
      .attr("class", "text-xxs")
      .style("font-family", "var(--font-primary)")
      .text("Countries");

    // Add Y axis
    svg_chart3
      .append("g")
      .attr("class", "text-xxs")
      .style("font-family", "var(--font-secondary)")
      .call(d3.axisLeft(y_chart3).ticks(5));

    // Add Y axis title
    svg_chart3
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 10 - margin_chart3.left)
      .attr("x", 0 - height_chart3 / 2)
      .attr("dy", "1em")
      .attr("class", "text-xxs")
      .style("font-family", "var(--font-primary)")
      .style("text-anchor", "middle")
      .text("Amount");

    //Title
    svg_chart3
      .append("text")
      .attr("x", width_chart3 / 2)
      .attr("y", -margin_chart3.top / 2)
      .attr("text-anchor", "middle")
      .attr("class", "chart-title-half")
      .style("font-family", "var(--font-primary)")
      .text("Number of YouTubers in Top 100 List in Each Country");
  });
};

document.addEventListener("aos:in:chart3", () => {
  renderChart3();
});
