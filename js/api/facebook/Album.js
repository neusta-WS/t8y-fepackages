define(['backbone', './Photos'], function(Backbone, Photos) {

    return Backbone.Model.extend({
        defaults: function() {
            return {
                id: null,
                photos: new Photos()
            }
        },

        initialize: function() {
            Backbone.Model.prototype.initialize.apply(this, arguments);
        },

        getPhotos: function(callback) {
            this.get('photos').update(this.get('id'), callback);
        }
    });
});