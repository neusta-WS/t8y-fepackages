define(['backbone', '../Google'], function(Backbone, googleAPI) {
    return Backbone.Model.extend({

        defaults: function() {
            return {
                url: null,
                size: null,
                origin: null,
                anchor: null
            }
        },

        initialize: function() {
            this.on('change:url', update);
            update(this, this.get('url'));
        },

        setOrigin: function(x, y) {
            var model = this;
            generatePoint(x, y, function(point) {
                model.set('origin', point);
            });
        },

        setAnchor: function(x, y) {
            var model = this;
            generatePoint(x, y, function(point) {
                model.set('anchor', point);
            });
        }
    });

    function update(model, value) {
        var img = new Image();
        img.onload = function() {
            googleAPI.getMaps(function(maps) {
                model.set('size', new maps.Size(img.width, img.height));
            })
        };
        img.src = value;
    }

    function generatePoint(x, y, callback) {
        googleAPI.getMaps(function(maps) {
            callback(new maps.Point(x || 0, y || 0));
        });
    }
})