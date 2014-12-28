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
