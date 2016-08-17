define(['module', 'jquery', 'underscore', 'backbone', '../Google'], function(module, $, _, Backbone, googleAPI) {

    return Backbone.Model.extend({
        constructor: function() {
            var scope = this;
            googleAPI.getMaps(function(api) {
                scope.api = api;
                Backbone.Model.prototype.constructor.apply(scope, arguments);
            });
        }
    });
});

