// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.



function convertNumbers(row) {  //convert strings to floats if possible
    
  var r = {};
  for (var k in row) {
    r[k] = +row[k];
    if (isNaN(r[k])) {
      r[k] = row[k];
    }
  }
  return r;
}
d3.csv("poverty_v_health_coverage.csv", function (data_mx,error) {
  if (error) console.error;
  
  var data_num =[]
  for (var i=0; i<data_mx.length; i++) {   //convert number strings to floats
    data_num.push(convertNumbers(data_mx[i]))
    }
  console.log(data_num);
       
    var margin = {top: 20, right: 15, bottom: 60, left: 60}
      , width = 960 - margin.left - margin.right
      , height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
              //.domain([0, d3.max(data, function(d) { return d[0]; })])
              .domain([d3.min(data_num, function(d) { return d.health_coverage_per; }), d3.max(data_num, function(d) { return d.health_coverage_per; })])
              .range([ 0, width ]);

    var y = d3.scale.linear()
              .domain([d3.min(data_num, function(d) { return d.below_poverty_per; }), d3.max(data_num, function(d) { return d.below_poverty_per; })])
              .range([ height, 0 ]);
              
    //console.log(d3.max(data_num, function(d) { return d.below_poverty_per; }))
    
    var chart = d3.select('body')
    .append('svg:svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .attr('class', 'chart')

    var main = chart.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'main')   
        
    // draw the x axis
    var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

    main.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'main axis date')
    .call(xAxis);

    // draw the y axis
    var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

    main.append('g')
    .attr('transform', 'translate(0,0)')
    .attr('class', 'main axis date')
    .call(yAxis);

    var g = main.append("svg:g"); 

    dots = g.selectAll("scatter-dots")
      .data(data_num)
      .enter().append("svg:circle")
          .attr("cx", function (d,i) { return x(d.health_coverage_per); } )
          .attr("cy", function (d) { return y(d.below_poverty_per); } )
          .attr("r", 15)
          .attr("fill", "blue")

          
    //Add the SVG Text Element to the svgContainer
    var text = g.selectAll("text")
                            .data(data_num)
                            .enter()
                            .append("text");

    //Add SVG Text Element Attributes
    var textLabels = text
                     .attr("x", function(d) { return x(d.health_coverage_per)-8; })
                     .attr("y", function(d) { return y(d.below_poverty_per)+3; })
                     .text( function (d) { return d.state; })
                     .attr("font-family", "sans-serif")
                     .attr("font-size", "10px")
                     .attr("fill", "white");
                     
     // text label for the y axis
    g.append("text")
      .attr("transform", "rotate(-90)")
      //.attr("y", 0 - margin.left)
      //.attr("x",0 - (margin.height))
      .attr("y", -50)
      .attr("x",-180 )
      .attr("dy", "1em")
      .attr("fill", "blue")
      .attr("font-size", "20px")
      .style("text-anchor", "middle")
      .text("Percent in poverty"); 
      
    // text label for the x axis
    g.append("text")
      //.attr("transform", "rotate(-90)")
      .attr("x",500 )
      .attr("y", 450)
      .attr("dy", "1em")
      .attr("fill", "blue")
      .attr("font-size", "20px")
      .style("text-anchor", "middle")
      .text("Percent with health coverage"); 
      
      // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([0, 0])
          .html(function(d){
            //return (`Live Life`)
          return(`<strong>${d.state_full}<strong> <hr> 
                  <p>Health coverage ${d.health_coverage_per} (%)</p> 
                  <p>Below poverty ${d.below_poverty_per} (%)</p>`)
          })

        // Step 2: Create the tooltip in chartGroup.
        //chartGroup.call(toolTip)
        dots.call(toolTip)

        // Step 3: Create "mouseover" event listener to display tooltip
        //circlesGroup.on("mouseover", function(d){
        dots.on("mouseover", function(d){
            toolTip.show(d)
        })
        // Step 4: Create "mouseout" event listener to hide tooltip
          .on("mouseout", function(d){
            toolTip.hide(d)
          });
      
});