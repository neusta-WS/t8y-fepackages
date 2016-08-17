define(['jquery', 'underscore', '../../types/Controller', 'jquery-pointerevents'], function($, _, Controller) {

    return Controller.extend({

        events: {
//            'pointerup': setTimecode
        },

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);

            this.lastTimecode = 0;
            this.parentModel.register(_.bind(function() {
                this.parentModel.get('$player').on('timeupdate', _.bind(onTimeUpdate, this));
                this.parentModel.get('$player').on('seeked', _.bind(onSeeking, this));
                this.parentModel.get('$player').on('loadedmetadata', _.bind(placeBreakpoints, this));
            }, this));
        }
    });

    function placeBreakpoints() {
        var duration = this.parentModel.get('player').duration;
        $('a', this.$el).each(function(index, node) {
            $(node).css({ left: ($(node).data('timecode') / duration * 100) + '%' });
            $(node).addClass('ready');
        });
    }

    function onTimeUpdate() {
        var player = this.parentModel.get('player');
        var duration = null;

        if(player.seeking) {
            duration = 0;
        } else if(!player.paused) {
            duration = player.currentTime - this.lastTimecode;
        }

        updateTimeline($('.progress-bar', this.$el), player, duration);
        this.lastTimecode = player.currentTime;
    }

    function onSeeking() {
        updateTimeline($('.progress-bar', this.$el), this.parentModel.get('player'), 0);
    }

    function updateTimeline(node, player, duration) {
        if(duration != null) {
            node.css({ transitionDuration: duration + 's' });
        }
        // Must be set separatly else the progress bar animation isn't smooth
        node.css({
            width: player.currentTime / player.duration * 100 + '%'
        });
    }

    function setTimecode(e) {
        var calcedTimecode = (e.pageX - this.$el.offset().left) / this.$el.innerWidth() * this.parentModel.get('player').duration;
        this.parentModel.get('player').setCurrentTime(calcedTimecode);

    }
});