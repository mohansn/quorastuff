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

function makeUserURL (str) {
    if (isURL (str) && str.match('qr.ae') == null) {
        var namepart = str.split("com/")[1];
        var name = namepart.split("-").filter (isNotInt).join (" ");
        return name.link (str);
    } else if (isURL (str) && str.match('qr.ae') != null) {
        return str.link(str);
    } else {
        return str;
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
    return decimalAdjust ('round', num, places);
}

function daysSinceLastWed (d) {
    if (d.getDay() >= 3) {
        return d.getDay() - 3;
    } else {
        return 4+d.getDay();
    }
}

function millisSinceLastWed (d) {
    return 24 * 3600 * 1000 * 
        (1 + daysSinceLastWed (d)); // Add one more day to smooth over timezone differences
}

function lastWednesday () {
    var today = new Date();
    return new Date (today.getTime() - millisSinceLastWed (today));
}

// model for a single answer
var Answer = Parse.Object.extend ("Answer");

var Answers = Parse.Collection.extend ({
    model: Answer
});

// Single row when rating answers
var EvaluateItemView = Parse.View.extend ({
    tagName:'tr', // A table row
    model: Answer,
    initialize: function () {
        this.template=_.template ($('#rate-item-template').html());
        _.bindAll (this, "render");
    },
    events : {
        'click .submit': 'saveScore'
    },
    render : function () {
        data = this.model.toJSON();
        data.answer = makeURL(data.answer.replace(/\"/g, ""));
        if (data.ratings == undefined) {
            data.rating = "not rated";
        }
        this.input = this.$('input.rating');
        this.isNew = this.$('input.older');

        $(this.el).html(this.template (data));
        return this;
    },
    saveScore : function () {
        var rating = parseFloat(this.$('input.rating').val());
        var currentName = Parse.User.current().getUsername().toString();
        if (this.$('input.older')[0].checked) {
            rating = rating * 1.05;
        }
        var ratings = this.model.get ('ratings');
        ratings = (ratings == undefined)? {} : ratings;
        ratings[currentName] = rating;
        var avgRating = average (_.values(ratings));
        this.model.save({"ratings":ratings, "rating":avgRating},
                        {
                            success: function () {
                                alert ("Data saved successfully!");
                            },
                            error : function () {
                                alert ("Error saving data. Please try again.");
                            }
                        });
    }
});

// Single row when viewing answers
var ReportItemView = Parse.View.extend ({
    tagName: 'tr',
    model: Answer,
    initialize: function () {
        _.bindAll (this, "render");
        this.template =  _.template ($('#view-item-template').html());
        this.model.bind ('change', this.render);
        this.model.bind ('add', this.render);
    },
    render : function () {
        data = this.model.toJSON();
        if (data.ratings == undefined) {
            data.rating = "not rated";
        } else {
            data.rating = average(_.values (data.ratings));
        }
        data.answer = makeURL(data.answer.replace(/\"/g, ""));
        data.submitter = makeUserURL(data.submitter.replace(/\"/g, ""));
        data.comments = data.comments.replace(/\"/g, "");
        $(this.el).html(this.template (data));
        return this;
    }
});

var AppView = Parse.View.extend ({
    initialize : function () {
        this.render()
    },
    render : function () {
        $('#login-container').show('slow');
    }
});

var ChoiceView = Parse.View.extend ({
    el: 'body',
    events: {
        "click #btn-view": "view",
        "click #btn-rate": "rate"
    },
    rate: function () {
        new EvaluateView;
        delete this;
    },
    view: function () {
        new ReportView;
        delete this;
    },
    initialize: function () {
        $('button#logout').html ("Log out <strong>" + Parse.User.current().getUsername() + " </strong>");
        _.bindAll (this, "rate", "view");
        this.render();
    },
    render: function () {
        $('#login-container').hide();
        $('#choices').show();
    }
});

var EvaluateView = Parse.View.extend ({
    el:'table#table-rate-answers tbody',/*
    events : {
        "click button#logout": "logout",
        "click button#nav": "switchView"
    },*/
    initialize: function () {
        $('#rate-answers-header').show();
        var self = this;
        $('body').css ('padding-top','70px');
        $('nav#switch button#nav').text ("Return to viewing");
        $('nav#switch').show();

        _.bindAll (this, 'addAnswer');
        this.answers = new Answers;
        this.answers.query = new Parse.Query (Answer);
        this.answers.query.greaterThanOrEqualTo ("createdAt", lastWednesday());
        this.answers.query.descending ("createdAt");
        this.answers.bind ('add', this.addAnswer);
        this.answers.fetch ({add:true});
        $(this.el).empty();
        $('#choices').hide ();
        $('#rate-answers-header').show();
    },/*
    switchView: function () {
        $('#rate-answers-header').hide();
        new ReportView;
        this.undelegateEvents();
        delete this;
    },
    logout: function () {
        Parse.User.logOut();
        $('#rate-answers-header').hide();
        new AppView;
        this.undelegateEvents();
        delete this;
    },*/

    addAnswer : function (answer) {
        var view = new EvaluateItemView ({model:answer});
        $(this.el).append (view.render().el);
    }
});

var ReportView = Parse.View.extend ({
    el:'table#table-view-answers tbody',/*
    events : {
        "click button#logout": "logout",
        "click button#nav": "switchView"
    },*/
    initialize : function () {
        $('#rate-answers-header').hide();
        var self = this; // why?
        _.bindAll (this, 'render', 'addAnswer');

        this.answers = new Answers(); // collection
        this.answers.query = new Parse.Query (Answer);
        this.answers.query.greaterThanOrEqualTo ("createdAt", lastWednesday());
        this.answers.query.descending ("createdAt");
        this.answers.bind ('add', this.addAnswer);

        $(this.el).empty();
        $('#choices').hide();
        $('body').css ('padding-top','70px');
        $('nav#switch button#nav').text ("Return to rating");
        $('nav#switch').show();
        $('#view-answers-header').show();
        this.answers.fetch ({add:true});
    },/*
    logout : function () {
        Parse.User.logOut();
        $('#view-answers-header').hide();
        new AppView;
        this.undelegateEvents();
        delete this;
    },
    switchView: function () {
        $('#view-answers-header').hide();
        new EvaluateView;
        this.undelegateEvents();
        delete this;
    },*/
    addAnswer : function (answer) {
        var view = new ReportItemView ({model:answer});
        $(this.el).append (view.render().el);
    }
});

$(function () {
    Parse.$ = jQuery;
        $('button#nav').click (function (e) {
            if ($('button#nav').text().match(/viewing/)) {
                $('button#nav').text("Return to rating");
                $('#rate-answers-header').hide();
                $('table#table-view-answers tbody').empty();
                $('table#table-rate-answers tbody').empty();
                new ReportView;
            } else {
                $('button#nav').text("Return to viewing");
                $('#view-answers-header').hide();
                $('table#table-view-answers tbody').empty();
                $('table#table-rate-answers tbody').empty();
                new EvaluateView;
            }
        });
        $('button#logout').click (function (e) {
            Parse.User.logOut();
            window.location.href = "http://quorastuff.appspot.com/ysrt";
/*
            $('body').css ('padding-top','0px');
            $('nav#switch').hide();
            $('#rate-answers-header').hide();
            $('#view-answers-header').hide();
            $('table#table-view-answers tbody').empty();
            $('table#table-rate-answers tbody').empty();
            new AppView;
*/
        });

    $('div#fblogin button').on('click', FBlogin);    
    new AppView;
});
