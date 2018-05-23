//Date drop down to select sample
var sample_selected =''
var select_sample = d3.select('#select_sample_id')
  .append('select')
  	.attr('class','select')
    .on('change',function(d) {
       date_selected = d3.select(this).property('value');
       console.log('sample_selected = ' + date_selected);      
    })

var options = select_sample
   // d3.json()
  .selectAll('option')
	.data(['1','2','3']).enter()
	.append('option')
		.text(function (d) { return d; });