define(['jquery', '../types/DomModel', '../types/Point', '../types/Size', '../types/Bounds'], function($, DomModel, Point, Size, Bounds) {
    return DomModel.extend({
        defaults: function() {
           return {
               bounds: new Bounds(),
               position: new Point(),
               size: new Size(),
               outerSize: new Size(),
               normalized: {
                   position: new Point()
               },
               elements: []
           }
        },

        initialize: function(options, data) {
            DomModel.prototype.initialize.apply(this, arguments);
            this.set('elements', $('> [data-element="parallax"]', data.interface.$el));
            console.log(this.get('elements'));
        }
    });
});