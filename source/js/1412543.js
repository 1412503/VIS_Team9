//var data = [2, 4, 8, 10];
var pie_width = $('.col-sm-4').width();

var	funnel_width = $('.col-sm-8').width();
var width_funnel = 0.2*funnel_width,
	height_funnel = 0.2*funnel_width;
//color
var colorPie = d3.scale.ordinal()
						.range(["#D47300","#00AE56", "#00CED1", ]);
var colorLate = "#D47300",
	colorEarly = "#00AE56",
	colorOnTime = "#00CED1";

//Xác định tooktip để hiển thị thông tin tree khi rê chuột vào pie chart
var tooktip = d3.select("#chart-01")
				.append("div")	
		    	.attr("class", "tooltip")				
		    	.style("opacity", 0);

var tooktipFunnel = d3.select("#chart-01")
				.append("div")	
		    	.attr("class", "tooltip")				
		    	.style("opacity", 0);

var count_click = 0; //Tạo biến đếm click

function Load_PieChart(data)
{
	var server_gb_status = d3.nest()
								.key(function(d) {return d.Status;})//(d.Service != 0) ? d.Service : null
								//.sortKeys(d3.descending)
								.rollup(function(v) { 
									//return d3.sum(v, function(d){ return d.status});
									return v.length;
								})
								.entries(data);
	var result = [];
	server_gb_status.forEach(function(d){
		if (d.key == 0)
		{
			d.key = "Đúng giờ";
			result.push([d.key, d.values, colorOnTime]);
		}
		else if (d.key == -1)
		{
			d.key = "Sớm";
			result.push([d.key, d.values, colorEarly]);
		}
		else
		{
			d.key = "Trễ";
			result.push([d.key, d.values, colorLate]);
		}

	})
	data = result;

	var width = 0.5*pie_width,
		height = width,
		radius = (width-50)/2;

	//Đếm số lượng tổng các tất cả các trạng thái
	var sumRows = 0;
	data.forEach(function(d){
		sumRows += d[1];
	})
	//console.log("numberofRows:", sumRows);

	//Append svg with height and width
	var svg = d3.select("#chart-01") 
				.append("svg")
				.attr("width", width)
				.attr("height", height);
	var g = svg.append("g")
				.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	//Generate the arcs
	var arc = d3.svg.arc()
					.innerRadius(30)
					.outerRadius(radius);

	var arcOver = d3.svg.arc()
						.innerRadius(25)
        				.outerRadius(radius + 7);

	var pie = d3.layout.pie()
						.value(function(d){return d[1];});

	// filters go in defs element
	var defs = svg.append("defs");

	var filter = defs.append("filter")
    				.attr("id", "drop-shadow")
    				.attr("width", "200%")
    				.attr("height", "200%");


	// SourceAlpha refers to opacity of graphic that this filter will be applied to
	// convolve that with a Gaussian with standard deviation 3 and store result
	// in blur
	filter.append("feGaussianBlur")
	    .attr("in", "SourceAlpha")
	    .attr("stdDeviation", 5)
	    .attr("result", "blur");

	// translate output of Gaussian blur to the right and downwards with 2px
	// store result in offsetBlur
	filter.append("feOffset")
	    .attr("in", "blur")
	    .attr("dx", 3)
	    .attr("dy", 3)
	    .attr("result", "offsetBlur");
	// overlay original SourceGraphic over translated blurred opacity by using
	// feMerge filter. Order of specifying inputs is important!
	var feMerge = filter.append("feMerge");

	feMerge.append("feMergeNode")
	     	.attr("in", "offsetBlur")
	feMerge.append("feMergeNode")
	    	.attr("in", "SourceGraphic");

	//Generate groups
	var arcs = g.selectAll(".arc")
					.data(pie(data))
					.enter()
					.append("g")
					.attr("class", "arc")
					.attr("cursor", "pointer")
					//.style("filter", "url(#drop-shadow)")
					//.style("opacity", 1)
         			.on("mouseover", function(d){
						d3.select(this).select("path")
							.transition()
							.duration(500)
							.attr("d", arcOver)
							.style("filter", "url(#drop-shadow)")
							.attr("stroke-width", 2);

						// //Lấy thông tin phân pie khi click vào
						tooktip.transition()		
			           			.duration(200)		
			           			.style("opacity", 0.9);

			    		tooktip.html("<strong> Status: </strong>"	+ d.data[0] + "</br>"
			    				+"<strong> Count: </strong>"	+ d.data[1])
			           			.style("left", (d3.event.pageX) + "px")		
			           			.style("top", (d3.event.pageY) - 60 + "px")	
					})
			     	.on("mouseout", function(d){
			     	     d3.select(this).select("path")
			     	     	.transition()
							.duration(500)
							.attr("d", function(d)
							{
								if (count_click == 1)
									return arcOver(d);
								else
									return arc(d);
							})
							.style("filter", null)
							.attr("stroke-width", 1);

						//Bỏ tooltip
						tooktip.transition()		
			           			.duration(200)
								.style("opacity", 0);

			     	})
			     	.on("click", function(d)
			     	{
			     		count_click++;
						if (count_click == 1)
						{
							d3.selectAll(".arc").style("opacity", 0.1).style("pointer-events", "none");
							d3.select(this).style("opacity", 1.0).style("pointer-events", "visible");

				        //Khi click vào phần nào của pie chart thì hiển thị thông tin tương ứng của chart đó bên phải
				        if (d.data[0] == "Sớm")
				        {
				        	d3.select("#chart-12")
				        		.style("opacity", 0.1)
				        		.style("pointer-events", "none")

				        		//.selectAll(".arc")
				        		//.on('click', false);
				        		//.classed("hide", true);
				        	d3.select("#chart-13")
				        		.style("opacity", 0.1)
				        		.style("pointer-events", "none");
				        	d3.select("#chart-04")
				        		.style("opacity", 0.1)
				        		.style("pointer-events", "none");
				        }
				       	else if (d.data[0] == "Trễ")
				       	{
				       		d3.select("#chart-11")
				        		.style("opacity", 0.1)
				        		.style("pointer-events", "none");
				        	d3.select("#chart-13")
				        		.style("opacity", 0.1)
				        		.style("pointer-events", "none");
				        	d3.select("#chart-03")
				        		.style("opacity", 0.1)
				        		.style("pointer-events", "none");
				       	}
				        else 
				        { 
				        	d3.select("#chart-11")
				        		.style("opacity", 0.1)
				        		.style("pointer-events", "none");
				        	d3.select("#chart-12")
				        		.style("opacity", 0.1)
				        		.style("pointer-events", "none");
				        }
					}
					else if (count_click == 2)
					{
						d3.selectAll(".arc")
							.style("opacity",1.0)
							.style("pointer-events", "visible")
							.select("path")
							.transition()
							.duration(500)
							.attr("d", arc);
						count_click = 0;

						// //Bỏ tooltip
						// tooktip.style("opacity", 0);

						//Bỏ làm mờ các chart bên phải
						d3.select("#chart-11")
				        		.style("opacity", 1)
				        		.style("pointer-events", "visible");
						d3.select("#chart-12")
				        		.style("opacity", 1)
				        		.style("pointer-events", "visible");
						d3.select("#chart-13")
				        		.style("opacity", 1)
				        		.style("pointer-events", "visible");
				       	d3.select("#chart-03")
				        		.style("opacity", 1)
				        		.style("pointer-events", "visible");
				        d3.select("#chart-04")
				        		.style("opacity", 1)
				        		.style("pointer-events", "visible");
					}
			     }); 

	arcs.append("path")
		.attr("d", arc) // here the arc function works on every record d of data 
		.attr("fill", function(d, i){ return colorPie(i); })
		.attr("stroke", "#fff")
		.attr("stroke-opacity", 1)
		.attr("fill-opacity", "#000");
		

	arcs.append("text")
		.attr("transform", function(d){ return "translate(" + arc.centroid(d) + ")"; }) // put text at the center of every arc
		.attr("text-anchor", "middle")
		.attr("font-size", "12px")
		.attr("fill", "#fff")
		.text(function(d) { return Math.round(d.data[1]/sumRows *100) + "%"; });
}

