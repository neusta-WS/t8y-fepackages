define(['jquery', 'underscore', '../../types/Controller'], function($, _, Controller) {

    return Controller.extend({

        events: {
            'click': play
        },

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);

            this.parentModel.register(_.bind(function() {
                this.$target.addClass('ready loaded');

                this.parentModel.get('$player').on('pause', _.bind(function() {
                    _.bind(onPause, this)();
                }, this));

                this.parentModel.get('$player').on('ended', _.bind(function() {
                    _.bind(onEnded, this)();
                }, this));

                this.parentModel.get('$player').on('playing', _.bind(function() {
//                this.$el.parent().removeClass('play-me');
                    _.bind(onPlay, this)();
                }, this));

                _.bind(onPause, this)();

            }, this));


        }
    });

    function play(e) {
        e.preventDefault();
        var player = this.parentModel.get('player');
        if(player.paused) {
            player.play();
        } else {
            player.pause();
        }
    }

    function onPause() {
        this.$target.removeClass('play').addClass('pause');
        $('a', this.$el).removeClass('icon-pause').addClass('icon-play');
    }

    function onEnded() {
        this.$target.addClass('loaded');
    }


    function onPlay() {
        this.$target.removeClass('pause loaded').addClass('play');
        $('a', this.$el).removeClass('icon-play').addClass('icon-pause');
    }
});