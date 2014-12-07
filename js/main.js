$(document).ready(function () {
    $( "form" ).submit(function( event ) {
        $('#chart').empty();
        $('#pp').empty();
        $('#chart-image').empty()
        
        var user_url = $("#textinput").val();
        if (user_url.match (/qr.ae/)) {
            console.log ("Got a short URL");
            console.log (user_url);
            $.ajax ({
                url: "/getfullurl",
                type: 'get',
                data: {
                    url: user_url,
                    async: false
                },
                success : function (data) {
                    user_url = data;
                    console.log ("Now URL is " + user_url);
                }
            });
        }

        $.ajax({
            url:"/getdata",
            type: 'get',
            data: {
                'user': user_url,
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
                $('#chart').append( "<button class='btn btn-primary' data-toggle='modal' data-target='#myModal' id='chart-save'>Get Chart Image</button>");
            },
            error: function (data) {
                // TODO: Failback using local HTML files
                alert ("Failed to get data. Please try again.");
            }

        });
        event.preventDefault();
    });

    $('#chart').on('click', '#chart-save', function(){
      svgAsDataUri($('#chart svg')[0], null, function(uri) {
        $('#chart-image').html('<img width=250 src="' + uri + '" />');
        $('#chart-image').append("<button class='btn btn-primary' id='image-save'>Save Image</button> <button class='btn btn-danger' data-dismiss='modal'>Cancel</button>");
      });
    });

    $('#chart-image').on('click', '#image-save', function(){
      saveSvgAsPng($('#chart svg')[0], $("#textinput").val().replace('-','_')+".png", 2);
    });

});
