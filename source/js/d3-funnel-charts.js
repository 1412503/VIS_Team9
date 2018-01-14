var count_click_Funnel = 0;

(function(){
  var DEFAULT_HEIGHT = 400,
      DEFAULT_WIDTH = 600,
      DEFAULT_BOTTOM_PERCENT = 1/3;

  window.FunnelChart = function(options) {
    /* Parameters:
      data:
        Array containing arrays of categories and engagement in order from greatest expected funnel engagement to lowest.
        I.e. Button loads -> Short link hits
        Ex: [['Button Loads', 1500], ['Button Clicks', 300], ['Subscribers', 150], ['Shortlink Hits', 100]]
      width & height:
        Optional parameters for width & height of chart in pixels, otherwise default width/height are used
      bottomPct:
        Optional parameter that specifies the percent of the total width the bottom of the trapezoid is
        This is used to calculate the slope, so the chart's view can be changed by changing this value
    */

    this.data = options.data;
    this.totalEngagement = 0;
    for(var i = 0; i < this.data.length; i++){
      this.totalEngagement += this.data[i][1];
    }
    this.width = typeof options.width !== 'undefined' ? options.width : DEFAULT_WIDTH;
    this.height = typeof options.height !== 'undefined' ? options.height : DEFAULT_HEIGHT;
    var bottomPct = typeof options.bottomPct !== 'undefined' ? options.bottomPct : DEFAULT_BOTTOM_PERCENT;
    this._slope = 2*this.height/(this.width - bottomPct*this.width);
    this._totalArea = (this.width+bottomPct*this.width)*this.height/2;
  };

  //Lấy text hiển thị trên chart
  window.FunnelChart.prototype._getLabel = function(ind){
    /* Get label of a category at index 'ind' in this.data */
    return this.data[ind][0];
  };

  window.FunnelChart.prototype._getEngagementCount = function(ind){
    /* Get engagement value of a category at index 'ind' in this.data */
    return this.data[ind][1];
  };


  window.FunnelChart.prototype._getColor = function(ind){
    /* Get engagement value of a category at index 'ind' in this.data */
    return this.data[ind][2];
    // return colorPie(ind);
  };

  window.FunnelChart.prototype._createPaths = function(){
    /* Returns an array of points that can be passed into d3.svg.line to create a path for the funnel */
    trapezoids = [];
    var height = 30,
        slope = 13;

    function findNextPoints(chart, prevLeftX, prevRightX, prevHeight, dataInd){
      // reached end of funnel
      if(dataInd >= chart.data.length) return;

      // math to calculate coordinates of the next base
      //area = chart.data[dataInd][1]*chart._totalArea/chart.totalEngagement;
      //prevBaseLength = prevRightX - prevLeftX;
      //nextBaseLength = Math.sqrt((chart._slope * prevBaseLength * prevBaseLength - 4 * area)/chart._slope);
      //nextLeftX = (prevBaseLength - nextBaseLength)/2 + prevLeftX;
      nextLeftX = slope + prevLeftX;
      //nextRightX = prevRightX - (prevBaseLength-nextBaseLength)/2;
      nextRightX = prevRightX - slope;
      //nextHeight = chart._slope * (prevBaseLength-nextBaseLength)/2 + prevHeight;
      nextHeight = height + prevHeight;
      //console.log("nextRightX:", nextRightX);

      points = [[nextRightX, nextHeight]];
      points.push([prevRightX, prevHeight]);
      points.push([prevLeftX, prevHeight]);
      points.push([nextLeftX, nextHeight]);
      points.push([nextRightX, nextHeight]);
      trapezoids.push(points);

      findNextPoints(chart, nextLeftX, nextRightX, nextHeight, dataInd+1);
    }

    findNextPoints(this, 0, this.width, 0, 0);
    return trapezoids;
  };

  window.FunnelChart.prototype.draw = function(elem, speed){
    var DEFAULT_SPEED = 2.5;
    speed = typeof speed !== 'undefined' ? speed : DEFAULT_SPEED;

    var funnelSvg = d3.select(elem).append('svg')
              .attr('width', this.width)
              .attr('height', this.height)
              .append('g');
    // filters go in defs element
    var defs = funnelSvg.append("defs");

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

    // Creates the correct d3 line for the funnel
    var funnelPath = d3.svg.line()
                    .x(function(d) { return d[0]; })
                    .y(function(d) { return d[1]; });

    // Automatically generates colors for each trapezoid in funnel
    //var colorScale = d3.scale.category20();

    var paths = this._createPaths();

    function drawTrapezoids(funnel, i){
      //console.log("ntt", funnel.totalEngagement);
      var g = funnelSvg.append("g")
                        .attr("class", "funnel")
                        .attr("cursor", "pointer")
                        .on("mouseover", function(d){
                            d3.select(this).select("path")
                              .transition()
                              .duration(100)
                              .style("filter", "url(#drop-shadow)")
                              .attr("transform", "translate(-3,-3)")
                              .attr("stroke-width", 3);

                              //Lấy thông tin phân pie khi click vào
                              tooktipFunnel.transition()    
                                           .duration(100)  
                                           .style("opacity", 0.9);

                              tooktipFunnel.html("<strong>Service:</strong>" + d3.select(this).select("#label").attr("value") + "</br>"
                                            +"<strong>Count:</strong>"+ d3.select(this).select("#value").attr("value"))
                                      .style("left", (d3.event.pageX) + "px")   
                                      .style("top", (d3.event.pageY) - 45 + "px"); 
                        })
                        .on("mouseout", function(d)
                        {
                            d3.select(this).select("path")
                              .transition()
                              .duration(100)
                               .style("filter", null)
                              .attr("stroke-width", 1)
                              .attr("transform", null);

                            tooktipFunnel.transition()
                                          .duration(100)
                                           .style("opacity", 0);
                        })
                        .on("click", clickOnFunnelChart); 

      var trapezoid = g.append('path')
                        .attr('d', function(d){
                            return funnelPath(
                                [paths[i][0], paths[i][1], paths[i][2],
                                paths[i][2], paths[i][1], paths[i][2]]);
                            })
                        .attr('fill', '#fff')
                        .attr('stroke', '#fff');                      
                                                
      nextHeight = paths[i][[paths[i].length]-1];

      //var totalLength = trapezoid.node().getTotalLength();

      var transition = trapezoid.transition()
                                //.duration(totalLength/speed)
                                .ease("linear")
                                .attr("d", function(d){return funnelPath(paths[i]);})
                                //.attr("fill", function(d){return colorScale(i);});
                                .attr("fill", function(d){return funnel._getColor(i) ;});
     
      g.append('text')
                //.text(funnel._getLabel(i) + ': ' + funnel._getEngagementCount(i))
                .text(Math.round(funnel._getEngagementCount(i)/funnel.totalEngagement*100*10)/10 + "%")
                .attr("x", function(d){ return funnel.width/2; })
                .attr("y", function(d){
                  return (paths[i][0][1] + paths[i][1][1])/2;}) // Average height of bases
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("font-size", "12px")
                .attr("fill", "#fff");

                if(i < paths.length - 1){
                  transition.each('end', function(){
                    drawTrapezoids(funnel, i+1);
                  });
                }

      g.append("p").attr("id", "label").attr("value", funnel._getLabel(i));
      g.append("p").attr("id", "value").attr("value", funnel._getEngagementCount(i))
      }

    drawTrapezoids(this, 0);


  };
})();

    function clickOnFunnelChart(d)
    {
      count_click_Funnel++;
      if (count_click_Funnel == 1)
      {
         d3.selectAll(".funnel").style("opacity", "0.2").style("pointer-events", "none");
         d3.select(this).style("opacity", 1).style("pointer-events", "visible");   
      }
      else
      {
          d3.selectAll(".funnel").style("opacity", 1).style("pointer-events", "visible");
          count_click_Funnel = 0;
      }
    }







