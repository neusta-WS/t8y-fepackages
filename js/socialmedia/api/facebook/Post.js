define([ 'module', 'jquery', 'backbone', 't8y/socialmedia/api/facebook/MediaObject' ], function (module, $, Backbone, MediaObject) {

    return Backbone.Model.extend({
        defaults: function() {
            return {
                profilePicture: $(new Image()),
                media: new MediaObject()
            };
        },

        initialize: function() {
            this.get('profilePicture').on('load', _.bind(function() {
                this.get('profilePicture').data('loaded', true);
                _.bind(triggerOnLoad, this)();
            }, this));
            this.get('media').get('image').on('load', _.bind(triggerOnLoad, this));

            this.on('add', function(model) {
                this.get('profilePicture').data('loaded', false);
                this.get('profilePicture').attr({src: '//graph.facebook.com/' + this.get('from').id + '/picture'});
                FB.api('/' + model.get('object_id'), {fields: 'tags,source'}, _.bind(function(resp) {
                    this.get('media').set(resp);
                }, this));
            });
        },

        isLoaded: function() {
            return (this.get('profilePicture').data('loaded') == true && this.get('media').get('image').data('loaded') == true );
        }
    });

    function triggerOnLoad() {
        if(this.isLoaded() == true) {
            this.trigger('ready', {});
        }
    }
});