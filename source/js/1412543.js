//var data = [2, 4, 8, 10];

function Load_PieChart(data)
{
	var width = 150,
		height = width,
		radius = width/2;
	//Append svg with height and width
	var svg = d3.select("#chart-01")
				.data([data])  
				.append("svg")
				.attr("width", width)
				.attr("height", height);
	var g = svg.append("g")
				.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	//color
	var color = d3.scale.ordinal()
						.range(["#00bcd4", "#8bc34a", "#ff7f0e", "pink"]);

	//Generate the arcs
	var arc = d3.svg.arc()
					.innerRadius(30)
					.outerRadius(radius);


	var pie = d3.layout.pie()
						.value(function(d){return d.values;});

	//Generate groups
	var arcs = g.selectAll(".arc")
					.data(pie)
					.enter()
					.append("g")
					.attr("class", "arc")
					.style("opacity", 1)
					// .on("mouseover", onMouseOverPieChart)
     //     			.on("mouseout", onMouseOutPieChart)
         			.on("click", clickPieChart); 

	arcs.append("path")
		.attr("d", arc) // here the arc function works on every record d of data 
		.attr("fill", function(d, i){ return color(i); });

	arcs.append("text")
		.attr("transform", function(d){ return "translate(" + arc.centroid(d) + ")"; }) // put text at the center of every arc
		.attr("text-anchor", "middle")
		.attr("font-size", "10px")
		.text(function(d, i) { return data[i].key; });
}

//Xác định tooktip để hiển thị thông tin tree khi rê chuột vào pie chart
var tooktip = d3.select("#chart-01")
				.append("div")	
		    	.attr("class", "tooltip")				
		    	.style("opacity", 0);

var count_click = 0; //Tạo biến đếm click
function clickPieChart(d, i)
{
	count_click++;
	if (count_click == 1)
	{
		d3.selectAll(".arc").style("opacity", 0.2);
		d3.select(this).style("opacity", 1.0);

		//Lấy thông tin phân pie khi click vào
		tooktip.transition()		
           .duration(200)		
           .style("opacity", 0.9);

    	tooktip.html("<strong> Status: </strong>"	+ d.data.key + "</br>"
    				+"<strong> Count: </strong>"	+ d.data.values)
           		.style("left", (d3.event.pageX) + "px")		
           		.style("top", (d3.event.pageY) - 60 + "px");

        //Khi click vào phần nào của pie chart thì hiển thị thông tin tương ứng của chart đó bên phải
        if (d.data.key == "Sớm")
        {
        	d3.select("#chart-12")
        		.style("opacity", 0.2);
        	d3.select("#chart-13")
        		.style("opacity", 0.2);
        }
       	else if (d.data.key == "Trễ")
       	{
       		d3.select("#chart-11")
        		.style("opacity", 0.2);
        	d3.select("#chart-13")
        		.style("opacity", 0.2);
       	}
        else 
        { 
        	d3.select("#chart-11")
        		.style("opacity", 0.2);
        	d3.select("#chart-12")
        		.style("opacity", 0.2);
        }

	}
	else if (count_click == 2)
	{
		d3.selectAll(".arc").style("opacity",1.0);
		count_click = 0;

		//Bỏ tooltip
		tooktip.html("")
				.style("opacity", 0);

		//Bỏ làm mờ các chart bên phải
		d3.select("#chart-11")
        		.style("opacity", 1);
		d3.select("#chart-12")
        		.style("opacity", 1);
		d3.select("#chart-13")
        		.style("opacity", 1);
	}
}

//Load Funnel chart
// function Load_FunnelChart(data)
// {
// 	var width = 300,
// 		height = 250,
// 		radius = Math.min(width, height)/2;

// 	var color = d3.scale.ordinal()
// 						.range(["red", "green", "blue"]);

// 	var svg = d3.select("#chart-11")
// 				.append("svg")
// 				.attr("width",width)
// 				.attr("height", height)
// 				.append("g");

// 	var funnel = d3.funnel()
//                     .size([width,height])
//                     .mouth([100,100])
//                     .value(function(d) { return d.data; });

// 	var line = d3.svg.line()
//                     .interpolate('linear-closed')
//                     .x(function(d,i) { return d.x; })
//                     .y(function(d,i) { return d.y; });

// 	var g = svg.selectAll(".funnel-group")
//                     .data(funnel(data))
//                     .enter()
//                     .append("g")
//                     .attr("class", "funnel-group");

// 	g.append("path")
// 		.attr("d", function(d) {return line(d.data)})
// 		.style("fill", function(d) {return color(d.data);});

// 	// g.append("text")
//  //      .attr({
//  //            "y": function (d,i) {
//  //                if(d.data.length === 4) {
//  //                    return (((d.data[0].y-d.data[1].y)/2)+d.data[1].y) + 5;
//  //                 } 
//  //                 else {
//  //                    return (d.data[0].y + d.data[1].y)/2 + 10;
//  //                      }
//  //                      },
//  //            "x": function (d,i) { 
//  //            	return width/2;}
//  //                    })
//  //                    .style("text-anchor", "middle")
//  //                    .text(function(d) { return d.data; });
            
