//var data = [2, 4, 8, 10];
var pie_width = $('.col-sm-4').width();

var	funnel_width = $('.col-sm-8').width();
var width_funnel = 0.2*funnel_width,
	height_funnel = 0.2*funnel_width;
//color
var colorPie = d3.scale.ordinal()
						.range(["#D47300","#00AE56", "#00CED1", ]);

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

//Get data
d3.csv("data/Cargo_Statistic.csv", function(error, data){
	if (error)
		throw error;

	var status_gb_service = d3.nest()
								.key(function(d) { return d.Status;})
								//lọc bỏ service = "all"
								.key(function(d) { return d.Service;})//(d.Service != 0) ? d.Service : null
								//.sortKeys(d3.descending)
								.rollup(function(v) { 
									//return d3.sum(v, function(d){ return d.status});
									return v.length;
								})
								.entries(data);
	// console.log("status_gb_service: ",JSON.stringify(status_gb_service));
	console.log("status_gb_service: ", status_gb_service);

	var	array_early_status = []
		array_ontime_status = [],
		array_late_status = [];

	//Load data have status = "ontime" group by service
	var color_rcs = "#7B68EE",
		color_dep = "#66CDAA",
		color_rcf = "#ffe066",
		color_dlv = "#EE82EE";

	var status = [];

	//Lay so luong tre, som, dung gio cho tung dich vu
	status_gb_service.forEach(function(d)
	{
		if (d.key == 0)
		{
			d.values.forEach(function(value)
			{
				//console.log(value.values);
				if (value.key == 1)
				{
					value.key = "RCS";
					array_ontime_status.push([value.key, value.values, Math.ceil(Math.sqrt(value.values)), color_rcs]);
				}
				else if (value.key == 2)
				{
					value.key = "DEP";
					array_ontime_status.push([value.key, value.values, Math.ceil(Math.sqrt(value.values)), color_dep]);
				}
				else if (value.key == 3)
				{
					value.key = "RCF";
					array_ontime_status.push([value.key, value.values, Math.ceil(Math.sqrt(value.values)), color_rcf]);
				}
				else if (value.key == 4)
				{
					value.key = "DLV";
					array_ontime_status.push([value.key, value.values, Math.ceil(Math.sqrt(value.values)), color_dlv]);
				}
				else if (value.key == 0)
				{
					status.push([d.key, value.values]);	
				}
			});
		}
		else if (d.key == -1)
		{
			d.values.forEach(function(value)
			{
				//console.log(value.values);
				if (value.key == 1)
				{
					value.key = "RCS";
					array_early_status.push([value.key, value.values, Math.ceil(Math.sqrt(value.values)), color_rcs]);
				}
				else if (value.key == 2)
				{
					value.key = "DEP";
					array_early_status.push([value.key, value.values, Math.ceil(Math.sqrt(value.values)), color_dep]);
				}
				else if (value.key == 3)
				{
					value.key = "RCF";
					array_early_status.push([value.key, value.values,Math.ceil(Math.sqrt(value.values)), color_rcf]);
				}
				else if (value.key == 4)
				{
					value.key = "DLV";
					array_early_status.push([value.key, value.values, Math.ceil(Math.sqrt(value.values)), color_dlv]);
				}	
				else if (value.key == 0)
				{
					status.push([d.key, value.values]);
				}
			});
		}
		else if (d.key == 1)
		{
			d.values.forEach(function(value)
			{
				//console.log(value.values);
				if (value.key == 1)
				{
					value.key = "RCS";
					array_late_status.push([value.key, value.values, Math.ceil(Math.sqrt(value.values)), color_rcs]);
				}
				else if (value.key == 2)
				{
					value.key = "DEP";
					array_late_status.push([value.key, value.values, Math.ceil(Math.sqrt(value.values)), color_dep]);
				}
				else if (value.key == 3)
				{
					value.key = "RCF";
					array_late_status.push([value.key, value.values, Math.ceil(Math.sqrt(value.values)), color_rcf]);
				}
				else if (value.key == 4)
				{
					value.key = "DLV";
					array_late_status.push([value.key, value.values, Math.ceil(Math.sqrt(value.values)), color_dlv]);
				}	
				else if (value.key == 0)
				{
					status.push([d.key, value.values]);	
				}
			});
		}
	})
	console.log("status::::", status);

	//Sort data giam dan de ve funnel chart
	//array_ontime_status.sort();
	array_ontime_status.sort(function(x, y){
   		return d3.descending(x[1], y[1]);
	})
	array_late_status.sort(function(x, y){
   		return d3.descending(x[1], y[1]);
	})
	array_early_status.sort(function(x, y){
   		return d3.descending(x[1], y[1]);
	})

	var colorOntime = d3.scale.ordinal()
                      .range(["#006F94","#0099BC", "#00BCF2", "#31D2F7", "#69EAFF"]);
    var colorEarly = d3.scale.ordinal()
                      .range(["#10893E","#00AE56", "#00CC6A", "#38D487", "#70DDA5"]);
    var colorLate = d3.scale.ordinal()
                      .range(["#B05E0D","#D47300", "#FF8C00", "#FFAA44", "#FFC988"])

	array_ontime_status.forEach(function(d, i)
	{
		d.push(colorOntime(i));
	})

	array_early_status.forEach(function(d, i)
	{
		d.push(colorEarly(i));
	})

	array_late_status.forEach(function(d, i)
	{
		d.push(colorLate(i));
	})


	//Load pie chart
	Load_PieChart(status);
	LegendForPie(status);
	//Load funnel chart status = "early"

	Load_FunnelChartEarly(array_early_status);
	//Load funnel chart with status = "late"
	Load_FunnelChartLate(array_late_status);
	//Load funnel chart with status = "ontime"
	Load_FunnelChartOnTime(array_ontime_status);
	//Load legend
	LegendForFunnel(array_early_status);
});

function Load_PieChart(data)
{
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
				        }
				       	else if (d.data[0] == "Trễ")
				       	{
				       		d3.select("#chart-11")
				        		.style("opacity", 0.1)
				        		.style("pointer-events", "none");
				        	d3.select("#chart-13")
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
			.attr("fill", function(d, i){ return colorPie(i);});

	legend.append("text")
		.text(function(d){ 
			if (d[0] == 1)
				d[0] = "Trễ";
			else if (d[0] == 0)
				d[0] = "Đúng giờ";
			else
				d[0] = "Sớm";
			return d[0];
		})
		.style("font-size", 12)
		.attr("x", 10)
		.attr("y", 10);
}

function Load_FunnelChartEarly(data)
{

	var svg = d3.select("#chart-11")
				.append("div")
				.attr("id", "funnelContainer");

	var chart = new FunnelChart({
	    			data: data,
	    			width: width_funnel, 
	    			height: height_funnel, 
	    			bottomPct: 1/4,
	    			});
	chart.draw('#funnelContainer',2);
}

function Load_FunnelChartLate(data)
{
	var svg = d3.select("#chart-12")
				.append("div")
				.attr("id", "funnelContainer1");

	var chart = new FunnelChart({
	    			data: data,
	    			width: width_funnel, 
	    			height: height_funnel, 
	    			bottomPct: 1/4
	    			});
	chart.draw('#funnelContainer1',2);
}

function Load_FunnelChartOnTime(data)
{
	var svg = d3.select("#chart-13")
				.append("div")
				.attr("id", "funnelContainer3");

	var chart = new FunnelChart({
	    			data: data,
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


