""" Cookies obtained using a chrome extension """
qcookies={'RT':'dm=quora.com&si=4c8473bc-c6cd-462d-9f7d-516ac9f29b07&ss=1410280920878&sl=9&tt=26883&obo=0&bcn=%2F%2F36fb619d.mpstat.us%2F&nu=&cl=1410313958445&r=https%3A%2F%2Fwww.quora.com%2Fmessages%2Fthread%2F597458&ul=1410313958464&hd=1410313958845','_utma':'261736717.188177246.1399826039.1407837233.1407849064.450','__utmz':'261736717.1407820142.447.252.utmcsr=quora.com|utmccn=(referral)|utmcmd=referral|utmcct=/messages/thread/569086','_ga':'GA1.2.188177246.1399826039','m-b':"7_sQa0FRvAouJ7bOys4Cgw\075\075",'m-f':"dsTIV_bt6pJqbOrHASxxCSji5dE99aNGzMwg",'m-from-app':'1','m-s':"ejAslkPeWnRIy89uPR-Qmw\075\075",'m-tz':'-4752'};

qurl = 'http://www.quora.com/'
qurls = 'https://www.quora.com/'
user = ''
part1="""
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta name=viewport content="width=device-width, initial-scale=1">
    <style>
      .title {
          text-align:center;
          font-family:sans-serif;
      }
      .title-link {
          text-decoration:none;
      }
      h2  {
          text-align:center;
          font-family:helvetica,arial,sans-serif;
      }
    </style>
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript">
      google.load("visualization", "1", {packages:["corechart"]});
      google.setOnLoadCallback(drawChart);

      function drawChart() {"""
part2="""
        var options = {
          title: '',
          is3D: true
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
        function selectHandler () {
              var selectedRow = chart.getSelection()[0];
              if (selectedRow) {
		  window.open(answer_links[selectedRow.row])
              }
        }
        google.visualization.events.addListener (chart, 'select', selectHandler);
        chart.draw(data, options);
      }
    </script>
  </head>
  <body>
    <h1 class="title">
      <a class="title-link" href="http://www.quora.com/"""
part4="""/topics"> Answers by Topic</a>
    </h1>
    <h2>
      Click on any pie slice to see answers on that topic
    </h2>
    <div id="piechart_3d" style="width: 1400px; height: 800px;"></div>
  </body>
</html>"""
