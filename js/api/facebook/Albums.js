define(['module', 'underscore', 'backbone', './FBBaseCollection', '../Facebook', './Album'], function(module, _, Backbone, FBBaseCollection, facebook, Album) {

    return FBBaseCollection.extend({
        defaults: function() {
            return _.extend(FBBaseCollection.prototype.defaults(Album), {
                permissions: ['user_photos'],
                restUrl: '/albums'
            });
        }
    });
});