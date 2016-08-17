define(['underscore', '../../types/Controller', '../../types/DomModel'], function(_, Controller, DomModel) {

    return Controller.extend({
        model: DomModel.extend({
            defaults: function() {
                return {
                    timecode: -1,
                    playAfterSeeking: false
                };
            }
        }),

        events: {
            'click': play
        },

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);
            this.parentModel.register(_.bind(function() {
                this.parentModel.get('$player').on('seeked', _.bind(function () {
                    if (this.model.get('playAfterSeeking')) {
                        this.model.set('playAfterSeeking', false);
                        this.parentModel.get('player').play();
                    }
                }, this));
            }, this));
        }
    });

    function play(e) {
        e.preventDefault();
//        this.parentModel.get('player').pause();
        console.log('HELLO',this.model.get('timecode'));
        if(+this.model.get('timecode') != -1) {
            this.parentModel.get('player').setCurrentTime(+this.model.get('timecode'));
            this.model.set('playAfterSeeking', true);
        } else {
            this.parentModel.get('player').play();
        }
    }
});