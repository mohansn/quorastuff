function drawPieChart (piedata) 
{
    var chart = new d3pie ("chart", {
        size: {
            canvasHeight: 700,
            canvasWidth: 800
        },
        header: {
            title: {
                text: "Here is your pie!",
                fontSize: 30
            },
            subtitle: {
                text: "Click on any slice to see answers on that topic",
                fontSize: 18
            }
        },
        tooltips: {
            enabled: true,
            type: "placeholder",
            string: "{label}: {percentage}%",
            styles: {
                fadeInSpeed: 200,
                backgroundColor: "AliceBlue",
                backgroundOpacity: 0.8,
                color: "Chocolate",
                borderRadius: 4,
                font: "verdana",
                fontSize: 16,
                padding: 20
            }
        },
        data: {
            content: piedata
        },
        callbacks: {
            onClickSegment: function(a) {
                window.open (a.data.link);
            }
        }
    });
}
