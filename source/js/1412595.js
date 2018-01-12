function Histogram(data, idchart)
{
	var map = data.map(function(i) {return parseInt(i.Duration); })

	var histogram = d3.layout.histogram()
					.bins(20)
					(map)				

	var width = $(idchart).width(),
	height = width,
    padding = 50;

    var y = d3.scale.linear()
    		.domain([0, d3.max(histogram.map(function(i) {return i.length;}))])
    		.range([0, height]);

    var x = d3.scale.linear()
    		.domain([0, d3.max(map)])
    		.range([0, width]);

    var xAxis = d3.svg.axis()
    			.scale(x)
    			.orient("bottom");

	var svg = d3.select(idchart).append("svg")
				.attr("width", width)
				.attr("height", height + padding)
				.append("g")
				.attr("transform", "translate(20,0)");

	var group = svg.append("g")
				.attr("transform", "translate(0," + height +")")
				.call(xAxis);

	var bars = svg.selectAll(".bar")
		.data(histogram)
		.enter()
		.append("g");

	bars.append("rect")
		.attr("x", function (d) { return x(d.x);})
		.attr("y", function (d) {return width - y(d.y);})
		.attr("width", function (d) { return x(d.dx); })
		.attr("height", function (d) { return y(d.y); })
		.attr("fill", "steelblue")

	bars.append("text")
		.attr("x", function (d) { return x(d.x);})
		.attr("y", function (d) {return width - y(d.y);})
		.attr("dy", "20px")
		.attr("dx", function (d) { return x(d.dx)/2;})
		.attr("fill", "#fff")
		.attr("text-anchor", "middle")
		.text(function (d) { return d.y;})	
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
	
		Histogram(data_all_early_rcs, "#chart-03");
		Histogram(data_all_late_rcs, "#chart-04");

});
