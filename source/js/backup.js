//Get data
d3.csv("data/Cargo_Statistic.csv", function(error, data)
{
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

	//HISTOGRAM 
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
	
	
	//SCATTER PLOT
	//---------------------SERVICE 2-----------------------
	//lấy tất cả các chuyên bay service 2
	var data_temp_all_s2 = data.filter(function(row) {
        return row['Service'] == 2;
    })	
    //group by số chuyến bay tới từng place service 2
	var count_all_s2 = d3.nest()
					.key(function(d) { return d.Place; })
					.rollup(function(v) { 
						return v.length;
					})
					.entries(data_temp_all_s2);
	// console.log("count_all_s2: ", count_all_s2)

	//lấy tất cả các chuyến bay trễ service 2
	var data_temp_s2 = data_temp_all_s2.filter(function(row) {
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

	var count_result = []
	count_all_s2.forEach(function(value)
	{
		var exist = false
		count_late_s2.forEach(function(val)
		{
			if(value.key == val.key){
				count_result.push({"place": +value.key, "total": value.values, "count_late": val.values, "ratio_late": Math.round((val.values/value.values)*100), "type": "DEP" });
				exist = true
				return false //tương tự break
			}
		})
		if(exist == false){
			count_result.push({"place": +value.key, "total": value.values, "count_late": 0, "ratio_late": 0, "type": "DEP"  });
		}
	});
	// console.log("count_result_s2: ", count_result_s2)
	//------------------END SERVICE 2------------------------------------

	//------------------SERVICE 4----------------------------------------
	//lấy tất cả các chuyên bay service 3
	var data_temp_all_s3 = data.filter(function(row) {
        return row['Service'] == 3;
    })	
    //group by số chuyến bay tới từng place service 3
	var count_all_s3 = d3.nest()
					.key(function(d) { return d.Place; })
					.rollup(function(v) { 
						return v.length;
					})
					.entries(data_temp_all_s3);
	// console.log("count_all_s3: ", count_all_s3)

	//lấy tất cả các chuyến bay trễ service 3
	var data_temp_s3 = data_temp_all_s3.filter(function(row) {
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
				exist = true
				return false //tương tự break
			}
		})
		if(exist == false){
			count_result.push({"place": +value.key, "total": value.values, "count_late": 0, "ratio_late": 0, "type": "RCF" });
		}
	});
	// console.log("count_result_s3: ", count_result_s3)
	//------------------END SERVICE 4------------------------------------
	//console.log("ntt:",count_result);

	//HIỂN THỊ CHART

	//Load pie chart
	Load_PieChart(status);
	LegendForPie(status);
	//Load funnel chart status = "early"

	Load_FunnelChartEarly(data_all_early);

	//Load funnel chart with status = "late"
	// Load_FunnelChartLate(array_late_status);
	//Load funnel chart with status = "ontime"
	// Load_FunnelChartOnTime(array_ontime_status);
	//Load legend
	LegendForFunnel(array_early_status);

	// Histogram số lượng chuyến sớm theo thời gian
	Histogram(data_all_early, "#chart-03", color1);

	// Histogram số lượng chuyến sớm của rcs
	//Histogram(data_all_early_rcs, "#chart-03", color1);

	// Histogram số lượng chuyến sớm theo dep
	//Histogram(data_all_early_dep, "#chart-03", color1);

	// Histogram số lượng chuyến sớm theo rcf
	//Histogram(data_all_early_rcf, "#chart-03", color1);

	// Histogram số lượng chuyến sớm theo dlv

	//Histogram(data_all_early_dlv, "#chart-03", color1);


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


	ScatterPlot(count_result);
});