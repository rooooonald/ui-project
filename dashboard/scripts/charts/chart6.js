const renderChart6 = (country) => {
  const chart6BtnGrp = document.querySelectorAll(".chart6-btnGrp");

  for (let button of chart6BtnGrp) {
    button.classList.remove("alert-btn");
  }

  d3.csv("/dashboard/data/chart6.csv").then((data_chart6) => {
    // Default country
    let selectedCountry_chart6 = "IN";
    if (country) {
      selectedCountry_chart6 = country;
    } else {
      selectedCountry_chart6 = document.getElementById("country_chart6").value;
    }

    // Set up initial chart
    updateChart_chart6(selectedCountry_chart6);

    // Function to update the chart based on the selected country
    function updateChart_chart6(selectedCountry_chart6) {
      // Filter data for the selected country
      const filteredData_chart6 = data_chart6.filter(
        (d_chart6) => d_chart6.country === selectedCountry_chart6
      );

      // Remove existing chart
      d3.select("#chart6").selectAll("*").remove();

      // Create a new chart
      const margin_chart6 = { top: 70, right: 50, bottom: 140, left: 80 };
      const containerWidth_chart6 =
        document.getElementById("chart6").offsetWidth;
      const width_chart6 =
        containerWidth_chart6 - margin_chart6.left - margin_chart6.right;
      const height_chart6 = 400 - margin_chart6.top - margin_chart6.bottom;

      const svg_chart6 = d3
        .select("#chart6")
        .append("svg")
        .attr("viewBox", `0 0 ${containerWidth_chart6} 400`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr(
          "transform",
          "translate(" + margin_chart6.left + "," + margin_chart6.top + ")"
        );

      // Create the x and y scales
      const x_chart6 = d3
        .scaleBand()
        .range([0, width_chart6])
        .padding(0.1)
        .domain(filteredData_chart6.map((d_chart6) => d_chart6.category));

      const y_chart6 = d3
        .scaleLinear()
        .range([height_chart6, 0])
        .domain([0, 20]);

      const tooltip_chart6 = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      // Add bars to the chart with animation
      svg_chart6
        .selectAll(".bar-chart6")
        .data(filteredData_chart6)
        .enter()
        .append("rect")
        .attr("class", "bar-chart6")
        .attr("x", (d_chart6) => x_chart6(d_chart6.category))
        .attr("width", x_chart6.bandwidth())
        .attr("y", height_chart6)
        .attr("height", 0)
        .on("mouseover", function (event_chart6, d_chart6) {
          // Show the tooltip on hover
          tooltip_chart6.transition().duration(200).style("opacity", 0.9);
          tooltip_chart6
            .html(
              `<strong>${d_chart6.category}</strong><br>${d_chart6.count} ${
                d_chart6.count > 1 ? "Channels" : "Channel"
              }`
            )
            .style("left", event_chart6.pageX + "px")
            .style("top", event_chart6.pageY - 28 + "px");
        })
        .on("mouseout", function () {
          // Hide the tooltip on mouseout
          tooltip_chart6.transition().duration(500).style("opacity", 0);
        })
        .transition()
        .duration(1000)
        .attr("y", (d_chart6) => y_chart6(d_chart6.count))
        .attr("height", (d_chart6) => height_chart6 - y_chart6(d_chart6.count));

      // Add x-axis
      svg_chart6
        .append("g")
        .attr("class", "text-md")
        .attr("transform", "translate(0," + height_chart6 + ")")
        .style("font-family", "var(--font-secondary)")
        .call(d3.axisBottom(x_chart6))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      // Add y-axis
      svg_chart6
        .append("g")
        .attr("class", "text-md")
        .style("font-family", "var(--font-secondary)")
        .call(d3.axisLeft(y_chart6).ticks(5));

      // Add axis labels
      svg_chart6
        .append("text")
        .attr("x", width_chart6 / 2)
        .attr("y", height_chart6 + 130)
        .style("font-family", "var(--font-primary)")
        .style("text-anchor", "middle")
        .text("Categories");

      svg_chart6
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height_chart6 / 2)
        .attr("y", -50)
        .style("font-family", "var(--font-primary)")
        .style("text-anchor", "middle")
        .text("Amount");

      svg_chart6
        .append("text")
        .attr("x", width_chart6 / 2) // Centered horizontally
        .attr("y", -25) // Centered vertically
        .attr("text-anchor", "middle")
        .attr("class", "chart-title-full")
        .style("font-family", "var(--font-primary)") // Use the custom font
        .text(
          `Number of YouTube channels in ${formatCountry(
            selectedCountry_chart6
          )} by category`
        );
    }
  });
};

const formatCountry = (countryCode) => {
  let result;
  switch (countryCode) {
    case "BR":
      result = "Brazil";
      break;
    case "BY":
      result = "Belarus";
      break;
    case "CA":
      result = "Canada";
      break;
    case "CL":
      result = "Chile";
      break;
    case "IN":
      result = "India";
      break;
    case "KR":
      result = "South Korea";
      break;
    case "MX":
      result = "Mexico";
      break;
    case "NO":
      result = "Norway";
      break;
    case "PH":
      result = "Philippines";
      break;
    case "PR":
      result = "Puerto Rico";
      break;
    case "RU":
      result = "Russia";
      break;
    case "SV":
      result = "El Salvador";
      break;
    case "TH":
      result = "Thailand";
      break;
    case "US":
      result = "United States";
      break;
    default:
      result = "";
  }

  return result;
};

document.addEventListener("aos:in:chart6", () => {
  renderChart6();
});
