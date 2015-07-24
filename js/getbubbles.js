$(document).ready(function () {
    $( "form" ).submit(function( event ) {
        $('#bubbles').empty();
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
                drawBubbles (JSON.parse(data));
                $('#bubbles').prepend('<h1> Drag the bubbles around for fun,\n\t click on them to see answers in that topic</h1>');
                $('body').scrollTo($('#bubbles'),{duration:1000});
                $('#bubbles > svg > circle').on ("mouseover", function () {
                    $(this).css ("opacity", 0.8);
                });
                $('#bubbles > svg > circle').on ("mouseout", function () {
                    $(this).css ("opacity", 1);
                });
            },
            error: function (data) {
                // TODO: Failback using local HTML files
                alert ("Failed to get data. Please try again.");
            }
        }); // ajax call to /getdata 
        event.preventDefault();
    }); // form submit
}); // $(document).ready()
    