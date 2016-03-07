var ref = new Firebase("https://fiery-heat-5619.firebaseio.com/");
var currUserName = undefined;
// TODO: Implement toggling between rating and viewing results
//var currMode = "view";
var FBLogin = function () {
    ref.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
            console.log ("Login Failed!", error);
            alert ("Login failed");
        } else {
//            console.log("Authenticated successfully with payload:", authData);
            currUserName = authData.facebook.displayName;
            $('div#loginView').hide();
            new ChoiceView;
        }
    },{"remember":"none"});
};

var nomination = Backbone.Model.extend ({
    defaults : {
        nominee : {
            name:'',
            url : ''
        },
        nominator: {
            name: '',
            url: ''
        },
        favorites: '',
        comments: '',
        anonymous: '',
        ratings : {},
        status : 'new', // Can be one of 'new', 'triaged', 'rated'
        autoSync : true,
        disposed: false
    }
});

var Nominees = Backbone.Firebase.Collection.extend ({
    url   : 'https://fiery-heat-5619.firebaseio.com/nominees',
    model : nomination
});

var AllNominees = new Nominees();

var LoginView = Backbone.View.extend ({
    initialize: function () {
        this.render();
    },
    render: function () {
        $('div#LoginView').show('slow');
    }
});

var RateItemView = Backbone.View.extend ({
    tagName:'tr',
    model: nomination,
    events: {
        'click .submit': 'SubmitScore'
    },
    initialize : function () {
        this.template = _.template ($('#rate-template').html());
        _.bindAll (this, "render");
        this.listenTo (this.model, "change", this.render);
        this.render();
    },
    render : function () {
        var data = this.model.toJSON();
        data.nominee.name = MakeUserURL(data.nominee.url)
        data.nominator.name = MakeUserURL(data.nominator.url)
//        $(this.el).html(this.template (this.model.attributes));
        $('a').attr ("target","_blank");
        $(this.el).html(this.template (data));
        if (data.ratings[currUserName]) {
            this.$('td.quality input').val (data.ratings[currUserName].quality);
            this.$('td.presentation input ').val (data.ratings[currUserName].presentation);
            this.$('td.ce input').val (data.ratings[currUserName].communityEngagement);
            this.$('td.geo input').checked = data.ratings[currUserName].geo;
            this.$('td.niche-topics input').checked = data.ratings[currUserName].nichetopics;
            this.$('td.bnbr input').checked = data.ratings[currUserName].bnbr;
        }
        return this;
    },
    SubmitScore : function () {
        var submitButton = this.$('.submit button');
        submitButton.text("Submitting...");
        var myRating = {};
        myRating.quality = parseFloat(this.$('td.quality input').val());
        myRating.presentation = parseFloat(this.$('td.presentation input').val());
        myRating.communityEngagement = parseFloat(this.$('td.ce input').val());
        myRating.geo = this.$('td.niche-geo > input')[0].checked; // Niche geography
        myRating.nichetopics = this.$('td.niche-topics > input')[0].checked; // Niche topics
        myRating.bnbr = this.$('td.bnbr > input')[0].checked; // BNBR
        var boost = 1;
        if (myRating.geo)
                boost += 0.05;
        if (myRating.nichetopics)
            boost += 0.05;
        if (myRating.bnbr)
            boost = 0;
        myRating.score = boost * (0.5 * myRating.quality + 0.3 * myRating.presentation + 0.2 * myRating.communityEngagement);

        if (this.model.has('ratings')) {
            // nothing to do
        } else {
            this.model.set ('ratings', {});
        }

        var allRatings = this.model.get('ratings');
        allRatings[currUserName] = myRating;
        this.model.set ('ratings', allRatings);
        this.model.save (null,{
            success: function (model, response, options) {
                submitButton.removeClass('btn-primary').addClass('btn-success').text('Resubmit');
                alert ('Data saved successfully');
            },
            error: function (model, xhr, options) {
                submitButton.text ('Submit');
                alert("Something went wrong while saving the model");
            }
        });
    }
});

