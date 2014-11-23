function drawPieChart (piedata) 
{
    var chart = new d3pie ("chart", {
        size: {
            canvasHeight: 700,
            canvasWidth: 800
        },
        header: {
            title: {
                text: "Stats for Quorans of the Day",
                fontSize: 30
            },
            subtitle: {
                text: "Click on any slice to see answers on that topic",
                fontSize: 18
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
