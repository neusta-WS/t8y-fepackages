define(['underscore', '../../types/Controller', '../../types/DomModel'], function(_, Controller, DomModel) {

    return Controller.extend({

        events: {
            'click': skip
        },

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);
        }
    });

    function skip(e) {
        e.preventDefault();
        this.parentModel.get('player').setCurrentTime(this.parentModel.get('player').duration);
    }
});