function LegendForPie(data)
{
	var server_gb_status = d3.nest()
								.key(function(d) {return d.Status;})//(d.Service != 0) ? d.Service : null
								//.sortKeys(d3.descending)
								.rollup(function(v) { 
									//return d3.sum(v, function(d){ return d.status});
									return v.length;
								})
								.entries(data);
	var result = [];
	server_gb_status.forEach(function(d){
		if (d.key == 0)
		{
			d.key = "Đúng giờ";
			result.push([d.key, d.values, colorOnTime]);
		}
		else if (d.key == -1)
		{
			d.key = "Sớm";
			result.push([d.key, d.values, colorEarly]);
		}
		else
		{
			d.key = "Trễ";
			result.push([d.key, d.values, colorLate]);
		}

	})
	data = result;

	var svgLegend = d3.select("#chart-01-legend")
					.append("svg")
					.attr("width", 0.2*pie_width)
					.attr("height", 0.5*pie_width);

	var legend = svgLegend.selectAll(".legendPie")
						.data(data)
						.enter()
						.append("g")
						.attr("transform", function(d,i){
						    return "translate(" + 20 + "," + (i * 15 + 20) + ")"; // place each legend on the right and bump each one down 15 pixels
						  })
						.attr("class", "legendPie");

	legend.append("rect")
			.attr("width", 10)
			.attr("height", 10)
			.attr("fill", function(d){ return d[2];});

	legend.append("text")
		.text(function(d){return d[0]})
		.style("font-size", 12)
		.attr("x", 10)
		.attr("y", 10);
}

