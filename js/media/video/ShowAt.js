define(['underscore', '../../types/Controller', '../../types/DomModel'], function(_, Controller, DomModel) {

    return Controller.extend({
        model: DomModel.extend({
            defaults: function() {
                return {
                    timecodeStart: -1,
                    timecodeStop: -1,
                    videoEnded: false,
                    active: false
                };
            }
        }),

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);

            this.parentModel.register(_.bind(function() {
                if (this.model.get('timecodeStart') != -1) {
                    this.parentModel.get('$player').on('timeupdate', _.bind(checkStatus, this));
                }

                if (this.model.get('videoEnded')) {
                    this.parentModel.get('$player').on('playing ended', _.bind(onVideoEnd, this));
                }

                this.model.on('change:active', _.bind(updateClassName, this));
            }, this));
        }
    });

    function checkStatus(e) {
        var timecodeStart = +this.model.get('timecodeStart');
        var timecodeStop = +this.model.get('timecodeStop');
        var currentTime = this.parentModel.get('player').currentTime;

        if(currentTime >= timecodeStart && (currentTime <= timecodeStop || timecodeStop == -1)) {
            this.model.set('active', true);
        } else {
            this.model.set('active', false);
        }
    }

    function onVideoEnd(e) {
        if(e.type == 'ended') {
            this.model.set('active', true)
        } else {
            this.model.set('active', false)
        }
    }

    function updateClassName(model, value) {
        if(value) {
            this.$el.addClass('active');
        } else {
            this.$el.removeClass('active');
        }
    }
});