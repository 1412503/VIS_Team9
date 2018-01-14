// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div") // append vào body để định vị chính xác vị trí con trỏ chuột
    .attr("class", "tooltip")
    .style("opacity", 0);

function ScatterPlot(count_result)
{
	var w = $('#chart-05').width();
	h = 0.3*w
	var margin = {top: 20, right: 0.1*w, bottom: 30, left:  0.1*w},
	    width = w - margin.left - margin.right,
	    height = h - margin.top - margin.bottom;

	// setup x 
	var xValue = function(d) { return d["total"];}, // data -> value
	    xScale = d3.scale.linear().range([0, width]).nice(), // value -> display
	    xMap = function(d) { return xScale(xValue(d));}, // data -> display
	    xAxis = d3.svg.axis().scale(xScale).orient("bottom"); // trục x

	// setup y
	var yValue = function(d) { return d["ratio_late"];}, // data -> value
	    yScale = d3.scale.linear().range([height, 0]).nice(), // value -> display
	    yMap = function(d) { return yScale(yValue(d));}, // data -> display
	    yAxis = d3.svg.axis().scale(yScale).orient("left");//trục y	

	// setup fill color ứng với từng service
	var cValue = function(d) { return d.type;},
		color = d3.scale.ordinal()
			//this assumes you have 3 groups of data//﻿each of the domains corresponds to a color set
	        .domain(["DEP", "RCF"])
	        .range(["#66CDAA", "#ffe066"]);
	    // hoặc color = d3.scale.category10(); //tham khảo link https://github.com/d3/d3-scale/blob/master/README.md#schemeCategory10
	 
	  // don't want dots overlapping axis, so add in buffer to data domain
	  xScale.domain([d3.min(count_result, xValue)-1, d3.max(count_result, xValue)+1]);
	  yScale.domain([d3.min(count_result, yValue)-1, d3.max(count_result, yValue)+1]);


	var zoomBeh = d3.behavior.zoom()
      						.x(xScale)
      						.y(yScale)
      						.scaleExtent([0, 2200])
      						.on("zoom", zoom);

    // add the graph canvas to the body of the webpage
	var svg = d3.select("#chart-05").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .call(zoomBeh)
	    .attr("cursor", "pointer")
	  	.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //=> xác định vị trí của svg (điểm bên trái trên svg = góc margin.left và margin.top 
	   
	  // x-axis
	svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")") // vị trí điểm gốc tọa độ
	      .call(xAxis)
	      .append("text")
	      .attr("class", "label")
	      .attr("x", width) //vị trí của text so với gốc tọa độ
	      .attr("y", -6) //vị trí text so với trục tọa độ (-) nằm bên trái, (+) nằm bên phải
	      .style("text-anchor", "end") //kết thúc của text là điểm (gồm: start/middle/end)
	      .style("font-size", "14px")
	      .text("Số lượng đến sân bay");

	  // y-axis
	svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	      .append("text")
	      .attr("class", "label")
	      .attr("transform", "rotate(-90)") // trục y góc 90 với trục x
	      .attr("y", -50) //vị trí text so với trục tọa độ (-) nằm bên trái, (+) nằm bên phải
	      .attr("dy", ".71em") //vị trí của text so với gốc tọa độ
	      .style("text-anchor", "end") //kết thúc của text là điểm (gồm: start/middle/end)
	      .style("font-size", "14px")
	      .text("Tỉ lệ trễ (%)");

	var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

    objects.append("line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  objects.append("line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

	  // draw dots
	objects.selectAll(".dot")
	      .data(count_result)
	      .enter().append("circle")
	      .attr("class", "dot")
	      .attr("r", 4)
	      .attr("transform", transform)
	      // .attr("cx", xMap)
	      // .attr("cy", yMap)
	      .style("fill", function(d) { return color(cValue(d));}) //tô màu dot ứng với từng service
	      .on("mouseover", function(d) {
	          tooltip.transition()
	               .duration(200)
	               .style("opacity", .9); // độ rõ mờ của tooltip (1->0 độ rõ giảm dần đến k hiện thị)
	          tooltip.html("Place " + d["place"] + "<br/> (" + xValue(d) 
		        + ", " + yValue(d) + ")")
	          	   .style("color", color(cValue(d)))//màu của text tooltip ứng với màu của từng service
	          	   .style("font-weight", "bold")
	          	   .style("background-color", "	#FFFFFF")
	               .style("left", (d3.event.pageX + 8) + "px")
	               .style("top", (d3.event.pageY - 30) + "px");
	      })
	      .on("mouseout", function(d) {
	          tooltip.transition()
	               .duration(500)
	               .style("opacity", 0);// độ rõ mờ của tooltip
	      });

	  // draw legend (chú thích)
	  var legend = svg.selectAll(".legend")
	      .data(color.domain())
	      .enter().append("g")
	      .attr("class", "legend")
	      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

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
	 
	function zoom() 
	{
	    svg.select(".x.axis").call(xAxis);
	    svg.select(".y.axis").call(yAxis);

	    svg.selectAll(".dot")
	        .attr("transform", transform); 
	}

	function transform(d) 
	{
	    return "translate(" + xScale(xValue(d)) + "," + yScale(yValue(d))+ ")";
	}

	d3.select("#Reset").on("click", clickButton);

	function clickButton()
	{
		
		xScale.domain([d3.min(count_result, xValue)-1, d3.max(count_result, xValue)+1]);
	  	yScale.domain([d3.min(count_result, yValue)-1, d3.max(count_result, yValue)+1]);
		svg.selectAll(".dot")
	        .attr("transform", transform); 

	    xAxis = d3.svg.axis().scale(xScale).orient("bottom");
	  	yAxis = d3.svg.axis().scale(yScale).orient("left");
	  	svg.select(".x.axis").call(xAxis);
	    svg.select(".y.axis").call(yAxis);
	}
}





