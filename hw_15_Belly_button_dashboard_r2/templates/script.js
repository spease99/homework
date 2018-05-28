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
  .selectAll('option')
	.data(['1','2','3']).enter()
    //.data(life).enter()
	.append('option')
		.text(function (d) { return d; });


url = "/names"
var life = 'no data'
d3.json(url, function(data) {
  console.log(data.samples);
  life = data.samples
});