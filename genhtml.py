""" Generate the complete HTML page containing the pie chart for user answers per topic on Quora"""
from bs4 import BeautifulSoup
import requests
import sys

from urllib2 import Request, build_opener, HTTPCookieProcessor, HTTPHandler
import cookielib
from data import *

""" Return Quora cookies for use with retrieving topic data """
def get_quora_cookies ():
    return qcookies

""" Method to programmatically get cookies - doesn't work at the moment"""
def get_quora_cookies_doesnt_work ():
# From http://stackoverflow.com/questions/921532/retrieving-all-cookies-in-python
# Create a CookieJar object to hold the cookies
    cj = cookielib.CookieJar()
#Create an opener to open pages using the http protocol and to process cookies.
    opener = build_opener(HTTPCookieProcessor(cj), HTTPHandler())

#create a request object to be used to get the page.
    req = Request(topics_path)
    f = opener.open(req)
    cookies = {}

    for c in cj:
        cookies[c.name] = c.value
    return cookies

def get_topics_path (user):
    topics_path = ''
    if qurl in user:
        topics_path = user + '/topics' # If user provides the whole user profile link
    elif qurls in user:
        topics_path = user + '/topics'
    else:
        topics_path = qurls + user + '/topics'

    return topics_path


def get_topic_data (user):
    topics_path = get_topics_path (user)
    r = requests.get(topics_path, cookies = qcookies)
    if (r.status_code != 200):
        r.raise_for_status()
    soup = BeautifulSoup(r.text)
    boxes = soup.find_all(class_="ObjectCard UserTopicPagedListItem PagedListItem")
    topic_data = [['Topics','Answers']]

    links = ['http://www.quora.com' + t.find('a').attrs['href'] for t in soup.find_all (class_="ObjectCard-body") if t.find('a') is not None]
    for box in boxes:
        topic_names = box.find(class_="TopicName")
        box = box.find(class_="ObjectCard-body")
        answer_count = None
        if (box.find('a') is not None):
            answer_count = box.find('a').text 
        if (answer_count):
            answer_count = [int (s) for s in answer_count.split() if s.isdigit()]
            topic_data.append([topic_names.text.encode('utf-8'), answer_count[0]])
    return (links,topic_data)

def get_topic_data_json (user):
    topics_path = get_topics_path (user)
    r = requests.get(topics_path, cookies = qcookies)
    if (r.status_code != 200):
        r.raise_for_status()
    soup = BeautifulSoup(r.text)
    boxes = soup.find_all(class_="ObjectCard UserTopicPagedListItem PagedListItem")
    topic_data = [['Topics','Answers']]

    links = ['http://www.quora.com' + t.find('a').attrs['href'] for t in soup.find_all (class_="ObjectCard-body") if t.find('a') is not None]
    for box in boxes:
        topic_names = box.find(class_="TopicName")
        box = box.find(class_="ObjectCard-body")
        answer_count = None
        if (box.find('a') is not None):
            answer_count = box.find('a').text 
        if (answer_count):
            answer_count = [int (s) for s in answer_count.split() if s.isdigit()]
            topic_data.append([topic_names.text.encode('utf-8'), answer_count[0]])
    import json
    json_data = []
    for i in range(len(links)):
        x = topic_data[i+1][0]
        y = topic_data[i+1][1]
        link = links[i]
        json_data.append ({"label":x,"value":y, "link":link})
    
    return json.dumps (json_data)


""" Combine data and fixed templates to create output file """
def write_output_file (user):
    links,topic_data = get_topic_data(user)
    fp = open (user+'.html','w')
    if (fp is not None):
        result = part1 + '\n' + 10 * ' ' + 'var answer_links = ' + str(links) + ';\n'
        result = result + 10 * ' ' + 'var data = google.visualization.arrayToDataTable(' + str(topic_data) + ');\n'
        result = result + part2
        result = result + user
        result = result + part4
        fp.write (result)
        fp.close ()
    else:
        print "Unable to create output file"

def get_html (user):
    links,topic_data = get_topic_data(user)
    result = part1 + '\n' + 10 * ' ' + 'var answer_links = ' + str(links) + ';\n'
    result = result + 10 * ' ' + 'var data = google.visualization.arrayToDataTable(' + str(topic_data) + ');\n'
    result = result + part2
    result = result + user
    result = result + part4
    return result

def write_all_output_files ():
    users = [l.rstrip('\n') for l in open('users.txt', 'r').readlines()]
    for user in users:
        print user
        write_output_file (user)

