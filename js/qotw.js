var ref = new Firebase("https://fiery-heat-5619.firebaseio.com/");

var currUserName = undefined;

var FBLogin = function () {
    ref.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Authenticated successfully with payload:", authData);
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
        autoSync : true
    }
});

var Nominees = Backbone.Firebase.Collection.extend ({
    url   : 'https://fiery-heat-5619.firebaseio.com/nominees',
    model : nomination
});

var AllNominees = new Nominees();

AllNominees.on ('sync', function (c) {
    console.log ("Collection is loaded");
});

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
        console.log ('RateItemView::render called');
        $(this.el).html(this.template (this.model.attributes));
        return this;
    },
    SubmitScore : function () {
        console.log ("SubmitScore ");
        console.log (this.model);
        var myRating = [this.$('td.quality input').val(), this.$('td.presentation input').val(), this.$('td.ce input').val()];
        if (this.model.has('ratings')) {
            // nothing to do
        } else {
            this.model.set ('ratings', {});
        }
        var allRatings = this.model.get('ratings');
        allRatings[currUserName] = myRating;
        this.model.set ('ratings', allRatings);
        console.log (this.model.get('ratings'));
        alert (currUserName + ', you rated ' + this.$('td.nominee').text() +  this.$('td.quality input').val());
    }
});

var EvaluateView = Backbone.View.extend({
    el: '#table-rate tbody',
    initialize: function () {
//        console.log ('EvaluateView initialize called');
        $('#ChoiceView').hide();
//        _.bindAll (this, "addOne");
        this.listenTo (this.collection, 'change', this.addOne);
        this.listenTo (this.collection, 'child_added', this.addOne);
        console.log(this.collection);
//        this.collection.fetch({add:true});
        var allAttrs = _.pluck (this.collection.models, 'attributes');
//        console.log(allAttrs);
        $('#table-rate').show();
        _.each (this.collection.models, this.addOne);
    },
    addOne : function (item) {
        console.log ('EvaluateView addOne called');
        console.log (item);
        var view = new RateItemView ({model:item});
//        console.log ($(this.el));
        $('#table-rate tbody').append (view.render().el);
    }
});

var ChoiceView = Backbone.View.extend({
    el : 'body',
    initialize : function () {
        $('div#LoginView').hide();
//        AllNominees.on ('sync', function (collection) {
        $('#ChoiceView').show();
//        });
    },
    render: function () {
    },
    events: {
      /*  "click #btn-view": "view",*/
        "click #btn-rate": "rate"
    },
    rate: function () {
        $('#ChoiceView').hide();
        new EvaluateView ({collection : AllNominees});
        delete this;
    },
    view: function () {
        $('#ChoiceView').hide();
        new ReportView ({collection : AllNominees});
        delete this;
    }
});

$(document).ready(function() {
    console.log ("document is ready!");
    $('div#fblogin button').on('click', FBLogin);
    new LoginView;
});