define(['module', 'jquery', 'underscore', 'backbone', './types/Point', './types/Size', './types/Bounds', './types/Scroll', './utils/animationFrame', './utils/random'], function(module, $, _, Backbone, Point, Size, Bounds, Scroll, animationFrame, random) {

    var body = document.body;

    return Backbone.Model.extend({
        DEFAULT: {
            RESIZE_INTERVAL: 200
        },
        EVENT_TYPES: {
            RESIZE: 0,
            SCROLL: 1
        },
        SIZE: {
            WIDTH: 'Width',
            HEIGHT: 'Height'
        },

        defaults: function() {
            return {
                frame: window,
                content: document.body,

                size: new Size(),
                scroll: new Scroll(),
                bounds: new Bounds(),

                callbacks: new (Backbone.Collection.extend({
                    model: Backbone.Model.extend({
                        defaults: function() {
                            return {
                                id: random.id(),
                                callback: null
                            }
                        }
                    })
                }))()
            }
        },

        initialize: function() {
            Backbone.Model.prototype.initialize.apply(this, arguments);

            this.get('scroll').set('content', this.get('content'));

            var scope = this;
            this.get('callbacks').on('add', function(model) {
                model.get('callback')(scope.EVENT_TYPES.RESIZE, scope);
            })

            $(this.get('frame')).on('resize', _.throttle(function() {
                resizeUpdate(scope, scope.EVENT_TYPES.RESIZE);
            }, module.config().resizeInterval || scope.DEFAULT.RESIZE_INTERVAL));

            $(this.get('frame')).on('scroll', function(e) {
                scope.update(scope.EVENT_TYPES.SCROLL);
            });

            resizeUpdate(this, this.EVENT_TYPES.RESIZE);
        },

        register: function(callback) {
            this.get('callbacks').add({callback: callback});
        },

        unregister: function(entry) {
            this.get('callbacks').remove(entry);
        },

        update: function(type, size) {
            this.get('scroll').update(size);
            updateBounds(this);

            var scope = this;
            if(this.get('callbacks').length > 0) {
                animationFrame.add(function() {
                    scope.get('callbacks').each(function(model) {
                        model.get('callback')(type, scope);
                    });
                });
            }
        }
    });

//    $.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent('http://google.com') + '&callback=?', function(data){
//        alert(data.contents);
//    });

    function resizeUpdate(viewport, type) {
        updateSize(viewport);
        viewport.update(type, viewport.get('size'));
    }

    function updateSize(viewport) {
        viewport.get('size')
            .setWidth(getSizeValue(viewport.get('frame'), viewport.SIZE.WIDTH))
            .setHeight(getSizeValue(viewport.get('frame'), viewport.SIZE.HEIGHT));
    }

    function updateBounds(viewport) {
        viewport.get('bounds').reset(viewport.get('scroll').get('position'), viewport.get('size'));
    }

    function getSizeValue(frame, size) {
        if(frame === window) {
            return window['inner' + size] || body['client' + size];
        }
        return frame['outer' + size]();
    }
});