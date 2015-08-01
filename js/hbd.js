$(document).ready(function(){
    $('#d1').lettering();
    $('#d2').lettering();
    $('#d3').lettering();
    $('span[class^="char"]').addClass ('hvr-pop');
    $('div').hide();
    $('#d1').show ('blind',{direction:'left'},500);
    $('#d2').show ('blind',{direction:'right'},1000);
    $('#d3').show ('blind',{direction:'left'},1500);
});
