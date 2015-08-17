from google.appengine.api import users
from google.appengine.ext import ndb
import webapp2
import cgi
import logging
from genhtml import get_topic_data_json, get_profile_pic_path
import json
import requests

class Poll (ndb.Model):
    name = ndb.StringProperty()
    age = ndb.StringProperty()
    beverages = ndb.StringProperty()

class MainPage(webapp2.RequestHandler):
    def get(self):
        fp = open('index.html','r')
        if (fp):
            html = fp.read()
            self.response.write(html)
            fp.close()


class Howdy (webapp2.RequestHandler):
    def get(self):
        fp = open('howdy.html','r')
        if (fp):
            html = fp.read()
            self.response.write(html)
            fp.close()

class MasterSharath (webapp2.RequestHandler):
    def get(self):
        with open('ms.html','r') as fp:
            self.response.write(fp.read())
            fp.close()

class Calligraphy (webapp2.RequestHandler):
    def get(self):
        with open('calligraphy.html','r') as fp:
            self.response.write(fp.read())
            fp.close()

class BBW_ICCR (webapp2.RequestHandler):
    def get(self):
        with open('is_cosmic_consciousness_real.html','r') as fp:
            self.response.write(fp.read())
            fp.close()

class Converse (webapp2.RequestHandler):
    def get(self):
        with open('How_to_converse.html','r') as fp:
            self.response.write(fp.read())
            fp.close()

class VVBubbles (webapp2.RequestHandler):
    def get (self):
        with open ('bubbles.html') as fp:
            self.response.write (fp.read())
            fp.close()

class GetBubbles (webapp2.RequestHandler):
    def get (self):
        with open ('getbubbles.html') as fp:
            self.response.write (fp.read())
            fp.close()

class GetData (webapp2.RequestHandler):
    def get(self):
        pname = cgi.escape(self.request.get ('user'))
        print ('GetData: Got user = ');
        print (pname)
        return self.response.write (get_topic_data_json (pname))

class GetProfilePic (webapp2.RequestHandler):
    def get (self):
        pname = cgi.escape (self.request.get ('user'))
        return self.response.write (get_profile_pic_path (pname))

class GetFullURL (webapp2.RequestHandler):
    def get (self):
        url = cgi.escape (self.request.get ('url'))
        return self.response.write (get_full_url (url))

class PieCharts (webapp2.RequestHandler):
    def get (self):
        with open ('getpie.html', 'r') as fp:
            self.response.write (fp.read())
            fp.close()

class QuoransOfTheDay (webapp2.RequestHandler):
    def get (self):
        with open ('qotd.html') as fp:
            self.response.write (fp.read())
            fp.close()

class HBDSH (webapp2.RequestHandler):
    def get (self):
        with open ('hbdsh.html') as fp:
            self.response.write (fp.read())
            fp.close()

class HBDDMK (webapp2.RequestHandler):
    def get (self):
        with open ('hbddmk.html') as fp:
            self.response.write (fp.read())
            fp.close()

class Webapp2 (webapp2.RequestHandler):
    def post (self):
        name = cgi.escape (self.request.get ('name'))
        age = cgi.escape (self.request.get ('age'))
        bev = cgi.escape (self.request.get ('beverage'))
        logging.info ("hi\n")
        logging.info ("Name: " + str(name) + "\n")
        logging.info ("Age: " + str(age) + "\n")
        if (name is None or age is None):
            logging.warning ("POST: No data received")
        else:
            pollentry = Poll (parent=ndb.Key('Poll','parent'), name=str(name), age=str(age), beverages = str(bev))
            pollentry.put()
        
    def get (self):
        logging.info ("Hi (GET)\n")
        pollentries = Poll.query(ancestor=ndb.Key('Poll', 'parent')).fetch()
        if (len(pollentries) is 0):
            logging.warning ("No entries found!")
        for pollentry in pollentries:
            logging.info (str(pollentry.name))
            logging.info (str(pollentry.age))
            self.response.write ("Name: " + pollentry.name + "\n Age: " + pollentry.age + "\n Beverages: " + pollentry.beverages + "\n")
        
class YSRT (webapp2.RequestHandler):
    def post (self):
        answer_1 = cgi.escape (self.request.get ('answer_1'))
        answer_2 = cgi.escape (self.request.get ('answer_2'))
        answer_3 = cgi.escape (self.request.get ('answer_3'))
        submitter = cgi.escape (self.request.get ('submitter'))
        comments = cgi.escape (self.request.get ('comments'))

        if (answer_1 is None):
            logging.warning ("POST: No data received")
        else:
            # Post to Parse
            
            if (not answer_1):
                logging.warning ("CANNOTHAPPEN!! Answer 1 is blank.\n")
            else:
                r = requests.post ('https://api.parse.com/1/classes/Answer',
                                   data=json.dumps ({'answer':str(answer_1),
                                                     'submitter':str(submitter),
                                                     'comments':str(comments)}),
                                   headers=json.load (open ('parse-rest-headers.txt')))
                if (r.status_code != 200 and r.status_code != 201):
                    logging.warning ("POST: answer_1 failed\n")
                    r.raise_for_status ()
                else:
                    logging.info ("POST: answer 1 succeeded\n")
                    
            if (len(answer_2.strip()) == 2):
                pass
            else:
                r = requests.post ('https://api.parse.com/1/classes/Answer',
                                   data=json.dumps ({'answer':str(answer_2),
                                                     'submitter':str(submitter),
                                                     'comments':str(comments)}),
                                   headers=json.load (open ('parse-rest-headers.txt')))
                if (r.status_code != 200 and r.status_code != 201):
                    logging.warning ("POST: answer_2 failed\n")
                    r.raise_for_status ()
                else:
                    logging.info ("POST: answer 2 succeeded\n")

            if (len(answer_3.strip()) == 2):
                pass
            else:
                r = requests.post ('https://api.parse.com/1/classes/Answer',
                                   data=json.dumps ({'answer':str(answer_3),
                                                     'submitter':str(submitter),
                                                     'comments':str(comments)}),
                                   headers=json.load (open ('parse-rest-headers.txt')))
                if (r.status_code != 200 and r.status_code != 201):
                    logging.warning ("POST: answer_3 failed\n")
                    r.raise_for_status ()            
                else:
                    logging.info ("POST: answer 3 succeeded\n")
            
        
    def get (self):
        pass
        
application = webapp2.WSGIApplication([
        ('/', MainPage),
        ('/howdy', Howdy),
        ('/MasterSharath', MasterSharath),
        ('/calligraphyAnswer', Calligraphy),
        ('/bbwiccr', BBW_ICCR),
        ('/How_to_converse', Converse),
        ('/vvbubbles', VVBubbles),
        ('/getbubbles', GetBubbles),
        ('/getdata', GetData),
        ('/getpic', GetProfilePic),
        ('/getfullurl', GetFullURL),
        ('/GetSomePie', PieCharts),
        ('/qotdlist', QuoransOfTheDay),
        ('/hbdsh', HBDSH),
        ('/hbddmk', HBDDMK),
        ('/beverages', Webapp2),
        ('/ysrt', YSRT)
        ], debug=True)
