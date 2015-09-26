Parse.initialize ('vlvYOASQHBiANuvkQW5a2A7TwFdYonudF2obj1nd', '5n5w8sPHOj4ffM5doIQb7XEMEZJyi6DsAhLjejwK');

window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({
        appId      : '1621547054801796',
        xfbml      : true,
        version    : 'v2.4'
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var FBlogin = function () {
    Parse.User.logOut(); // Necessary for Parse.User.save() to work
    var p = Parse.User.current();
    if (!p) {
        p = new Parse.User();
    }

    FB.getLoginStatus (function (response) {
        if (response.status === 'connected') {
            // Set user name in Parse
            // ^^^^^^^^^^^^^^^^^^^^^^
            FB.api ('/me',{fields:'name'},function (response) {
                if (response && !response.error) {
                    p.setUsername (response.name);
                    p.save (null, function (resp) {
                        if (resp.error) {
                            console.log ("Error persisting Parse user...");
                            console.log (resp);
                        } else {
                            new ChoiceView;

                        }
                    });
                } else {
                    // SHOULDNOTHAPPEN
                    // p.setUsername(prompt ('Please enter a username'));
                }
            });
            // Since the user is logged into FB, just link to Parse User if necessary
            if (Parse.FacebookUtils.isLinked (p)) {
                // Set user name in Parse <--- HBD: Is this necessary?
                FB.api ('/me',{fields:'name'},function (response) {
                    if (response && !response.error) {
                        p.setUsername (response.name);
                        p.save (null, function (resp) {
                            if (resp.error) {
                                console.log ("Error persisting Parse user...");
                                console.log (resp);
                                return;
                            } else {
                            }
                        });
                    } else {
                        // SHOULDNOTHAPPEN
                        p.setUsername(prompt ('Please enter a username'));
                        console.log ("Persisting Parse user...");
                        p.save (null, function (resp) {
                            if (resp.error) {
                                console.log ("Error persisting Parse user...");
                                console.log (resp);
                                return;
                            }
                        });
                    }
                });

                // Proceed to choice view
                  new ChoiceView;
            } else {
                Parse.FacebookUtils.link (p, null, {
                    success : function (p) {
                        // Set user name in Parse
                        FB.api ('/me',{fields:'name'},function (response) {
                            if (response && !response.error) {
                                p.setUsername (response.name);
                                p.save (null, function (resp) {
                                    if (resp.error) {
                                        console.log ("Error persisting Parse user...");
                                        console.log (resp);
                                        return;
                                    } else {
                                        // proceed
                                    }
                                });
                            } else {
                                // SHOULDNOTHAPPEN
                                p.setUsername(prompt ('Please enter a username'));
                                console.log ("Persisting Parse user...");
                                p.save (null, function (resp) {
                                    if (resp.error) {
                                        console.log ("Eror persisting Parse user...");
                                        console.log (resp);
                                        return;
                                    }
                                });
                            }
                          // Proceed to ChoiceView
                          new ChoiceView;
                        });
                    },
                    error : function (p) {
                        console.log ('Error linking FB user to parse');
                        return;
                    }
                });
            }
        } else {
            // FBStatus: not connected
            Parse.FacebookUtils.logIn(null, {
                success: function(user) {
                    if (!user.existed()) {
                        // User signed up and logged in through Facebook!
                    } else {
                        // User logged in through Facebook!
                    }
                    // Get user name from FB and save in Parse user
                    FB.api ('/me',{fields:'name'},function (response) {
                        if (response && !response.error) {
                            // 'FB.api returned success with response.name =  ' + response.name
                            user.setUsername (response.name);
                            user.save (null, function (resp) {
                                if (resp.error) {
                                    console.log ("Error persisting Parse user...");
                                    console.log (resp);
                                    return;
                                } else {
                                    // console.log ("Going to create ChoiceView");
                                }
                            });
                        } else {
                            // SHOULDNOTHAPPEN
                            user.setUsername(prompt ('Please enter a username'));
                            console.log ("Persisting Parse user...");
                            user.save (null, function (resp) {
                                if (resp.error) {
                                    console.log ("Eror persisting Parse user...");
                                    console.log (resp);
                                }
                            });
                        }
                    });
                    //  new ChoiceView;
                    new ChoiceView;
                },
                error: function(user, error) {
                    alert("User cancelled the Facebook login or did not fully authorize.");
                    return;
                }
            });
        }
    });
}
