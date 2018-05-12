# -*- coding: utf-8 -*-
"""
Created on Sun May  6 17:50:28 2018

@author: Scott
"""
from flask import Flask, render_template, jsonify, redirect
import pymongo

import scrape_mars

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Database Setup
#################################################
conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)
db = client.nasaDB


#################################################
# Flask Routes
#################################################
@app.route("/")
def welcome():

    #hurricanes =     list(db.collection.find())
    #mars_facts_list =  list(db.nasaDB.find({'mars_facts_table':{'$exists': 1}}))
    #mars_hemi_url_list = list(db.nasaDB.find())
    #mars_hemi_img_dict = db.nasaDB.distinct('img_url')
    #print('mars_hemi_img_dict = ' + str(mars_hemi_img_dict))
    #return render_template("index.html", hurricanes=hurricanes)
    
    nasa_db = db.nasaDB.find()
    nasa_db1 = db.nasaDB.find()
    nasa_db2 = db.nasaDB.find()
    nasa_db3 = db.nasaDB.find()    
    nasa_db4 = db.nasaDB.find() 
    nasa_db5 = db.nasaDB.find() 
    nasa_db6 = db.nasaDB.find() 
    nasa_db7 = db.nasaDB.find() 
    nasa_db8 = db.nasaDB.find() 
    nasa_db9 = db.nasaDB.find() 
    nasa_db10 = db.nasaDB.find() 
    nasa_db11 = db.nasaDB.find() 
    nasa_db12 = db.nasaDB.find() 
    nasa_db13 = db.nasaDB.find() 
    
    
    return render_template("index_mars_r12.html", nasa_db=nasa_db,nasa_db1=nasa_db1,nasa_db2=nasa_db2,nasa_db3=nasa_db3, \
            nasa_db4=nasa_db4,nasa_db5=nasa_db5,nasa_db6=nasa_db6, \
            nasa_db7=nasa_db7,nasa_db8=nasa_db8, \
            nasa_db9=nasa_db9,nasa_db10=nasa_db10,nasa_db11=nasa_db11,nasa_db12=nasa_db12,\
            nasa_db13=nasa_db13
            )

@app.route("/scrape")
def scrape():

    scrape_mars.write_scrape_to_db   #call to scape the websites and store the data to the MongoDB
    
    return redirect("http://localhost:5000/", code=302)         
            
if __name__ == "__main__":
    app.run(debug=True)
