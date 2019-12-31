var width = 960;
var height = 700;

// D3 Projection
var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1200]);          // scale things down so see entire US
        
// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection

		
// Define linear scale for output
var color = d3.scale.linear()
			  .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

var legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];

//Create SVG element and append map to the SVG
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
var g = svg.append("g");
// Append Div for tooltip to SVG
var div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);

// Load GeoJSON data and merge with states data
d3.json("../data/us-states.json", function(json) {
  // Bind the data to the SVG and create one path per GeoJSON feature
  svg.selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("stroke", "#fff")
    .style("stroke-width", "1")
    .style("fill", "rgb(213,222,217)");
    drawRoutes();
});
function drawRoutes() {
  d3.json("../data/routes.geojson", function(error, data) {
    if (error) throw error;
    var features = data.features;
    console.log(features)
    var route = svg.selectAll(".routes")
                 .data(features)
                 .enter()
                 .append("path")
                 .attr("class", "routes")
                 .attr("d", path)
                 .style("fill", "none")
                 .style("stroke", "#000")
                 .attr("stroke-dasharray", 1 + " " + 1)
                 route.attr("stroke-dashoffset", 1)
                 .transition() // Call Transition Method
                 .duration(40000) // Set Duration timing (ms)
                 .attr("stroke-dashoffset", 10);
   
                 
    var coords = [
                   [-84.3880, 33.7490],
                   [-84.8766, 35.15953],
                   [-77.03657, 38.90021],
                   [-75.34778, 40.0357],
                   [-73.56722, 45.50171],
                   [-73.81379, 43.71823],
                   [-122.08375, 37.38602]
                 ]

    // plot a circle for each city
    svg.selectAll(".city")
      .data(coords)
      .enter()
      .append("circle")
      .attr("class", "city")
      .attr("cx", function(d) { return projection(d)[0]; })
      .attr("cy", function(d) { return projection(d)[1]; })
      .style("fill", "rgb(69,173,168)")
      .style("opacity", "0.8")
      .attr("r", "6px");

    var labels = [
      {text: "ATLANTA", x: -15, y: -10, align: "middle"},
      {text: "CLEVELAND", x: -10, y: 2, align: "end"},
      {text: "WASHINGTON DC", x: -10, y: 2, align: "end"},
      {text: "PHILLY", x: 0, y: 16, align: "start"},
      {text: "MONTREAL", x: 15, y: -10, align: "end"},
      {text: "VERMONT", x: 5, y: 10, align: "left"},
      {text: "SAN FRANCISCO", x: 5, y: 10, align: "left"},
    ]

    // add text labels
    svg.selectAll("text")
     .data(labels)
     .enter()
     .append("text")
     .attr("x", function(d, i) { return projection(coords[i])[0] + d.x; })
     .attr("y", function(d, i) { return projection(coords[i])[1] + d.y; })
     .attr("text-anchor", function(d) { return d.align; })
     .text(function(d) { return d.text; });
  });
}