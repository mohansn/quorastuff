$(document).ready(function() {
    fontlist = ["Tangerine","Dancing Script", "Pinyon Script","Vollkorn"];
    $('#real').hide();
    $('#message').hide();
    $('#initial').click(function () {
        $(this).hide();
        $('#real').fadeIn('slow');
        $('#message').fadeIn('slow');
        $('#message').fadeOut(1000);
    });
    $('span').draggable();
    $('span').click(function() {
        console.log(fontlist[Math.floor((Math.random() * 10))]);
        $(this).fadeToggle ('slow');
        $(this).css('font-family',fontlist[Math.floor((Math.random() * 4))]);
        $(this).css('color', 'rgb(' + Math.floor((Math.random() * 255)) + ', ' + Math.floor((Math.random() * 255)) + ', ' + Math.floor((Math.random() * 255)) + ')' );
        console.log ($(this).css ('color'));
        $(this).fadeToggle ('slow');
    });
    $('span').dblclick (function() {
        $('span').effect ('explode');
        $('span').show ('slow');
    });
});

                     