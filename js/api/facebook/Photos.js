define(['underscore', 'backbone', './FBBaseCollection', './Photo'], function(_, Backbone, FBBaseCollection, Photo) {

    return FBBaseCollection.extend({
        defaults: function() {
            return _.extend(FBBaseCollection.prototype.defaults(Photo), {
                permissions: ['user_photos'],
                restUrl: '/photos'
            });
        }
    });
});