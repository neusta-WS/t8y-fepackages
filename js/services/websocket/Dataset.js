define(['module', 'backbone'], function(module, Backbone) {
    return Backbone.Model.extend({
        type: module.id,

        defaults: function() {
            return {

            }
        }
    });
});