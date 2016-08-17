define([ 'module', 'jquery', 'backbone' ], function (module, $, Backbone) {

    return Backbone.Model.extend({
        defaults: function() {
            return {
                loaded: false,
                image: $(new Image()),
                faces: []
            }
        },

        initialize: function() {
            this.get('image').on('load', _.bind(function(e) {
                this.get('image').data('loaded', true);
            }, this));

            this.on('change', _.bind(function() {
                if(this.get('tags')) {
                    $(this.get('tags').data).each(_.bind(function(index, obj) {
                        this.get('faces').push(obj);
                    }, this));
                }
                if(this.get('source')) {
                    this.get('image').data('loaded', false);
                    this.get('image').attr({src: this.get('source')});
                }
            }, this));
        }
    });
});