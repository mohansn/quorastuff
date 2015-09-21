from google.appengine.api import users
import webapp2
import cgi
from genhtml import get_topic_data_json, get_profile_pic_path

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

class QuoransOfTheWeek (webapp2.RequestHandler):
    def get (self):
        with open ('qotw.html') as fp:
            self.response.write (fp.read())
            fp.close()

class HBDDT (webapp2.RequestHandler):
    def get (self):
        with open ('hbddt.html') as fp:
            self.response.write (fp.read())
            fp.close()

class HBDCC (webapp2.RequestHandler):
    def get (self):
        with open ('hbdcc.html') as fp:
            self.response.write (fp.read())
            fp.close()

class HBDNS (webapp2.RequestHandler):
    def get (self):
        with open ('hbdns.html') as fp:
            self.response.write (fp.read())
            fp.close()

class HBDAA (webapp2.RequestHandler):
    def get (self):
        with open ('hbdaa.html') as fp:
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

class HBDKGN (webapp2.RequestHandler):
    def get (self):
        with open ('hbdkgn.html') as fp:
            self.response.write (fp.read())
            fp.close()

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
    ('/qotwlist', QuoransOfTheWeek),
    ('/hbdns', HBDNS),
    ('/hbddt', HBDDT),
    ('/hbdcc', HBDCC),
    ('/hbdaa', HBDAA),
    ('/hbdsh', HBDSH),
    ('/hbddmk', HBDDMK),
    ('/hbdkgn', HBDKGN)
], debug=True)
