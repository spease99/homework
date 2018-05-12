
# coding: utf-8

# In[1]:

'''
#Mission to Mars
#Scrap various websites and store the data into mongoDB
'''


# In[2]:

import time
from selenium import webdriver
from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd
import requests
import pymongo
import numpy as np

headless_URL_calls = False


# In[3]:

'''
#URLs to search
'''
mars_twitter_weather_ulr = 'https://twitter.com/marswxreport?lang=en'  #mars weather twitter url
jpg_news_url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
nasa_news_url = 'https://mars.nasa.gov/news/?page=0&per_page=40&order=publish_date+desc%2Ccreated_at+desc&search=&category=19%2C165%2C184%2C204&blank_scope=Latest'
mars_facts_url = 'https://space-facts.com/mars/'
mars_hemisperes_url ='https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'


# In[4]:

def get_mars_news(): 
    '''
    Scrape for Nasa news site and pass back top news title and paragrap
    '''
    executable_path = {'executable_path': 'chromedriver.exe'}      #spec the browser 
    browser = Browser('chrome', **executable_path,headless = headless_URL_calls) #init browser
    browser.visit(nasa_news_url)                                   #load initial html page
    nasa_news = BeautifulSoup(browser.html, 'html.parser')  #parse it
    results = nasa_news.find_all('div',class_="content_title")   # 
    nasa_news_title = results[0].text  #variable to be used later
    nasa_news_title_page = 'https://mars.nasa.gov' + results[0].a['href']
    #print(nasa_news_title_page)
    browser.visit(nasa_news_title_page)                 #load lead story html page in order to get the full texts
    nasa_news = BeautifulSoup(browser.html, 'html.parser')  #parse it
    results2 = nasa_news.find_all('div',class_="wysiwyg_content")   # 
    for paragraph in results2:
        nasa_news_paragraph = paragraph.text    #variable to be used later
    browser.quit()
    
    news_dict = {'mars_news_headline':nasa_news_title,'mars_news_story':nasa_news_paragraph}
    
    return  news_dict


# In[5]:




# In[6]:

#****************************JPL Mars Space Image scrapping**********************************
def get_mars_image_url():
    ''' Scrape JPL web page for an cool image###
    #init splinter and Browser
    '''
    executable_path = {'executable_path': 'chromedriver.exe'}      #spec the browser 
    browser = Browser('chrome', **executable_path,headless =  headless_URL_calls) #init browser
    #pull the URL
    browser.visit(jpg_news_url)                 #load initial html page
    browser.click_link_by_partial_text('FULL')  #click on the FULL 
    #parse the html
    page_html = browser.html
    jpl_mo_info = BeautifulSoup(page_html, 'lxml')   #parse the html
    results = jpl_mo_info.find('a',class_="button fancybox")
    featured_image_url='https://www.jpl.nasa.gov/'+results['data-fancybox-href']  #build the url
    #print(featured_image_url)
    browser.quit()
    return {'mars_feactur_image_url': featured_image_url}


# In[7]:

#****************************Mars Weather Tweets**********************************
def get_mars_weather_tweet(): #scrape twitter feed for latest Mars weather
    '''
    #Scrape twitter for the Mars weather
    '''
    
    #init splinter and Browser
    executable_path = {'executable_path': 'chromedriver.exe'}      #spec the browser 
    browser = Browser('chrome', **executable_path,headless = headless_URL_calls) #init browser
    
    #Scrape for Twitter Mars weather
    browser.visit(mars_twitter_weather_ulr)   #get the html page
    page = browser.html
    mars_weather = BeautifulSoup(page, 'html.parser')  #parse it
    
    #Get the latest (first) tweet on weather
    record = mars_weather.find('p',class_="TweetTextSize TweetTextSize--normal js-tweet-text tweet-text")
    mars_weather = record.text
    browser.quit()
    return {'mars_weather':mars_weather}


# In[13]:

