var fontlist = ['AguafinaScript-Regular', 'AlexBrush-Regular', 'Allura-Regular', 'AquilineTwo', 'Arizonia-Regular', 'Bilbo-Regular', 'BilboSwashCaps-Regular', 'cac_champagne', 'Calligraffiti', 'Chantelli_Antiqua', 'Dearest_open', 'Dearest_outline', 'Dearest', 'Deutsch', 'DobkinPlain', 'Dynalight-Regular', 'EuphoriaScript-Regular', 'Felipa-Regular', 'FLORLI__', 'FLORLRG_', 'freebooterscript', 'GenzschEtHeyseAlt', 'GenzschEtHeyse', 'Gondola_SD-Swash', 'Gondola_SD', 'goodfoot', 'gothic_ultra_ot', 'GreatVibes-Regular', 'HerrVonMuellerhoff-Regular', 'Italianno-Regular-OTF', 'journal', 'KaushanScript-Regular', 'Kells_SD', 'Kingthings_Calligraphica_2', 'Kingthings_Calligraphica_Italic', 'Kingthings_Calligraphica_Light', 'Kingthings_Exeter', 'Kingthings_Foundation', 'Kingthings_Italique', 'Kingthings_Petrock_light', 'Kingthings_Petrock', 'Landliebe', 'LeckerliOne-Regular', 'Lobster_1.3', 'LobsterTwo-BoldItalic', 'LobsterTwo-Bold', 'LobsterTwo-Italic', 'LobsterTwo-Regular', 'Miama', 'Montez-Regular', 'Mothproof_Script', 'Mutlu__Ornamental', 'Pacifico', 'promocyja', 'QumpellkaNo12', 'Qwigley-Regular', 'RechtmanPlain', 'Ruthie-Regular-OTF', 'Scriptina_Pro', 'scriptina', 'Sevillana-Regular', 'Windsong', 'Yellowtail-Regular'];
$(document).ready(function() {
    $("body").css ('font-family', fontlist [Math.floor (Math.random() * fontlist.length)]);
});

$("#singlebutton").click(function() {
    console.log ("hi");
    $('p','#text').css  ('font-family', fontlist [Math.floor (Math.random() * fontlist.length)]);
});