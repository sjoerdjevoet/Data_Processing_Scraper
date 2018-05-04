var object = "http://stats.oecd.org/SDMX-JSON/data/RWB/CZE+ISL+IRL+JPN+KOR+MEX+NLD+POL+TUR+USA.EMP_RA+VOTERS_SH+SUBJ_LIFE_SAT.VALUE/all?startTime=2014&endTime=2014&dimensionAtObservation=allDimensions"

d3.queue()
  .defer(d3.request, object)
  .awaitAll(doFunction);



function doFunction(error, response) {
  if (error) throw error;


var display = JSON.parse(response[0].responseText);
  console.log(display);

  list_countries = []
  list_variables_axes = []
  Life_Quality_mark = [] // 5.8
  Unemployement_Rate = []
  Voter_turnout = []

  variables_axes = display.dataSets[0].observations
  for (var i = 0; i < 10; i++){
    for (var j = 0; j < 3; j++){
      observation = i + ":" + j + ":0:0"
  list_variables_axes.push(variables_axes[observation][0])

    }
  }
for (var i = 2; i < 30; i+=3){

 Life_Quality_mark.push(list_variables_axes[i]) // life quality
}

 console.log(Life_Quality_mark);

for (var i = 0; i < 30; i+=3){

 Voter_turnout.push(list_variables_axes[i]) // voter turnout
}

 console.log(Voter_turnout);

 for (var i = 1; i < 30; i+=3){

  Unemployement_Rate.push(list_variables_axes[i]) // empotement rate
 }

  console.log(Unemployement_Rate);
  //console.log(Life_Quality_mark)
  //console.log(list_variables_axes);

countries = display.structure.dimensions.observation[0].values
for (i = 0; i <10; i++){

  list_countries.push(countries[i]['name'])
}


//console.log(list_countries);
//list_SelfRate_rate=[7.5,5.8,7.2,7.5,7.1,7.7,5.3,6.3,6.7,6.6]
//list_Employement_rate=[78.1,59.9,69.6,74.2,61.4,74.7,49.6,55.5,76.3,55.1]

//console.log(list_SelfRate_rate);

dataset=[]

for (i =0; i < 10; i++){
dataset.push([list_countries[i],Life_Quality_mark[i],Voter_turnout[i],Unemployement_Rate[i]])
}
console.log(dataset);

dict = []

for(var data = 0; data < dataset.length; data++){
  dict.push({
    "Country" : dataset[data][0],
    "Life_Quality_mark" : dataset[data][1],
    "Voter_turnout"     : dataset[data][2],
    "Unemployement_Rate" : dataset[data][3],

  })
}

console.log(dict);


function drawGraph(xText, yText) {
	$('svg').remove();
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	/*
	 * value accessor - returns the value to encode for a given data object.
	 * scale - maps value to a visual display encoding, such as a pixel position.
	 * map function - maps from data value to display value
	 * axis - sets up axis
	 */

	// setup x
	var xValue = function(d) { return d[xText];}, // data -> value
		xScale = d3.scale.linear().range([0, width]), // value -> display
		xMap = function(d) { return xScale(xValue(d));}, // data -> display
		xAxis = d3.svg.axis().scale(xScale).orient("bottom");

	// setup y
	var yValue = function(d) { return d[yText];}, // data -> value
		yScale = d3.scale.linear().range([height, 0]), // value -> display
		yMap = function(d) { return yScale(yValue(d));}, // data -> display
		yAxis = d3.svg.axis().scale(yScale).orient("left");

	// setup fill color
	var cValue = function(d) { return d.Country;},
		color = d3.scale.category10();

	// add the graph canvas to the body of the webpage
	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// add the tooltip area to the webpage
	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);


	  // don't want dots overlapping axis, so add in buffer to data domain
	  xScale.domain([d3.min(dict, xValue)-1, d3.max(dict, xValue)+1]);
	  yScale.domain([d3.min(dict, yValue)-1, d3.max(dict, yValue)+1]);

	// scales w/o extra padding
	//  xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);
	//  yScale.domain([d3.min(data, yValue), d3.max(data, yValue)]);

	  // x-axis
	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		.append("text")
		  .attr("class", "label")
		  .attr("x", width)
		  .attr("y", -6)
		  .style("text-anchor", "end")
		  .text(xText);

	  // y-axis
	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("class", "label")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text(yText);

	  // draw dots
	  svg.selectAll(".dot")
		  .data(dict)
		.enter().append("circle")
		  .attr("class", "dot")
		  .attr("r", 3.5)
		  .attr("cx", xMap)
		  .attr("cy", yMap)
		  .style("fill", function(d) { return color(cValue(d));})
		  .on("mouseover", function(d) {
			  tooltip.transition()
				   .duration(200)
				   .style("opacity", .9);
			  tooltip.html(d["Player"] + "<br/> " + d.School + "<br/>(" + xValue(d)
				+ ", " + yValue(d) + ")")
				   .style("left", (d3.event.pageX + 10) + "px")
				   .style("top", (d3.event.pageY - 28) + "px");
		  })
		  .on("mouseout", function(d) {
			  tooltip.transition()
				   .duration(500)
				   .style("opacity", 0);
		  });

	  // draw legend
	  var legend = svg.selectAll(".legend")
		  .data(color.domain())
		.enter().append("g")
		  .attr("class", "legend")
		  .attr("transform", function(d, i) { return "translate(10," + (i+7) * 20 + ")"; });

	  // draw legend colored rectangles
	  legend.append("rect")
		  .attr("x", width - 18)
		  .attr("width", 18)
		  .attr("height", 18)
		  .style("fill", color);

	  // draw legend text
	  legend.append("text")
		  .attr("x", width - 24)
		  .attr("y", 9)
		  .attr("dy", ".35em")
		  .style("text-anchor", "end")
		  .text(function(d) { return d;})

}

drawGraph('Passing TD', 'Rushing TD');

function setGraph() {
	drawGraph($('#x-value').val(), $('#y-value').val());
}
}