#****************************Mars Facts**********************************
def get_mars_facts_table():
    '''
    #Scrape for the Mars fact table
    '''
    
    #init splinter and Browser
    #executable_path = {'executable_path': 'chromedriver.exe'}      #spec the browser 
    #browser = Browser('chrome', **executable_path,headless = headless =  headless_URL_calls) #init browser
    
    #Scrape  Mars facts
    r = requests.get(mars_facts_url)   #get the html page
    mars_facts = BeautifulSoup(r.text,'html.parser')  #parse it
    
    #Get facts table data
    record = mars_facts.find('table',class_="tablepress tablepress-id-mars")
    
    #Get the data into a data structure
    record_colm1 = mars_facts.find_all('td',class_="column-1")  #filter for the data titles
    record_colm2 = mars_facts.find_all('td',class_="column-2")  #filter for the data value itself
    data_title=[]                                               #There is like a better way, but persue in the afterlife
    data_value=[]
    for title,value in zip(record_colm1,record_colm2):          #make lists of titles and data
        data_title.append(title.text)
        data_value.append(value.text)  
    matrix = np.matrix([data_title,data_value]).transpose()
    mars_data_df = pd.DataFrame(data=matrix,columns=['Data_title','Data_fact'])
    mars_data_df.replace('\n','',inplace=True,regex=True)  #take out the annoying random new line '\n'
    mars_table_string = mars_data_df[['Data_title','Data_fact']].to_html(header=False,index=False)
    
    #prep for format needed for bootstrap
    mars_strings = mars_table_string.split('\n')
    mars_strings = mars_strings[1:]  # drop the leading <table> and use the bootstrap one
    mars_strings = mars_strings[:-1]  # drop the tailing </table> and use the bootstrap one
    mars_strings = '\n'.join(mars_strings) #convert by 

    #return {'mars_facts_table':mars_data_html_string}
    #print(mars_data_df.to_records())
    #print('-------------------')
    #print(mars_data_df[['Data_title','Data_fact']].to_html(header=False,index=False))
    return {'mars_facts_table':mars_strings}


# In[9]:

#****************************Mars Hemisperes**********************************

def get_mars_hemi_urls():  #get the title and url for the mars hemisheres, and pass back in a dictionary
    '''
    #Scrape for the four images
    '''
    
    #init splinter and Browser
    executable_path = {'executable_path': 'chromedriver.exe'}      #spec the browser 
    browser = Browser('chrome', **executable_path,headless = headless_URL_calls) #init browser 

    hemi_dict = []
    sub_sites = ['Cerb','Schi','Syrt','Valles']

    #pull the URL    
    for key_word in sub_sites:
        browser.visit(mars_hemisperes_url)                 #load initial html page
        browser.click_link_by_partial_text(key_word)       #click on the hyperlink

        page_html = browser.html
        jpl_mo_info = BeautifulSoup(page_html, 'lxml')     #parse the html

        #get the title of the Hemisphere
        title = jpl_mo_info.find('head').title.text
        title = title.split('|')[0]  #drop trailing repetitive USGS logo
        title = title.split('Enhanced')[0]  # drop the trailing Enhanced 
        
        results_image_class = jpl_mo_info.find('div',class_='downloads')

        img_url = results_image_class.a['href']

        hemi_dict.append({'title_hemi_'+key_word:title})
        hemi_dict.append({'img_url_'+key_word:img_url})


    browser.quit()
    return hemi_dict


# In[14]:

def scrape_for_data():
    '''
    scrape various websites for Mars info.
    Pass back parameter to be stored in a different routine. 
    '''
    
    debug = 0
    
    nasa_news_dict = get_mars_news()
    if debug:
        print(nasa_news_dict)

    nasa_mars_feacture_image_url_dict = get_mars_image_url()
    if debug:
        print(nasa_mars_feacture_image_url_dict)
    
    mars_weather_dict = get_mars_weather_tweet()
    if debug:
        print(mars_weather_dict)
        
    mars_facts_table_html_dict = get_mars_facts_table()
    if debug:
        print(mars_facts_table_html_dict)
        
    mars_hemi_dict = get_mars_hemi_urls()
    if debug:        
        print(mars_hemi_dict)
    #[news,image,weather,facts,hemi_image]
    
    return [nasa_news_dict,nasa_mars_feacture_image_url_dict,mars_weather_dict,mars_facts_table_html_dict,mars_hemi_dict]
    


# In[11]:

def write_scrape_to_db():  
    '''
    call scraper and overwrite data base with the current data
    '''
    
    #init the database connection
    conn = 'mongodb://localhost:27017'
    client = pymongo.MongoClient(conn)
    db = client.nasaDB
    db.nasaDB.delete_many({})   #clearout (delete) the data base from last time
    
    #do the scraping
    [news,image,weather,facts,hemi_image] = scrape_for_data()
    
    #write to the database
    db.nasaDB.insert_one(news)
    db.nasaDB.insert_one(image)
    db.nasaDB.insert_one(weather)
    db.nasaDB.insert_one(facts)
    db.nasaDB.insert_many(hemi_image)


# In[12]:




# In[ ]:



