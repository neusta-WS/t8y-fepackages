define(['underscore', '../types/DomModel'], function(_, DomModel) {
    var callbacks = [];

    return DomModel.extend({
        defaults: function() {
            return {
                player: null,
                ready: false
            }
        },

        initialize: function() {
            DomModel.prototype.initialize.apply(this, arguments);
            this.on('change:ready', callCallbacks);
        },

        register: function(callback) {
            if(this.get('ready')) {
                callback();
            } else {
                callbacks.push(callback);
            }
        }
    });

    function callCallbacks() {
        while(callbacks.length > 0) {
            callbacks.pop()();
        }
    }
});