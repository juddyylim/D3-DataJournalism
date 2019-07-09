// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 560;

// Define the chart's margins as an object
var chartMargin = {
  top: 45,
  right: 45,
  bottom: 100,
  left: 45
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.bottom})`);

d3.csv("assets/data/data.csv", function(error, censusData) {
    if (error) throw error;

    console.log(censusData);

    // Step 1: Parse Data/Cast as numbers
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
    })

    // Step 2: Create scale functions
    var xScale = d3.scaleLinear()
        .domain([8, d3.max(censusData, d => d.poverty)])
        .range([0, chartWidth]);

    var yScale = d3.scaleLinear()
        .domain([20, d3.max(censusData, d => d.obesity)])
        .range([chartHeight, 0]);
    
    // Step 3: Create axis functions
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // Step 4: Append axes
    chartGroup.append("g")
        .call(leftAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // Append circles 
    chartGroup.selectAll(".circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.obesity))
        .attr("r", 15)
        .attr("fill", "blue")
        .attr("opacity", ".5");

    chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .selectAll("tspan")
        .data(censusData)
        .enter()
        .append("tspan")
          .attr("x", d => xScale(d.poverty))
          .attr("y", d => yScale(d.obesity))
          .text(d => d.abbr);
    
    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left - 4)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top - 4})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");   
});
