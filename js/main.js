$(document).ready(function () {
    $( "form" ).submit(function( event ) {
        $.ajax({
            url:"/getdata",
            type: 'get',
            data: {
                'user': $("#textinput").val(),
                async:false
            },
            success: function (data) {
                $('body').append("<div id=\"chart\"></div>");
                // Send to D3 for plot
                drawPieChart (JSON.parse(data));
                $('body').scrollTo($('#chart'),{duration:1000});
            },
            error: function (data) {
                // TODO: Failback using local HTML files
                alert ("data load failed");
            }

        });
        event.preventDefault();
    });
});
