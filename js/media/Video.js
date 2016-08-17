define(['module', 'jquery', 'underscore', '../types/Controller', './VideoModel', '../utils/device', '../utils/device/os', 'mediaelementplayer'], function(module, $, _, Controller, VideoModel, device) {

    var config = {
//        mode: 'shim',
        enablePluginDebug: false,
        plugins: ['flash','silverlight'],
        pluginPath: module.config().pluginPath,
        flashName: 'flashmediaelement.swf',
        silverlightName: 'silverlightmediaelement.xap',
        timerRate: 100,
        startVolume: 0.8,
        loop: true,
        enableAutosize: true,
        features: ['playpause','progress','current','duration','tracks','volume','fullscreen'],
        alwaysShowControls: false,
        iPadUseNativeControls: false,
        iPhoneUseNativeControls: true,
        AndroidUseNativeControls: true,
        framesPerSecond: 25,
        enableKeyboard: true,
        pauseOtherPlayers: true,
        keyActions: [],
        success: function() {}
    }

    var callbacks = [];

    return Controller.extend({
        model: VideoModel,

        events: {
            'touchstart': hoverPrevent,
            'mouseenter ': hoverStart,
            'mouseleave': hoverStop
        },

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);

            this.createPlayer();
        },

        createPlayer: function() {
            var video = $('video', this.el).get(0);
            if(device.isPhone()) {
                config.success = onMobileSuccess;
                this.model.set('player', new MediaElement(video, config));
            } else {
                config.success = _.bind(onSuccess, this);
                new MediaElement(video, config);
            }

            this.$el.one('mousemove', _.bind(hoverStart, this));
        },

        reset: function() {
            this.model.get('player').setCurrentTime(this.model.get('player').media.duration);
        },

        destroy: function() {
            Controller.prototype.destroy.apply(this, arguments);
        }
    });

    function hoverPrevent() {
        this.preventHover = true;
    }

    function hoverStart(e) {
        if(!this.preventHover) {
            this.$el.addClass('hover_mouse');
        }
    }

    function hoverStop() {
        if(!this.preventHover) {
            this.$el.removeClass('hover_mouse');
        }
    }

    function onMobileSuccess(mediaElement, domObject, player) {
        $(mediaElement).parent().addClass('ready');
        $(mediaElement).data('fullscreen', false);
        $(mediaElement).on('click', playMobile);
        $(mediaElement).on('fullscreenchange webkitfullscreenchange', onFullscreenChange);
        $(mediaElement).on('playing', onPlayMobile);
        $(mediaElement).on('ended', onEndMobile);
    }

    function onSuccess(mediaElement, domObject, player) {
        $(mediaElement).on('playing', function() {
            $('video').not(mediaElement).each(function(index, node) {
                node.pause();
            });
        });

        this.model.set('player', mediaElement);
        this.model.set('$player', $(mediaElement));
        this.model.set('ready', true);
    }

    /*
     * open video player in fullscreen mode
     */
    function enterFullscreen(video) {
        if(video.requestFullscreen) {
            video.requestFullscreen();
        } else if(video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        } else if(video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if(video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
    }

    /*
     * close fullscreen video player
     */
    function exitFullscreen(video) {
        if (video.exitFullscreen) {
            video.exitFullscreen();
        } else if (video.msExitFullscreen) {
            video.msExitFullscreen();
        } else if (video.mozCancelFullScreen) {
            video.mozCancelFullScreen();
        } else if (video.webkitExitFullscreen) {
            video.webkitExitFullscreen();
        }
    }

    /*
     * pause video if user leaves fullscreen mode
     */
    function onFullscreenChange(e) {
        if(!setFullscreenFlags($(e.currentTarget))) {
            e.currentTarget.pause();
        }
    }

    /*
     * set flags to (de)activate CSS rule and save current screen status
     */
    function setFullscreenFlags(video) {
        var flag = video.data('fullscreen');
        video.data('fullscreen', !flag);
        video.toggleClass('normal', flag);
        return !flag;
    }

    /*
     * play video
     */
    function play(e) {
        this.play();
    }

    /*
     * start playing video and enter fullscreen mode
     */
    function playMobile(e) {
        if(!$(e.currentTarget).data('fullscreen')) {
            e.currentTarget.play();
            enterFullscreen(e.currentTarget);
        }
    }

    /*
     * hide picture (poster)
     */
    function onPlay(e) {
//        this.removeClass('play-me');
        this.addClass('playing');
    }

    /*
     * play video from the beginning if user enter fullscreen mode
     */
    function onPlayMobile(e) {
        if(!$(e.currentTarget).data('fullscreen') && e.currentTarget.currentTime != 0) {
            e.currentTarget.setCurrentTime(0.1);
        }
    }

    function onPause(e) {
        this.removeClass('playing');
    }

    /*
     * show picture (poster)
     */
    function onEnd(e) {
//        this.addClass('play-me');
    }

    /*
     * leaves fullscreen mode at the end of the video
     */
    function onEndMobile(e) {
        exitFullscreen(e.currentTarget);
    }
});