$(document).ready(function () {
    $( "form" ).submit(function( event ) {
        $('#chart').empty();
        $('#pp').empty();

        $.ajax({
            url:"/getdata",
            type: 'get',
            data: {
                'user': $("#textinput").val(),
                async:false
            },
            success: function (data) {

                $.ajax ({
                    url: "/getpic",
                    type: 'get',
                    data: {
                        'user' : $('#textinput').val()
                    },
                    success: function (data) {
                        $('#pp').html ("<img src=" + data + ">");
                    },
                    error: function (data) {
                        $('#pp').html ("<img src=\"http://placekitten.com/g/200/200\">");
                    }
                });
                // Send to D3 for plot
                drawPieChart (JSON.parse(data));
                $('body').scrollTo($('#chart'),{duration:1000});
            },
            error: function (data) {
                // TODO: Failback using local HTML files
                alert ("Failed to get data. Please try again.");
            }

        });
        event.preventDefault();
    });
});
