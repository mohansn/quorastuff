$(document).ready(function() {
    fontlist = ["Tangerine","Dancing Script", "Pinyon Script","Vollkorn"];
    $('#real').hide();  // Hide the "Thank you ..." message
    $('#message').hide(); // Hide the "Keep clicking..." message

    // When Sharath-avare clicks the precioussss message....
    $('#initial').click(function () {
        $(this).hide(); // hide it
        $('#real').fadeIn('slow');  // bring in the real message slowly
        $('#message').fadeIn('slow'); // Remind Sharath-avare to keep clicking
        $('#message').fadeOut(1000);  // remove that message
    });
    $('span').draggable(); // make the words draggable

    // make every word clickable :)
    $('span').click(function() {
        console.log(fontlist[Math.floor((Math.random() * 10))]);  // select a word randomly
        $(this).fadeToggle ('slow'); // make the word disappear

        // apply random font in random colour
        $(this).css('font-family',fontlist[Math.floor((Math.random() * 4))]);
        $(this).css('color', 'rgb(' + Math.floor((Math.random() * 255)) + ', ' + Math.floor((Math.random() * 255)) + ', ' + Math.floor((Math.random() * 255)) + ')' );
        console.log ($(this).css ('color'));
        $(this).fadeToggle ('slow'); // make the word reappear
    });

    // Explode the word on double click
    $('span').dblclick (function() {
        $('span').effect ('explode');
        $('span').show ('slow');
    });
});

                     