var color1 = "#00AE56"
var color2 = "#ff944d";

function Histogram(data, idchart, color)
{
	var map = data.map(function(i) {return (parseInt(i.Duration)/1440); })

	var formatCount = d3.format(",.0f");

	var margin = {top: 12, right: 0, bottom: 40, left: 50},
		width = $(idchart).width() - margin.left - margin.right,
		height = 0.7*width - margin.top - margin.bottom;

	var max = d3.max(map);
	var min = d3.min(map);
	console.log(min);

	var x = d3.scale.linear()
    		.domain([0, max])
      		.range([0, width]);

	var histogram = d3.layout.histogram()
    				.bins(x.ticks(20))
    				(map);

    var yMax = d3.max(histogram, function(d){return d.length});
	var yMin = d3.min(histogram, function(d){return d.length});			

	var colorScale = d3.scale.linear()
            		.domain([yMin, yMax])
            		.range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);
    
    var y = d3.scale.linear()
    		.domain([0, yMax])
   			.range([height, 0]);

   	var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom");

   	var yAxis = d3.svg.axis()
   				.scale(y)
   				.orient("left")

    var svg = d3.select(idchart).append("svg")
    			.attr("width", width + margin.left + margin.right)
    			.attr("height", height + margin.top + margin.bottom)
  				.append("g")
    			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var bar = svg.selectAll(".bar")
    			.data(histogram)
  				.enter().append("g")
    			.attr("class", "bar")
    			.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
    			.attr("cursor", "pointer")
    			.on("mouseover", function(d, i)
    			{
						d3.select(this).select("rect")
							.transition()
							.duration(500)
							.attr("stroke", "#fff")
							.attr("stroke-width", 2);
				})
				.on("mouseout", function(d)
				{
			     	     d3.select(this).select("rect")
			     	     	.transition()
							.duration(500)
							.attr("stroke", null);
			    }) ; 

    bar.append("rect")
		.attr("x", 1)
		.attr("width", (x(histogram[0].dx) - x(0)) - 1)
		.attr("height", function (d) { return height - y(d.y); })
		.attr("fill", color);//function(d) { return colorScale(d.y) });

	bar.append("text")
		.attr("x", (x(histogram[0].dx) - x(0)) / 2)
		.attr("y", -12)
		.attr("dy", ".75em")
		.attr("fill", color)
		.style("font-size", "8px")
		.style("font-weight", "bold")
		.attr("text-anchor", "middle")
		.text(function(d) { if(formatCount(d.y) != 0) {return formatCount(d.y);} })



    svg.append("g")
	    .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	      .append("text")
	      .attr("class", "label")
	      .attr("x", width)
	      .attr("y", 25)
	      .style("text-anchor", "end")
	      .style("font-size", "10px")
	      .text("Thời gian (ngày)");

	svg.append("g")
		.attr("class", "y axis")
	      .call(yAxis)
	      .append("text")
	      .attr("class", "label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", -50)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .style("font-size", "10px")
	      .text("Số lượng chuyến");

};



