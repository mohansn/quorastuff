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

function getFormattedName (str) {
    return str.split('com/')[1].split('-').filter (isNotInt).join(' ');
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
        this.template = _.template ($('#rate-item-template').html());
        _.bindAll (this, "render");
    },
    events : {
        'click .submit': 'saveScore'
    },
    render : function () {
        var currUser = Parse.User.current();
        data = this.model.toJSON();
        data.answer = makeURL(data.answer.replace(/\"/g, ""));
        if (data.ratings == undefined) {
            data.rating = "not rated";
        }
        this.input = this.$('input.rating');
        this.isNew = this.$('input.older');

        $(this.el).html(this.template (data));
        $('a').attr ("target","_blank"); // open link in a new tab/window
        if (currUser) {
            if (data.ratings != undefined){
                if (data.isNew) {
                    this.$('input.rating').val(round(data.ratings[currUser.getUsername()]/1.05, -1));
                } else {
                    this.$('input.rating').val(round(data.ratings[currUser.getUsername()], -1));
                }
            }
        }
        if (data.isNew != undefined) {
            this.$('input.older')[0].checked = data.isNew;
        }

        var DOMref = undefined;
        // Get full links for answers
        if (this.$('td.answer a')[0].href.match(/qr.ae/)) {
            // needed since reference to 'this' is invalid after render exits
            DOMref = this.$('td.answer a')[0];
            $.ajax({
                url:'/getfullurl',
                type: 'get',
                data : {
                    url: DOMref.href
                },
                success : function (data) {
                    DOMref.text = data;
                },
                error : function () {
                }
            });
        }

        return this;
    },
    saveScore : function () {
        if ((this.$('input.rating').val()).trim() == "") {
            alert ("Please enter a rating (0-10)");
            this.$('input.rating').focus();
            return;
        }
        var rating = parseFloat(this.$('input.rating').val());
        var currentName = Parse.User.current().getUsername().toString();
        var isNew = this.$('input.older')[0].checked;
        if (isNew) {
            rating = rating * 1.05;
        }
        var ratings = this.model.get ('ratings');
        ratings = (ratings == undefined)? {} : ratings;
        ratings[currentName] = rating;
        var avgRating = average (_.values(ratings));
        this.model.save({"ratings":ratings, "rating":avgRating, "isNew":isNew},
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
        data.rating = (typeof (data.rating) == "number") ? round(data.rating, -2) : "Not rated";
        $(this.el).html(this.template (data));
        $('a').attr ("target","_blank");
        var answerDOMref = undefined, submitterDOMref = undefined;

        // Get full links for answers
        if (this.$('td.answer a')[0].href.match(/qr.ae/)) {
            // needed since reference to 'this' is invalid after render exits
            answerDOMref = this.$('td.answer a')[0];
            $.ajax({
                url:'/getfullurl',
                type: 'get',
                data : {
                    url: answerDOMref.href
                },
                success : function (data) {
                    answerDOMref.text = data;
                },
                error : function () {
                }
            });
        }

        // Get full links for submitter
        if (this.$('td.submitter a')[0].href.match(/qr.ae/)) {
            // needed since reference to 'this' is invalid after render exits
            submitterDOMref = this.$('td.submitter a')[0];
            $.ajax({
                url:'/getfullurl',
                type: 'get',
                data : {
                    url: submitterDOMref.href
                },
                success : function (data) {
                    submitterDOMref.text = getFormattedName (data);
                },
                error : function () {
                }
            });
        }


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
    el:'table#table-rate-answers tbody',
    initialize: function () {
        $('#rate-answers-header').show();
        var self = this;
        $('body').css ('padding-top','70px');
        $('nav#switch button#nav').text ("Return to viewing");
        $('nav#switch').show();
        $(this.el).empty();
        $('#choices').hide ();
        $('#rate-answers-header').show();


        _.bindAll (this, 'addAnswer');
        this.answers = new Answers;
        this.answers.query = new Parse.Query (Answer);
        this.answers.query.greaterThanOrEqualTo ("createdAt", lastWednesday());
        this.answers.query.descending ("createdAt");
        this.answers.bind ('add', this.addAnswer);
        this.answers.fetch ({add:true});
    },

    addAnswer : function (answer) {
        var view = new EvaluateItemView ({model:answer});
        $(this.el).append (view.render().el);
    }
});

var ReportView = Parse.View.extend ({
    el:'table#table-view-answers tbody',
    initialize : function () {
        $('#rate-answers-header').hide();
        var self = this; // why?
        _.bindAll (this, 'render', 'addAnswer');

        this.answers = new Answers(); // collection
        this.answers.query = new Parse.Query (Answer);
        this.answers.query.greaterThanOrEqualTo ("createdAt", lastWednesday());
        this.answers.query.descending ("rating");
        this.answers.bind ('add', this.addAnswer);

        $(this.el).empty();
        $('#choices').hide();
        $('body').css ('padding-top','70px');
        $('nav#switch button#nav').text ("Return to rating");
        $('nav#switch').show();
        $('#view-answers-header').show();
        this.answers.fetch ({add:true});
    },
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
    });
        if (window.innerWidth < 768) {
            $('th.older').html('Less<br>than<br>30 <br>days<br>old?');
            $('th.submit').html ('Submit<br>rating');
        } else {
            $('th.older').html('Is this answer recent?<br> (less than 30 days old)');
            $('th.submit').html ('Submit rating');
        }

    $(window).resize (function () {
        if (window.innerWidth < 768) {
            $('th.older').html('Less<br>than<br>30 <br>days<br>old?');
            $('th.submit').html ('Submit<br>rating');
        } else {
            $('th.older').html('Is this answer recent?<br> (less than 30 days old)');
            $('th.submit').html ('Submit rating');
        }
    });
    $('div#fblogin button').on('click', FBlogin);    
    new AppView;
});
