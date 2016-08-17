define(['backbone'], function(Backbone) {
    return Backbone.Model.extend({
        idAttribute: 'name',
        defaults: function () {
            return {
                name: null,
                value: null
            }
        }
    })
});