define(['underscore', '../../types/Controller', '../../types/DomModel'], function(_, Controller, DomModel) {

    return Controller.extend({
        model: DomModel.extend({
            defaults: function() {
                return {
                    timecode: -1,
                    tiggeredTimecode: -1
                };
            }
        }),

        events: {
            'click': goToTimecode
        },

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);
            this.parentModel.register(_.bind(function() {
                this.parentModel.get('$player').on('timeupdate', _.bind(checkStatus, this));
            }, this));
        }
    });

    function checkStatus(e) {
        var currentTime = this.parentModel.get('player').currentTime;
        if(currentTime < +this.model.get('timecode')) {
            this.model.set('triggeredTimecode', -1);
            this.$el.removeClass('active');
            this.$el.parent().removeClass('break')

        } else {

            console.log('triggered timecode:', this.model.get('triggeredTimecode'));

            if(this.model.get('triggeredTimecode') == -1) {
                this.parentModel.get('player').pause();
                this.model.set('triggeredTimecode', this.parentModel.get('player').currentTime);
                this.$el.parent().addClass('break')
            } else if(this.model.get('triggeredTimecode') == currentTime) {
                this.$el.addClass('active');
                this.$el.parent().addClass('break')
            } else {
                this.$el.removeClass('active');
                this.$el.parent().removeClass('break')
            }
        }
    }

    function goToTimecode(e) {
        e.preventDefault();
        this.parentModel.get('player').setCurrentTime(+this.model.get('timecode'));
        this.parentModel.get('player').pause();
    }
});