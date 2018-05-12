import time
from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd
from selenium import webdriver


def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    #executable_path = {"executable_path": "/usr/local/bin/chromedriver"}
    executable_path = {"executable_path": "chromedriver"}
    return Browser("chrome", **executable_path, headless=False)


def scrape():

    if 0:  #original code from example

        browser = init_browser()
        listings = {}

        url = "https://raleigh.craigslist.org/search/hhh?max_price=1500&availabilityMode=0"
        browser.visit(url)
        time.sleep(1)

        html = browser.html
        soup = BeautifulSoup(html, "html.parser")

        listings["headline"] = soup.find("a", class_="result-title").get_text()
        listings["price"] = soup.find("span", class_="result-price").get_text()
        listings["hood"] = soup.find("span", class_="result-hood").get_text()

        return listings
