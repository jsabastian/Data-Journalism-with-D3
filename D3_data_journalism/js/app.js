// set the svg and chart parameters
var svgWidth = 960;
var svgHeight = 500;

// borders
var margin = {
  top: 20,
  right: 40,
  bottom: 50,
  left: 100
};

// height and width 
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//div class responsive chart type, append svg height and width
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class","responsive")

// append svg group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// pull the data
d3.csv("data\\data.csv", function(err, csvdata) {

  
  // parse the data
  csvdata.forEach(function(data) {
    data.state = data.state;
    data.abbr = data.abbr;
    data.poverty = parseFloat(data.poverty);
    data.age = parseFloat(data.age);
    data.income = parseInt(data.income);    data.incomeMoe = parseInt(data.incomeMoe);
    data.healthcare = parseFloat(data.healthcare);    data.healthcareHigh = parseFloat(data.healthcareHigh);
    data.obesity = parseFloat(data.obesity);    data.obesityHigh = parseFloat(data.obesityHigh);
    data.smokes = parseFloat(data.smokes);
  });

  // Create scales
  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(csvdata, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(csvdata, d => d.obesity)])
    .range([height, 0]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append x-axis to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  // Append y-axis to the chart
  chartGroup.append("g")
    .call(leftAxis);

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "aText")
    .text("Obesity Rate");

  chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
    .attr("class", "aText")
    .text("Poverty Rate)");

   // Create Circles
  chartGroup.selectAll("text.stateText")
    .data(csvdata)
    .enter()
    .append("text")
    .text((d) => d.abbr)
    .attr("class", "stateText")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity -.35))
    
  var circlesGroup = chartGroup.selectAll("circle")
  .data(csvdata)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.obesity))
  .attr("r", 15)
  .attr("fill", "salmon")
  .attr("opacity", ".3")
  .attr("stroke-width", "1")
  .attr("stroke", "blue") 
  .attr("alt", d => d.abbr)

  // Initialize tool tip
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .html(function (d) {
      return (`<strong>${d.state}<br>Poverty Rate: ${d.poverty}%<br>Obesity Rate: ${d.obesity}%</strong>`);
    });

  // Create tooltip in the chart
  chartGroup.call(toolTip);

  // Create event listeners to display and hide the tooltip
  circlesGroup.on("mouseover", function(d) {
      toolTip.show(d,this);
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });
});

