define(['module', 'backbone', './User'], function(module, Backbone, User) {

    return Backbone.Collection.extend({
        type: module.id,
        model: User
    });
});