//Get data
d3.csv("data/Cargo_Statistic.csv", function(error, data)
{
	if (error)
		throw error;

	//HISTOGRAM 
	//Lay chuyen theo dich vu
	var data_all = data.filter(function(row){
		return row['Service'] == 0;
	})
	var data_rcs = data.filter(function(row){
		return row['Service'] == 1;
	})
	var data_dep = data.filter(function(row){
		return row['Service'] == 2;
	})
	var data_rcf = data.filter(function(row){
		return row['Service'] == 3;
	})
	var data_dlv = data.filter(function(row){
		return row['Service'] == 4;
	})

	// Lấy tất cả chuyến sớm
	var data_all_early = data.filter(function(row){
		return row['Status'] == -1;
	})

	console.log("data_all_early",data_all_early);
	// Lấy tất cả chuyến trễ
	var data_all_late = data.filter(function(row){
		return row['Status'] == 1;
	})

	var data_all_ontime = data.filter(function(row){
		return row['Status'] == 0;
	})

	// Lấy chuyến sớm theo rcs
	var data_early_rcs = data_rcs.filter(function(row)
	{
		return row['Status'] == -1;
	})
	//Som theo dep
	var data_early_dep = data_dep.filter(function(row)
	{
		return row['Status'] == -1;
	})
	//Som theo rcf
	var data_early_rcf = data_rcf.filter(function(row)
	{
		return row['Status'] == -1;
	})
	//Som theo dlv
	var data_early_dlv = data_dlv.filter(function(row)
	{
		return row['Status'] == -1;
	})

	//TRE
	// Lấy chuyến tre theo rcs
	var data_late_rcs = data_rcs.filter(function(row)
	{
		return row['Status'] == 1;
	})
	//tre theo dep
	var data_late_dep = data_dep.filter(function(row)
	{
		return row['Status'] == 1;
	})
	//tre theo rcf
	var data_late_rcf = data_rcf.filter(function(row)
	{
		return row['Status'] == 1;
	})
	//tre theo dlv
	var data_late_dlv = data_dlv.filter(function(row)
	{
		return row['Status'] == 1;
	})
	
	//SCATTER PLOT
	//---------------------SERVICE 2-----------------------
    //group by số chuyến bay tới từng place service 2
	var count_all_s2 = d3.nest()
					.key(function(d) { return d.Place; })
					.rollup(function(v) { 
						return v.length;
					})
					.entries(data_dep);
	// console.log("count_all_s2: ", count_all_s2)

	//lấy tất cả các chuyến bay trễ service 2
	var data_temp_s2 = data_dep.filter(function(row) {
        return row['Status'] == 1;
    })				

    //group by số chuyến bay trễ tới từng place service 2
	var count_late_s2 = d3.nest()
					.key(function(d) { return d.Place })
					.rollup(function(v) { 
						return v.length;
					})
					.entries(data_temp_s2);
	// console.log("count_late_s2: ", count_late_s2)

	var count_result = [],
		count_result1 = [],
		count_result2 = [];
	count_all_s2.forEach(function(value)
	{
		var exist = false
		count_late_s2.forEach(function(val)
		{
			if(value.key == val.key){
				count_result.push({"place": +value.key, "total": value.values, "count_late": val.values, "ratio_late": Math.round((val.values/value.values)*100), "type": "DEP" });
				count_result1.push({"place": +value.key, "total": value.values, "count_late": val.values, "ratio_late": Math.round((val.values/value.values)*100), "type": "DEP" });
				exist = true
				return false //tương tự break
			}
		})
		if(exist == false){
			count_result.push({"place": +value.key, "total": value.values, "count_late": 0, "ratio_late": 0, "type": "DEP"  });
			count_result1.push({"place": +value.key, "total": value.values, "count_late": 0, "ratio_late": 0, "type": "DEP"  });
		}
	});

	//------------------SERVICE 3----------------------------------------
	//group by số chuyến bay tới từng place service 3
	var count_all_s3 = d3.nest()
					.key(function(d) { return d.Place; })
					.rollup(function(v) { 
						return v.length;
					})
					.entries(data_rcf);
	// console.log("count_all_s3: ", count_all_s3)
	//lấy tất cả các chuyến bay trễ service 3
	var data_temp_s3 = data_rcf.filter(function(row) {
        return row['Status'] == 1;
    })				

    //group by số chuyến bay trễ tới từng place service 3
	var count_late_s3 = d3.nest()
					.key(function(d) { return d.Place })
					.rollup(function(v) { 
						return v.length;
					})
					.entries(data_temp_s3);
	// console.log("count_late_s3: ", count_late_s3)

	// var count_result_s3 = []
	count_all_s3.forEach(function(value)
	{
		var exist = false
		count_late_s3.forEach(function(val)
		{
			if(value.key == val.key){
				count_result.push({"place": +value.key, "total": value.values, "count_late": val.values, "ratio_late": Math.round((val.values/value.values)*100), "type": "RCF" });
				count_result2.push({"place": +value.key, "total": value.values, "count_late": val.values, "ratio_late": Math.round((val.values/value.values)*100), "type": "RCF" });
				exist = true
				return false //tương tự break
			}
		})
		if(exist == false){
			count_result.push({"place": +value.key, "total": value.values, "count_late": 0, "ratio_late": 0, "type": "RCF" })
			count_result2.push({"place": +value.key, "total": value.values, "count_late": 0, "ratio_late": 0, "type": "RCF"  });;
		}
	});
	console.log("count_result", count_result);
	console.log("count_result1", count_result1);
	console.log("count_result2", count_result2);
	// console.log("count_result_s3: ", count_result_s3)
	//------------------END SERVICE 4------------------------------------
	
	//Hien thi chart
	//Load pie chart
	Load_PieChart(data_all);
	LegendForPie(data_rcs);
	//Load funnel chart status = "early"

	Load_FunnelChartRCS(data_rcs);
	Load_FunnelChartDEP(data_dep);
	Load_FunnelChartRCF(data_rcf);
	Load_FunnelChartDLV(data_dlv);





	// Histogram số lượng chuyến sớm theo thời gian
	Histogram(data_all_early, "#chart-03", color1);

	 //Histogram số lượng chuyến trễ theo thời gian
	Histogram(data_all_late, "#chart-04", color2);
	ScatterPlot(count_result);

	d3.selectAll("input")
		.on("change", function(d)
		{
			d3.select("#chart-03")
					.selectAll("svg")
					.remove();
			d3.select("#chart-04")
					.selectAll("svg")
					.remove();
			d3.select("#chart-05")
					.selectAll("svg")
					.remove();

			if (d3.select(this).attr("id") == "RCS" && d3.select(this).property('checked') == true)
			{
				Histogram(data_early_rcs, "#chart-03", color1);
				Histogram(data_late_rcs, "#chart-04", color2);
				d3.select("#chart-12")
					.style("opacity", 0.2)
					.style("pointer-events", "none");
				d3.select("#chart-13")
					.style("opacity", 0.2)
					.style("pointer-events", "none");
				d3.select("#chart-14")
					.style("opacity", 0.2)
					.style("pointer-events", "none");
				ScatterPlot(count_result);
			}
			else if (d3.select(this).attr("id") == "DEP" && d3.select(this).property('checked') == true)
			{
				Histogram(data_early_dep, "#chart-03", color1);
				Histogram(data_late_dep, "#chart-04", color2);
				d3.select("#chart-11")
					.style("opacity", 0.2)
					.style("pointer-events", "none");
				d3.select("#chart-13")
					.style("opacity", 0.2)
					.style("pointer-events", "none");
				d3.select("#chart-14")
					.style("opacity", 0.2)
					.style("pointer-events", "none");
				ScatterPlot(count_result1);

			}
			else if (d3.select(this).attr("id") == "RCF" && d3.select(this).property('checked') == true)
			{
				Histogram(data_early_rcf, "#chart-03", color1);
				Histogram(data_late_rcf, "#chart-04", color2);
				d3.select("#chart-11")
					.style("opacity", 0.2)
					.style("pointer-events", "none");
				d3.select("#chart-12")
					.style("opacity", 0.2)
					.style("pointer-events", "none");
				d3.select("#chart-14")
					.style("opacity", 0.2)
					.style("pointer-events", "none");
				ScatterPlot(count_result2);
			}
			else if (d3.select(this).attr("id") == "DLV" && d3.select(this).property('checked') == true)
			{
				Histogram(data_early_dlv, "#chart-03", color1);
				Histogram(data_late_dlv, "#chart-04", color2);
				d3.select("#chart-11")
					.style("opacity", 0.2)
					.style("pointer-events", "none");
				d3.select("#chart-12")
					.style("opacity", 0.2)
					.style("pointer-events", "none");
				d3.select("#chart-13")
					.style("opacity", 0.2)
					.style("pointer-events", "none");
				ScatterPlot(count_result);
			}
			else
			{
				Histogram(data_all_early, "#chart-03", color1);
				Histogram(data_all_late, "#chart-04", color2);
				d3.select("#chart-11")
					.style("opacity", 1)
					.style("pointer-events", "visiable")
				d3.select("#chart-12")
					.style("opacity", 1)
					.style("pointer-events", "visiable");
				d3.select("#chart-13")
					.style("opacity", 1)
					.style("pointer-events", "visiable");
				d3.select("#chart-14")
					.style("opacity", 1)
					.style("pointer-events", "visiable");
				ScatterPlot(count_result);
			}

		})
});