var ReportItemView = Backbone.View.extend ({
    tagName:'tr',
    model: nomination,
    events: {
        'click .submit': 'SubmitDisposition'
    },
    initialize : function () {
        this.template = _.template ($('#view-template').html());
        _.bindAll (this, "render");
        this.listenTo (this.model, "change", this.render);
    },
    render : function () {
        var modeldata = this.model.toJSON();
        var data = {};
        data.nominee = {};
        data.nominator = {};
        data.nominee.name = MakeUserURL(modeldata.nominee.url)
        data.nominator.name = MakeUserURL(modeldata.nominator.url)
        data.averageScore = average(_.pluck (modeldata.ratings, 'score'));
        
        $('a').attr ("target","_blank");
        $(this.el).html(this.template (data));
        return this;
    },
    SubmitDisposition : function () {
        console.log (this);
        console.log (this.model);
        var submitButton = this.$('.submit button');
        this.model.set ('disposed', this.$('td.disposed > input')[0].checked);
        this.model.save (null,{
            success: function (model, response, options) {
                submitButton.removeClass('btn-primary').addClass('btn-success').text('Resubmit');
                alert ('Disposition saved successfully');
            },
            error: function (model, xhr, options) {
                submitButton.text ('Submit');
                alert("Something went wrong while saving the model");
            }
        });
        
    }
});

var ReportView = Backbone.View.extend({
    el: '#table-view tbody',
    initialize: function () {
        this.listenTo (this.collection, 'change', this.addOne);
        this.listenTo (this.collection, 'sync', this.addOne);
        $('#table-view').show();
        _.each(
            _.filter(
                this.collection.models,
                      function (model) {
                          var ret = model.get('disposed');
                          return (ret == false) || (ret == undefined);
                      }),
            this.addOne);
    },
    addOne : function(item) {
        var view = new ReportItemView ({model:item});
        $('#table-view tbody').append(view.render().el);
    }
});

var EvaluateView = Backbone.View.extend({
    el: '#table-rate tbody',
    events : {     
    },
    initialize: function () {
        $('#ChoiceView').hide();
        $('#SwitchView').show();
        this.listenTo (this.collection, 'change', this.addOne);
        this.listenTo (this.collection, 'child_added', this.addOne);
        $('#table-rate').show();
        _.each(
            _.filter(
                this.collection.models,
                      function (model) {
                          var ret = model.get('disposed');
                          return (ret == false) || (ret == undefined);
                      }),
            this.addOne);
    },
    addOne : function (item) {
        var view = new RateItemView ({model:item});
        $('#table-rate tbody').append (view.render().el);
    }
});

var ChoiceView = Backbone.View.extend({
    el : 'body',
    initialize : function () {
        $('div#LoginView').hide();
        $('#ChoiceView').show();
    },
    render: function () {
    },
    events: {
        "click #btn-view": "view",
        "click #btn-rate": "rate"
    },
    rate: function () {
//        currMode = "rate";
//        $('#btn-toggle').text ("View");
        $('#ChoiceView').hide();
        $('#SwitchView').show();
        new EvaluateView ({collection : AllNominees});
        delete this;
    },
    view: function () {
//        currMode = "view";
//        $('#btn-toggle').text ("Rate");
        $('#ChoiceView').hide();
        $('#SwitchView').show();
        new ReportView ({collection : AllNominees});
        delete this;
    }
});

$(document).ready(function() {
    $('#btn-logout').on ('click', function () {
        ref.unauth();
        window.location.href = 'https://quorastuff.appspot.com/qotw';
    });
    $('#btn-toggle').on ('click', function () {
        // Go to home page again
        window.location.href = 'https://quorastuff.appspot.com/qotw';
    });
    $('div#fblogin button').on('click', FBLogin);
    new LoginView;
});