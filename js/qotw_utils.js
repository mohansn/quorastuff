// Common utitlity routines - START
function isURL (str) {
    return (str.startsWith ('http://') || str.startsWith ('https://'));
}

function isNotInt (s) {
    if (isNaN(parseInt (s))) {
        return true;
    } else {
        return false;
    }
}

function MakeUserURL (str) {
    if (isURL (str) && str.match('qr.ae') == null) {
        var namepart = null;
        if (str.match ('com/profile/')) {
            namepart = str.split("com/profile/")[1];
        } else {
            namepart = str.split("com/")[1];
        }
        var name = namepart.split("-").filter (isNotInt).join (" ");
        return name.link (str);
    } else if (isURL (str) && str.match('qr.ae') != null) {
        return str.link(str);
    } else {
        return str;
    }
}

function getFormattedName (str) {
    if (str.match ('com/profile/')) {
        return str.split('com/profile/')[1].split('-').filter (isNotInt).join(' ');
    } else {
        return str.split('com/')[1].split('-').filter (isNotInt).join(' ');
    }
}

function makeURL(str) {
    if (isURL (str) || str.match('qr.ae') != null) {        
        var fullAnswerString = str; // TODO: get actual answer string from Quora
        /*
        // FIXME: Doesn't work yet  
        $.get ('/getfullurl',
               { url:str},
               function (data) {
                   console.log ('Got data' + data);
                   fullAnswerString = data;
               });
        */
        return fullAnswerString.link(str);
    } else {
        return str;
    }
}

function sum (array) {
    return _.reduce (array, function (memo, num) {return memo + num;})
}

function average (array) {
    if (array.length) {
        return sum(array)/array.length;
    } else {
        return 0;
    }
}

// From the section ``Decimal Rounding'' in 
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Math/round
function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

round = function (num, places) {
    return decimalAdjust ('round', num, -places);
}

// Common utitlity routines - END
