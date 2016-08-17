define([ 'jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    return Backbone.Model.extend({

        defaults: function () {
            return {

            }
        },

        initialize: function (options, data) {
            Backbone.Model.prototype.initialize.apply(this, arguments);

            //copy values
            for (var key in this.attributes) {
                if (options && options[key]) {
                    setValue(this, key, options[key]);
                } else if (data && data[key]) {
                    setValue(this, key, data[key]);
                }
            }
        },

        destroy: function() {
            this.set('id', null);
            Backbone.Model.prototype.destroy.apply(this, arguments);
            this.off();
        }
    });

    function setValue(obj, key, value) {
        if (obj[key.toUpperCase()]) {
            obj.set(key, convertValueToCorrectType(obj[key.toUpperCase()][value.toUpperCase()]));
        } else {
            obj.set(key, convertValueToCorrectType(value));
        }
    }

    function convertValueToCorrectType(value) {
        return JSON.parse(JSON.stringify(value));
    }

})