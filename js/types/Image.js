define(['underscore', 'backbone'], function(_, Backbone) {
    return Backbone.Model.extend({
        defaults: function() {
            return {
                url: null,
                image: new Image(),
                loaded: false
            }
        },

        initialize: function() {
            Backbone.Collection.prototype.initialize.apply(this, arguments);
            this.get('image').onload = _.bind(onLoad, this);
        },

        load: function() {
            this.get('image').src = this.get('url');
        }
    })

    function onLoad(e) {
        this.set('loaded', true);
    }
});