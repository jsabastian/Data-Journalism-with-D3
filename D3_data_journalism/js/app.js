var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class","responsive")

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data\\data.csv", function(err, csvdata) {
  // console.log("Import Data", err)
  //if (err) throw err;
  // console.log("CSV Data:", csvdata)
  // Step 1: Parse Data/Cast as numbers
  // ==============================
  // console.log(csvdata)
  csvdata.forEach(function(data) {
    data.state = data.state;
    data.abbr = data.abbr;
    data.poverty = parseFloat(data.poverty);
    data.povertyMoe = parseFloat(data.povertyMoe);
    data.age = parseFloat(data.age);
    data.ageMoe = parseFloat(data.ageMoe);
    data.income = parseInt(data.income);
    data.incomeMoe = parseInt(data.incomeMoe);
    data.healthcare = parseFloat(data.healthcare);
    data.healthcareLow = parseFloat(data.healthcareLow);
    data.healthcareHigh = parseFloat(data.healthcareHigh);
    data.obesity = parseFloat(data.obesity);
    data.obesityLow = parseFloat(data.obesityLow);
    data.obesityHigh = parseFloat(data.obesityHigh);
    data.smokes = parseFloat(data.smokes);
    data.smokesLow = parseFloat(data.smokesLow);
    data.smokesHigh = parseFloat(data.smokesHigh);
    data.id = parseInt(data.id);
  });
  console.log("CSV Data:", csvdata)
  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(csvdata, d => d.poverty)])
    .range([0, width]);
  // console.log("xLinearScale = " + xLinearScale)
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(csvdata, d => d.healthcare)])
    .range([height, 0]);
  // console.log("yLinearScale = " + yLinearScale)
  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  chartGroup.append("g")
    .call(leftAxis);

    // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "aText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
    .attr("class", "aText")
    .text("In Poverty (%)");

  // console.log("Step 4")
   // Step 5: Create Circles
  // ==============================

  // var div = d3.select("body").append("div")	
  // .attr("class", "tooltip")				
  // .style("opacity", 0);
  chartGroup.selectAll("text.stateText")
    .data(csvdata)
    .enter()
    .append("text")
    .text((d) => d.abbr)
    .attr("class", "stateText")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare -.35))
    // .on("mouseover", function(d) {		
    //   div.transition()		
    //       // .duration(500)		
    //       .style("opacity", .9);		
      // div.html(`<strong>${d.state}<br>Poverty: ${d.poverty}%<br>Lacks Healthcare: ${d.healthcare}%</strong>`)	
      //     .style("left", (d3.event.pageX)+10 + "px")		
      //     .style("top", (d3.event.pageY) + "px")
      //     .style("background", "rgba(0, 0, 0, 0.8)")
      //     .style("padding", "6px")
      //     .style("font-size", "12px")
      //     .style("line-height", "1")
      //     .style("line-height", "1.5em")
      //     .style("color", "#fff")
      //     .style("text-align", "center")
      //     .style("text-transform", "capitalize")
      //     .style("border-radius", "8px")
      //     .style('display', 'block')
      //   })					
      //   .on("mouseout", function(d) {		
      //     div.transition()		
      //     //  .duration(500)		
      //     .style("display", "none");});	;

  var circlesGroup = chartGroup.selectAll("circle")
  .data(csvdata)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", 15)
  .attr("fill", "lightblue")
  .attr("opacity", ".3")
  .attr("stroke-width", "1")
  .attr("stroke", "blue") 
  .attr("alt", d => d.abbr)


  // console.log("x = ",d.abbr, " ", xLinearScale(csvdata.poverty))
  // console.log("x = ",d.abbr, " ", yLinearScale(csvdata.healthcare))




  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .html(function (d) {
      return (`<strong>${d.state}<br>Poverty: ${d.poverty}%<br>Lacks Healthcare: ${d.healthcare}%</strong>`);
    });
    // console.log("Step 6")

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);
  // console.log("Step 7")

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("mouseover", function(d) {
      toolTip.show(d,this);
    })
    // onmouseout event
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });
});

