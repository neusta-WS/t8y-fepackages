define([ 'module', 'jquery', 't8y/socialmedia/Api', 't8y/socialmedia/api/facebook/Feed' ], function (module, $, Api, Feed) {

    if($('#fb-root').length == 0) {
        $('<div id="fb-root"></div>').appendTo($('body'));
    }
    var fbInit = false;

    return new(Api.extend({
        initialize: function() {
            Api.prototype.initialize.apply(this, [module.config()]);
            this.set('source', '//connect.facebook.net/de_DE/all.js');
        },

        enable: function(callback) {
            if(fbInit == false && module.config().appId) {
                FB.init({
                    appId      : module.config().appId,                        // App ID from the app dashboard
//                        channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel file for x-domain comms
                    status     : true,                                 // Check Facebook Login status
                    xfbml      : true                                  // Look for social plugins on the page
                });
                fbInit = true;
            }
            callback(FB);

        },

        auth: function(callback) {
            FB.getLoginStatus(_.bind(login, {instance: this, callback: callback}));
        },

        parse: function(nodes) {
            if(typeof FB != 'undefined') {
                nodes.parent().each(function(index, node) {
                    FB.XFBML.parse(node);
                });
            }
        },

        createFeed: function(profile, callback) {
            return new Feed({id: profile, callback: callback});
        }
    }))();

    function login(response) {
        console.log(response);
        if(response.status === 'connected') {
            this.callback();
        } else {
            FB.Event.subscribe('auth.authResponseChange', _.bind(login, this));
            this.instance.parse($('<fb:login-button show-faces="true" width="200" max-rows="1" scope="user_groups,user_photos,friends_photos"></fb:login-button>').appendTo($('body')));
        }
    }
});