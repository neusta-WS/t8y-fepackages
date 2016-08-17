define([ 'module', 'jquery', 'backbone', 't8y/socialmedia/api/facebook/Stream' ], function (module, $, Backbone, Stream) {

    return Backbone.Model.extend({
        initialize: function() {
            this.set('stream', new Stream());
        },

        getStream: function(callback) {
            FB.api('/' + this.get('id'), {fields: 'feed', limit: 100}, _.bind(function(resp) {
                this.get('stream').add(resp.feed.data);
                callback(this.get('stream'));
            }, this));
        },

        update: function() {

        }
    });
});