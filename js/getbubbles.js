$(document).ready(function () {
    console.log ("in document ready");
    $('#bubbles').empty();
    $('body').append("<div id=\"bubbles\"></div>");
    $( "form" ).submit(function( event ) {
        console.log ("in form submit");
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
                // Send to D3 for plot
                console.log ("sending to drawbubbles");
                drawBubbles (JSON.parse(data));
                $('body').scrollTo($('#bubbles'),{duration:1000});
            },
            error: function (data) {
                // TODO: Failback using local HTML files
                alert ("Failed to get data. Please try again.");
            }
        }); // ajax call to /getdata 
        event.preventDefault();
    }); // form submit
}); // $(document).ready()
    