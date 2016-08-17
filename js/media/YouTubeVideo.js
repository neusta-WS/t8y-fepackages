define(['underscore', '../types/Controller', '../api/Google'], function(_, Controller, Google) {


    return Controller.extend({
        defaults: function() {
            return {

            };
        },

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);

            Google.getYoutube(_.bind(function(api) {
                console.log(api);
            }, this))
        }
    });
});