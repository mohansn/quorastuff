from google.appengine.api import users
import webapp2
import cgi
from genhtml import get_topic_data_json
from data import qurl

class MainPage(webapp2.RequestHandler):
    def get(self):
        self.response.write("<html><body><h1>Nothing here yet!</h1></body></html>")

class SM (webapp2.RequestHandler):
    def get(self):
        fp = open('Shreesha-Mokhashi.html','r')
        if (fp):
            html = fp.read()
            self.response.write(html)
            fp.close()

class AP (webapp2.RequestHandler):
    def get(self):
        fp = open('ap.html','r')
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

class GetData (webapp2.RequestHandler):
    def get(self):
        pname = cgi.escape(self.request.get ('user'))
        print ('GetData: Got user = ');
        print (pname)
        return self.response.write (get_topic_data_json (pname))

class PieCharts (webapp2.RequestHandler):
    def get (self):
        with open ('getpie.html', 'r') as fp:
            self.response.write (fp.read())
            fp.close()
            
application = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/Shreesha-Mokhashi', SM),
    ('/Aalhad-Parulekar', AP),
    ('/howdy', Howdy),
    ('/MasterSharath', MasterSharath),
    ('/getdata', GetData),
    ('/GetSomePie', PieCharts)
], debug=True)