//     // d3.select("body")
//     // 	.append("table")
//     //     .attr({
//     //             "id" : "footer",
//     //             "width": width + "px"
//     //          })

// }


//Get data
d3.csv("data/Cargo_Statistic.csv", function(error, data){
	if (error)
		throw error;

	var status = d3.nest()
					.key(function(d) { return d.Status; })
					.rollup(function(v) { 
						//return d3.sum(v, function(d){ return d.status});
						return v.length;
					})
					.entries(data);
	//console.log(JSON.stringify(status))
	console.log("status",status);

	var status_gb_service = d3.nest()
								.key(function(d) { return d.Status;})
								//lọc bỏ service = "all"
								.key(function(d) { return d.Service;})//(d.Service != 0) ? d.Service : null
								.rollup(function(v) { 
									//return d3.sum(v, function(d){ return d.status});
									return v.length;
								})
								.entries(data);
	// console.log("status_gb_service: ",JSON.stringify(status_gb_service));
	// console.log("status_gb_service: ", status_gb_service);

	var	array_early_status = []
		array_ontime_status = [],
		array_late_status = [];

	//Gán nhãn cho key của status
	status.forEach(function(value)
	{
		//console.log(value.values);
		if (value.key == 1)
			value.key = "Sớm";
		else if (value.key == 0)
			value.key = "Đúng giờ";
		else 
			value.key = "Trễ";
	});

	//Load data have status = "ontime" group by service
	status_gb_service[0].values.forEach(function(value){
		var temp = [];
		//console.log(value.values);
		if (value.key == 1)
		{
			value.key = "rcs";
			temp.push(value.key, value.values);
			array_ontime_status.push(temp);
		}
		else if (value.key == 2)
		{
			value.key = "dep";
			temp.push(value.key, value.values);
			array_ontime_status.push(temp);
		}
		else if (value.key == 3)
		{
			value.key = "rcf";
			temp.push(value.key, value.values);
			array_ontime_status.push(temp);
		}
		else if (value.key == 4)
		{
			value.key = "dlv";
			temp.push(value.key, value.values);
			array_ontime_status.push(temp);
		}	

	});
	// console.log(ontime_status_value);
	//Load data have status = "early" group by service
	status_gb_service[1].values.forEach(function(value){
		var temp = [];
		//console.log(value.values);
		if (value.key == 1)
		{
			value.key = "rcs";
			temp.push(value.key, value.values);
			array_early_status.push(temp);
		}
		else if (value.key == 2)
		{
			value.key = "dep";
			temp.push(value.key, value.values);
			array_early_status.push(temp);
		}
		else if (value.key == 3)
		{
			value.key = "rcf";
			temp.push(value.key, value.values);
			array_early_status.push(temp);
		}
		else if (value.key == 4)
		{
			value.key = "dlv";
			temp.push(value.key, value.values);
			array_early_status.push(temp);
		}	
	});
	console.log("array_early_status" ,array_early_status);

	//Load data have status = "late" group by service
	status_gb_service[2].values.forEach(function(value){
		var temp = [];
		//console.log(value.values);
		if (value.key == 1)
		{
			value.key = "rcs";
			temp.push(value.key, value.values);
			array_late_status.push(temp);
		}
		else if (value.key == 2)
		{
			value.key = "dep";
			temp.push(value.key, value.values);
			array_late_status.push(temp);
		}
		else if (value.key == 3)
		{
			value.key = "rcf";
			temp.push(value.key, value.values);
			array_late_status.push(temp);
		}
		else if (value.key == 4)
		{
			value.key = "dlv";
			temp.push(value.key, value.values);
			array_late_status.push(temp);
		}	
	});

	console.log("array_early_status: ", array_early_status);

	//Load pie chart
	Load_PieChart(status);
	//Load funnel chart status = "early"
	Load_FunnelChartEarly(array_early_status);
	//Load funnel chart with status = "late"
	Load_FunnelChartLate(array_late_status);
	//Load funnel chart with status = "ontime"
	Load_FunnelChartOnTime(array_ontime_status);

});

var width_funnel = 160,
	height_funnel = 150;

function Load_FunnelChartEarly(data)
{
	var svg = d3.select("#chart-11")
				.append("div")
				.attr("id", "funnelContainer");
	//var ntt = [['Video Views', 1500], ['Comments', 300], ['Video Responses', 150]];
	var chart = new FunnelChart({
	    			data: data.sort(),
	    			width: width_funnel, 
	    			height: height_funnel, 
	    			bottomPct: 1/4
	    			});
	chart.draw('#funnelContainer',2);
}

function Load_FunnelChartLate(data)
{
	var svg = d3.select("#chart-12")
				.append("div")
				.attr("id", "funnelContainer1");
	var chart = new FunnelChart({
	    			data: data.sort(),
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
	    			data: data.sort(),
	    			width: width_funnel, 
	    			height: height_funnel, 
	    			bottomPct: 1/4
	    			});
	chart.draw('#funnelContainer3',2);
}


function clickFunelChart()
{
	d3.select(this).style("opacity", 0.2);

}




