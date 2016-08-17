define(['../../types/DomModel', '../Google'], function(DomModel, googleAPI) {

    return DomModel.extend({
        defaults: function() {
            return {
                mapType: 'SATELLITE', // [ROADMAP || SATELLITE || HYBRID || TERRAIN]
                marker: []
            }
        },

        initialize: function() {
            DomModel.prototype.initialize.apply(this, arguments);
        }
    });
});