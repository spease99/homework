// Get references to the tbody element, input field and button
var $tbody = document.querySelector("tbody");
var $dateInput = document.querySelector("#date_time_ID");
var $searchBtn = document.querySelector("#search");
var $searchMultiBtn = document.querySelector("#search_multi");
var $resetBtn = document.querySelector("#reset_db");

reset_db

// Add an event listener to the searchButton, call handleSearchButtonClick when clicked
$searchBtn.addEventListener("click", handleSearchButtonClick);
$searchMultiBtn.addEventListener("click", handleMultiSearchButtonClick);
$resetBtn.addEventListener("click", resetButtonClick);

// Set filteredAddresses to addressData initially
//var filteredAddresses = addressData;

var filteredDate = dataSet   ;

function renderTable2() {
  $tbody.innerHTML = "";
  for (var i = 0; i < filteredDate.length; i++) {
    // Get get the current address object and its fields
    var siting = filteredDate[i];
    var fields = Object.keys(siting);
    // Create a new row in the tbody, set the index to be i + startingIndex
    var $row = $tbody.insertRow(i);
    for (var j = 0; j < fields.length; j++) {
      // For every field in the address object, create a new cell at set its inner text to be the current value at the current address's field
      var field = fields[j];
      var $cell = $row.insertCell(j);
      $cell.innerText = siting[field];
    }
  }
}


function handleSearchButtonClick() {

  //  call multi element filter on each record
filteredDate = dataSet.filter(filter_date);
console.log('hello from search button world')
renderTable2();
}

function handleMultiSearchButtonClick() {
  //  call multi element filter on each record
    console.log('hello from multi-search button world')
    console.log('date_selected = ' + date_selected);
    console.log('city_selected = ' + city_selected);
    console.log('state_selected = ' + state_selected);
    console.log('country_selected = ' + country_selected); 
    console.log('shape_selected = ' + shape_selected); 
 
    //filteredDate = dataSet.filter(filter_date).filter(filter_shape);    
    
    filteredDate = dataSet
        .filter(filter_date_multi)
        .filter(filter_city)
        .filter(filter_state)
        .filter(filter_country)
        .filter(filter_shape);  

    renderTable2();
}

function resetButtonClick() {
  //  reset the global search variables
    console.log('hello from RESET button world')
    date_selected = '';
    city_selected ='';
    state_selected ='';
    country_selected =''; 
    shape_selected=''; 
  
    //Reset to the entire data set
    filteredDate = dataSet 

    renderTable2();
}



//*****************Lots of filters of the data to be displayed***********************

function filter_date(one_record) {   //used for first date search field.  
    
    var keep_date = $dateInput.value.trim();
    var record_date = one_record.datetime;
    var keep_record = (record_date == keep_date) ; //keep the record in the list or not
    console.log('record_date = ' + record_date + "      " + 'keep_date = '+ keep_date + "    " + (record_date == keep_date) );
    return keep_record; 
}

function filter_date_multi(one_record) {
    var keep_date =  date_selected;
    var record_date = one_record.datetime;
    var keep_record = (record_date == keep_date)||(keep_date=='') ; //logic to keep the record or not
    console.log( '(record_date,date_selected,keep) = (' + record_date + ',' + date_selected + ',' + keep_record + ')'  );
    return keep_record; 
}

function filter_shape(one_record) {
    var keep_record = (one_record.shape == shape_selected)||(shape_selected=='') ; //keep the record in the list or not
    console.log( '(record_shape,shape_selected,keep) = (' + one_record.shape + ',' + shape_selected + ',' + keep_record + ')'  );
    return keep_record;
}

function filter_city(one_record) {
    var keep_record = (one_record.city == city_selected)||(city_selected=='') ; //keep the record in the list or not
    console.log( '(record_city,city_selected,keep) = (' + one_record.city + ',' + city_selected + ',' + keep_record + ')'  );
    return keep_record;
}

function filter_state(one_record) {
    var keep_record = (one_record.state == state_selected)||(state_selected=='') ; //keep the record in the list or not
    console.log( '(record_state,state_selected,keep) = (' + one_record.state + ',' + state_selected + ',' + keep_record + ')'  );
    return keep_record;
}

function filter_country(one_record) {
    var keep_record = (one_record.country == country_selected)||(country_selected=='') ; //keep the record in the list or not
    console.log( '(record_country,country_selected,keep) = (' + one_record.country + ',' + country_selected + ',' + keep_record + ')'  );
    return keep_record;
}

// Render the table for the first time on page load
renderTable2();
