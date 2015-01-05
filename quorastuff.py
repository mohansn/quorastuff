from google.appengine.api import users
import webapp2
import cgi
from genhtml import get_topic_data_json, get_profile_pic_path
from data import qurl

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
            
application = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/howdy', Howdy),
    ('/MasterSharath', MasterSharath),
    ('/calligraphyAnswer', Calligraphy),
    ('/bbwiccr', BBW_ICCR),
    ('/How_to_converse', Converse),
    ('/getdata', GetData),
    ('/getpic', GetProfilePic),
    ('/getfullurl', GetFullURL),
    ('/GetSomePie', PieCharts)
], debug=True)