function Load_FunnelChartRCS(data)
{
	var server_gb_status = d3.nest()
								.key(function(d) {return d.Status;})//(d.Service != 0) ? d.Service : null
								//.sortKeys(d3.descending)
								.rollup(function(v) { 
									//return d3.sum(v, function(d){ return d.status});
									return v.length;
								})
								.entries(data);
	var result = [];
	server_gb_status.forEach(function(d){
		if (d.key == 0)
		{
			d.key = "Đúng giờ";
			result.push([d.key, d.values, colorOnTime]);
		}
		else if (d.key == -1)
		{
			d.key = "Sớm";
			result.push([d.key, d.values, colorEarly]);
		}
		else
		{
			d.key = "Trễ";
			result.push([d.key, d.values, colorLate]);
		}

	});
	result.sort(function(x, y){
   		return d3.descending(x[1], y[1]);
	})
	// console.log("test funnel chart", server_gb_status);
	

	var svg = d3.select("#chart-11")
				.append("div")
				.attr("id", "funnelContainer");

	var chart = new FunnelChart({
					data: result,
	    			width: width_funnel, 
	    			height: height_funnel, 
	    			bottomPct: 1/4,
	    			});
	chart.draw('#funnelContainer',2);
}

function Load_FunnelChartDEP(data)
{
	var server_gb_status = d3.nest()
								.key(function(d) {return d.Status;})//(d.Service != 0) ? d.Service : null
								//.sortKeys(d3.descending)
								.rollup(function(v) { 
									//return d3.sum(v, function(d){ return d.status});
									return v.length;
								})
								.entries(data);
	var result = [];
	server_gb_status.forEach(function(d){
		if (d.key == 0)
		{
			d.key = "Đúng giờ";
			result.push([d.key, d.values, colorOnTime]);
		}
		else if (d.key == -1)
		{
			d.key = "Sớm";
			result.push([d.key, d.values, colorEarly]);
		}
		else
		{
			d.key = "Trễ";
			result.push([d.key, d.values, colorLate]);
		}

	})
	result.sort(function(x, y){
   		return d3.descending(x[1], y[1]);
	})

	var svg = d3.select("#chart-12")
				.append("div")
				.attr("id", "funnelContainer1");

	var chart = new FunnelChart({
	    			data: result,
	    			width: width_funnel, 
	    			height: height_funnel, 
	    			bottomPct: 1/4
	    			});
	chart.draw('#funnelContainer1',2);
}

