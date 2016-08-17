define(['backbone', '../utils/random'], function(Backbone, random) {
    return Backbone.Model.extend({
        defaults: function() {
            return {
                id: random.id(),
                key: null,
                callback: null
            }
        }
    });
});