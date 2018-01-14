var color1 = "#00AE56"
var color2 = "#D47300";

function Histogram(data, idchart, color)
{
	var map = data.map(function(i) {return (parseInt(i.Duration)/1440); })

	var formatCount = d3.format(",.0f");

	var margin = {top: 20, right: 30, bottom: 50, left: 70},
		width = $(idchart).width() - margin.left - margin.right,
		height = 0.6*width - margin.top - margin.bottom;

	var max = d3.max(map);
	var min = d3.min(map);

	var x = d3.scale.linear()
    		.domain([min, max])
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
    			.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });   

    bar.append("rect")
		.attr("x", 1)
		.attr("width", (x(histogram[0].dx) - x(0)) - 1)
		.attr("height", function (d) { return height - y(d.y); })
		.attr("fill", function(d) { return colorScale(d.y) })

	bar.append("text")
		.attr("x", (x(histogram[0].dx) - x(0)) / 2)
		.attr("y", -12)
		.attr("dy", ".75em")
		.attr("fill", "black")
		.attr("text-anchor", "middle")
		.text(function(d) { return formatCount(d.y); })

    svg.append("g")
	    .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	      .append("text")
	      .attr("class", "label")
	      .attr("x", width)
	      .attr("y", 35)
	      .style("text-anchor", "end")
	      .style("font-size", "14px")
	      .text("Thời gian (ngày)");

	svg.append("g")
		.attr("class", "y axis")
	      .call(yAxis)
	      .append("text")
	      .attr("class", "label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", -65)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .style("font-size", "14px")
	      .text("Số lượng chuyến");

};

d3.csv("data/Cargo_Statistic.csv", function(error, data){
	if (error)
		throw error;
	// Lấy tất cả chuyến sớm
	var data_all_early = data.filter(function(row){
		return row['Status'] == -1;
	})
	// Lấy tất cả chuyến trễ
	var data_all_late = data.filter(function(row){
		return row['Status'] == 1;
	})

	// Lấy chuyến sớm theo rcs
	var data_all_early_rcs = data_all_early.filter(function(row)
	{
		return row['Service'] == 1;
	})
	// Lấy chuyến sớm theo dep
	var data_all_early_dep = data_all_early.filter(function(row)
	{
		return row['Service'] == 2;
	})
	// Lấy chuyến sớm theo rcf
	var data_all_early_rcf = data_all_early.filter(function(row)
	{
		return row['Service'] == 3;
	})
	// Lấy chuyến sớm theo dlv
	var data_all_early_dlv = data_all_early.filter(function(row)
	{
		return row['Service'] == 4;
	})

	// Lấy chuyến trễ theo rcs
	var data_all_late_rcs = data_all_late.filter(function(row)
	{
		return row['Service'] == 1;
	})
	// Lấy chuyến trễ theo dep
	var data_all_late_dep = data_all_late.filter(function(row)
	{
		return row['Service'] == 2;
	})
	// Lấy chuyến trễ theo rcf
	var data_all_late_rcf = data_all_late.filter(function(row)
	{
		return row['Service'] == 3;
	})
	// Lấy chuyến trễ theo dlv
	var data_all_late_dlv = data_all_late.filter(function(row)
	{
		return row['Service'] == 4;
	})
	
	// Histogram số lượng chuyến sớm theo thời gian
	//Histogram(data_all_early, "#chart-03", color1);

	// Histogram số lượng chuyến sớm của rcs
	//Histogram(data_all_early_rcs, "#chart-03", color1);

	// Histogram số lượng chuyến sớm theo dep
	//Histogram(data_all_early_dep, "#chart-03", color1);

	// Histogram số lượng chuyến sớm theo rcf
	//Histogram(data_all_early_rcf, "#chart-03", color1);

	// Histogram số lượng chuyến sớm theo dlv
	Histogram(data_all_early_dlv, "#chart-03", color1);


	/* //Histogram số lượng chuyến trễ theo thời gian
	Histogram(data_all_late, "#chart-04", color2);

	// Histogram số lượng chuyến trễ của rcs
	Histogram(data_all_late_rcs, "#chart-04", color2);

	// Histogram số lượng chuyến trễ theo dep
	Histogram(data_all_late_dep, "#chart-04", color2);

	// Histogram số lượng chuyến trễ theo rcf
	Histogram(data_all_late_rcf, "#chart-04", color2);*/

	// Histogram số lượng chuyến trễ theo dlv
	Histogram(data_all_late_dlv, "#chart-04", color2);

});


