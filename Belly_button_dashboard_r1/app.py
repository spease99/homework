from flask import Flask, jsonify, render_template
import pandas as pd
from pull_data import pull_sample_names, pull_otu_description, pull_meta_data, pull_washing_freq,pull_sample
from pull_data import pull_sample_names_dict

app = Flask(__name__)

@app.route("/")
def home():
    """Return the dashboard homepage."""
    return render_template('index.html')
    #return "Welcome!"

@app.route('/names')
def return_name():
    """List of sample names."""
    #static data for now
    #data = pull_sample_names()   #returned a list
    data = pull_sample_names_dict()  #returns a dict with one item, which is a list
    return jsonify(data)   


@app.route('/otu')
def return_otu():
    """Return list of OTU descriptions"""
    #static data for now
    data = pull_otu_description()
    return jsonify(data)  

        
@app.route('/wfreq/<sample>')
def wfreq(sample):
    data =  pull_washing_freq(sample)
    #return jsonify(data)
    return data
 
@app.route('/metadata/<sample>')
def metadata(sample):
    """MetaData for a given sample.
    Args: Sample in the format: `BB_940`"""
    data =  pull_meta_data(sample)
    #return jsonify(data)
    return data
        
@app.route('/samples/<sample>')
def return_sample(sample):
    """OTU IDs and Sample Values for a given sample.

    Sort your Pandas DataFrame (OTU ID and Sample Value)
    in Descending Order by Sample Value

    Return a list of dictionaries containing sorted lists  for `otu_ids`
    and `sample_values` """
    #static data for now
    data = [
        {
            otu_ids: [
                1166,
                2858,
                481
            ],
            sample_values: [
                163,
                126,
                113
            ]
        }
    ]      
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)