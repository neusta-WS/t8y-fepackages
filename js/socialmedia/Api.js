define([ 'module', 'backbone' ], function (module, Backbone) {

    return Backbone.Model.extend({
        defaults: function() {
            return {
                source: null
            }
        },

        initialize: function(options) {
            for(var key in options) {
                this.set(key, options[key]);
            }
        },

        load: function(callback) {
            var source = this.get('source');
            console.log(source);
            if(source) {
                loadScript(source, callback);
            }
        }
    });

    function loadScript(url, callback) {
        require([ url ], callback);
    }
});