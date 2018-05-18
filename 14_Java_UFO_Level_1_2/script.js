var data = ["Option 1", "Option 2", "Option 3"];

//  <script src="dataShort.js" type="text/javascript"></script>   //get unique values from a list

//var select = d3.select('body')


//find unique date/times
var unique_ = {};
var filter_ = dataSet.filter(function(entry) {
    if (unique_[entry.datetime]) {
        return false;
    }
    unique_[entry.datetime] = true;
    return true;
});
filter_date_list = Object.keys(unique_)

//find unique cities
var unique_ = {};
var filter_ = dataSet.filter(function(entry) {
    if (unique_[entry.city]) {
        return false;
    }
    unique_[entry.city] = true;
    return true;
});
filter_city_list = Object.keys(unique_)



//find unique states
var unique_ = {};
var filter_ = dataSet.filter(function(entry) {
    if (unique_[entry.state]) {
        return false;
    }
    unique_[entry.state] = true;
    return true;
});
filter_states_list = Object.keys(unique_)

//find unique countries
var unique_ = {};
var filter_ = dataSet.filter(function(entry) {
    if (unique_[entry.country]) {
        return false;
    }
    unique_[entry.country] = true;
    return true;
});
filter_country_list = Object.keys(unique_)

//find unique shapes
var unique_ = {};
var filter_ = dataSet.filter(function(entry) {
    if (unique_[entry.shape]) {
        return false;
    }
    unique_[entry.shape] = true;
    return true;
});
filter_shape_list = Object.keys(unique_);


//Date drop down set up
var date_selected =''
var select_date = d3.select('#drop_down_date')
  .append('select')
  	.attr('class','select')
    .on('change',function(d) {
       date_selected = d3.select(this).property('value');
       console.log('date_selected = ' + date_selected);      
    })

var options = select_date
  .selectAll('option')
	.data(filter_date_list).enter()
	.append('option')
		.text(function (d) { return d; });


//City drop down set up
var city_selected = ''
var select_city = d3.select('#drop_down_city')
  .append('select')
  	.attr('class','select')
  //  .on('change',onchange)
    .on('change',function(d) {
       city_selected = d3.select(this).property('value');
       console.log('city_selected = ' + city_selected);      
    });
var options = select_city
  .selectAll('option')
	.data(filter_city_list).enter()
	.append('option')
		.text(function (d) { return d; });


//State drop down set up
var state_selected = ''
var select_state = d3.select('#drop_down_state')
  .append('select')
  	.attr('class','select')
    .on('change',function(d) {
       state_selected = d3.select(this).property('value');
       console.log('state_selected = ' + state_selected);    
    })
var options = select_state
  .selectAll('option')
	.data(filter_states_list).enter()
	.append('option')
		.text(function (d) { return d; });

//Country drop down set up
country_selected = ''                               
var select_country = d3.select('#drop_down_country')
  .append('select')
  	.attr('class','select')
    .on('change',function(d) {
       country_selected = d3.select(this).property('value');
       console.log('country_selected = ' + country_selected);    
    })

var options = select_country
  .selectAll('option')
	.data(filter_country_list).enter()
	.append('option')
		.text(function (d) { return d; });

//Shape drop down set up
shape_selected = ''        ;                       
var select_shape = d3.select('#drop_down_shape')
  .append('select')
  	.attr('class','select')
    .on('change',function(d) {
       shape_selected = d3.select(this).property('value');
       console.log('shape_selected = ' + shape_selected);    
    })

var options = select_shape
  .selectAll('option')
	.data(filter_shape_list).enter()
	.append('option')
		.text(function (d) { return d; });

//Set up the repsonce for the "Do Search" button
//d3.select("#search_multi").on('click',function(sp){
//   console.log('date_selected = ' + date_selected);
//   console.log('city_selected = ' + city_selected);
//   console.log('state_selected = ' + state_selected);
//   console.log('country_selected = ' + country_selected); 
//   console.log('shape_selected = ' + shape_selected); 
//   
//   filteredDate = dataSet.filter(filter_date).filter(filter_shape);
//   renderTable2()    
//https://stackoverflow.com/questions/39431032/using-d3-filter-in-an-update-function
//});