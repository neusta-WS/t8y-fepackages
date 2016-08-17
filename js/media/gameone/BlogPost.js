define(['jquery', 'underscore', '../../types/Controller', './Post', '../../History'], function($, _, Controller, Post, History) {
    return Controller.extend({
        model: Post,

        template: _.template('<figure data-component="slider/view" class="component">' +
            '   <a class="overlay" data-content="#<%= id %>" href="#<%= id %>">' +
            '       <img src="<%= image %>"/>' +
            '       <h2><%= title %></h2>' +
            '   </a>' +
            '   <div id="<%= id %>" class="menu">' +
            '       <ul class="choose"></ul>' +
            '       <label class="icon-flash error"></label>' +
            '       <video type="video/mp4" controls></video>' +
            '   </div>' +
            '</figure>'),

        events: {
            'click a.overlay': openMenu
        },

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);
            this.setElement(this.template(this.model.toJSON()));

            History.register('modal', _.bind(function(value) {
                loadStreams(value, this.model, _.bind(function(response) {
                    updateMenu(response, this);
                }, this));
            }, this))
        }
    });

    function openMenu(e) {
        e.preventDefault();
        History.update('modal', this.model.get('id'));
    }

    function loadStreams(id, model, callback) {
        if(id && id == model.get('id')) {
            if(model.get('streams').length == 0) {
                model.getStreams(callback);
            }
        }
    }

    function updateMenu(response, scope) {    console.log('AHA', response.status, response);
        if(response.status == 200) {
            updateStreamList(response.data, scope);
        } else {
            $('#' + scope.model.get('id') + ' .error').text(response.message).addClass('active');
        }

    }

    function updateStreamList(streams, scope) {
        var root = $('#' + scope.model.get('id') + ' .choose');
        _.each(_.sortBy(streams, function(config){ return config.width; }), _.bind(function(config, index) {
            var className = 'icon-tv';
            if(config.width < 1280) {
                className = 'icon-mobile2';
                if(config.width < 640) {
                    className = 'icon-mobile';
                }
            }
            $('<li><a class="stream ' + className + '" data-bitrate="' + config.bitrate + '" href="#"></a></li>').appendTo(root)
        }, this));
        root.addClass('active');
        $('.stream', root).on('click', _.bind(openVideo, scope));
    }

    function openVideo(e) {
        e.preventDefault();
        var result = _.findWhere(this.model.get('streams'), {bitrate: $(e.currentTarget).data('bitrate')});
        var video = $('#' + this.model.get('id') + ' video');

        if(video.attr('src') != result.url) {
            video.attr('src', result.url);
        }
        video.addClass('active');
        video = video.get(0);
        video.outerWidth;

        video.play();
        if(video.requestFullscreen) {
            video.requestFullscreen();
        } else if(video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        } else if(video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if(video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }

        setTimeout(function() {
            $(video).one('fullscreenchange webkitfullscreenchange', function() {
                video.pause();
            });
        }, 500)

    }
});