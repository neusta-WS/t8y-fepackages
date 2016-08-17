define(['backbone'], function(Backbone) {

    return Backbone.Model.extend({
        defaults: function() {
            return {

            }
        },

        initialize: function() {
            Backbone.Model.prototype.initialize.apply(this, arguments);
            console.log('PHOTO', this.get('id'));
        }
    });
});