define(['module', 'backbone'], function(module, Backbone) {

    return Backbone.Model.extend({
        defaults: function() {
            return {
                to: '',
                from: null,
                type: module.id,
                data: null,
                time: null
            }
        },

        reset: function(content) {
            this.clear().set(content||this.defaults());
        },

        triggerObject: function(callback, rawData) {
            var scope = this;
            require([
                scope.get('type')
            ], function(constructor) {
                callback(new constructor(scope.get('data')), scope.get('type'), scope.get('from'), scope.get('to'), scope.get('time'));
            }, function (err) {
                console.error('Object is unknown', scope.get('data'));
            });
        }
    });
});