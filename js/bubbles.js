$(document).ready(function () {
        $.ajax({
            url:"/getdata",
            type: 'get',
            data: {
                'user': 'https://www.quora.com/Vivek-Verma-1',
                async:false
            },
            success: function (data) {
                // Send to D3 for plot
                drawBubbles (JSON.parse(data));
            },
            error: function (data) {
                // TODO: Failback using local HTML files
                alert ("Failed to get data. Please try again.");
            }
        });
});