function Load_FunnelChartRCF(data)
{
	var server_gb_status = d3.nest()
								.key(function(d) {return d.Status;})//(d.Service != 0) ? d.Service : null
								//.sortKeys(d3.descending)
								.rollup(function(v) { 
									//return d3.sum(v, function(d){ return d.status});
									return v.length;
								})
								.entries(data);
	var result = [];
	server_gb_status.forEach(function(d){
		if (d.key == 0)
		{
			d.key = "Đúng giờ";
			result.push([d.key, d.values, colorOnTime]);
		}
		else if (d.key == -1)
		{
			d.key = "Sớm";
			result.push([d.key, d.values, colorEarly]);
		}
		else
		{
			d.key = "Trễ";
			result.push([d.key, d.values, colorLate]);
		}

	})
	result.sort(function(x, y){
   		return d3.descending(x[1], y[1]);
	})

	var svg = d3.select("#chart-13")
				.append("div")
				.attr("id", "funnelContainer2");

	var chart = new FunnelChart({
	    			data: result,
	    			width: width_funnel, 
	    			height: height_funnel, 
	    			bottomPct: 1/4,
	    			});
	chart.draw('#funnelContainer2',2);
}

function Load_FunnelChartDLV(data)
{
	var server_gb_status = d3.nest()
								.key(function(d) {return d.Status;})//(d.Service != 0) ? d.Service : null
								//.sortKeys(d3.descending)
								.rollup(function(v) { 
									//return d3.sum(v, function(d){ return d.status});
									return v.length;
								})
								.entries(data);
	var result = [];
	server_gb_status.forEach(function(d){
		if (d.key == 0)
		{
			d.key = "Đúng giờ";
			result.push([d.key, d.values, colorOnTime]);
		}
		else if (d.key == -1)
		{
			d.key = "Sớm";
			result.push([d.key, d.values, colorEarly]);
		}
		else
		{
			d.key = "Trễ";
			result.push([d.key, d.values, colorLate]);
		}

	})
	result.sort(function(x, y){
   		return d3.descending(x[1], y[1]);
	})

	var svg = d3.select("#chart-13")
				.append("div")
				.attr("id", "funnelContainer2");

	var chart = new FunnelChart({
	    			data: result,
	    			width: width_funnel, 
	    			height: height_funnel, 
	    			bottomPct: 1/4,
	    			});
	chart.draw('#funnelContainer3',2);
}

function LegendForFunnel(data)
{
	var svg = d3.select("#chart-11-legend")
					.append("svg")
					.attr("width", 0.2*funnel_width)
					.attr("height", 0.15*funnel_width);

	var legend = svg.selectAll(".legend")
					.data(data)
					.enter()
					.append("g")
					.attr("transform", function(d,i){
					    return "translate(" + 20 + "," + (i * 15 + 20) + ")"; // place each legend on the right and bump each one down 15 pixels
					  })
					.attr("class", "legend");

	legend.append("rect")
			.attr("width", 10)
			.attr("height", 10)
			.attr("fill", function(d, i){ return d[3];});

	legend.append("text")
		.text(function(d){ return d[0];})
		.style("font-size", 12)
		.attr("x", 10)
		.attr("y", 10);
}


