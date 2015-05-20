""" Generate the complete HTML page containing the pie chart for user answers per topic on Quora"""
from bs4 import BeautifulSoup
import requests
import sys
import json

from urllib2 import Request, build_opener, HTTPCookieProcessor, HTTPHandler
import cookielib

qurl = 'http://www.quora.com/'
qurls = 'https://www.quora.com/'

""" Return Quora cookies for use with retrieving topic data """
def get_quora_cookies ():
    return json.load (open('cookies.json', 'r'))

qcookies = get_quora_cookies ()

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

def get_profile_path (user):
    """ Ensure that we have a valid profile url """
    profile_path = ''
    if ('quora.com/' in user):
        profile_path = user
    else:
        profile_path = qurls + user

    return profile_path

def get_topics_path (user):
    topics_path = ''
    if ('quora.com/' in user):
        topics_path = qurls + user.split('quora.com/')[1] + '/topics'
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

def get_profile_pic_path (user):
    r = requests.get (get_profile_path(user))
    if (r.status_code != 200):
        r.raise_for_status()
    soup = BeautifulSoup(r.text)
    img_path = soup.find (class_ = "profile_photo_img").get("src")
    if img_path is not None:
        return img_path
    else:
        return ""

def get_full_url (short_url):
    r = requests.get (short_url)
    full_url = r.url.split('?')[0]
    print "Full URL is %s \n" % full_url
    return full_url

def get_follower_count (user):
    r = requests.get (get_profile_path(user), cookies=qcookies)
    if (r.status_code != 200):
        r.raise_for_status()
    soup = BeautifulSoup(r.text)
    # find the span containing the follower count on the profile page
    # Remove the commas
    fc = int(soup.select ('li.FollowersNavItem > a > span')[0].text.replace (",",""))
    return fc
