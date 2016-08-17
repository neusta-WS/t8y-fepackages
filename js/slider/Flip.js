define([ 'module', 'jquery', 'underscore', 'TweenMax', './Scroll', '../types/Point', '../types/Size', '../utils/device/display', '../utils/math' ], function (module, $, _, TweenMax, Scroll, Point, Size, display, math) {

    return Scroll.extend({
        el: $('[data-controller="' + module.id + '"]'),

        numberOfOffsetNodes: 0,
        maxViewsInOneFrame: 0,

        initialize: function () {
            this.offset = new Point();
            this.stripSize = new Size();

            Scroll.prototype.initialize.apply(this, arguments);

            this.model.on('change:scrollToView', _.bind(this.scrollToView, this));
            this.model.on('change:scrollToDirection', _.bind(this.scrollToDirection, this));
            this.model.on('change:goToView', _.bind(this.goToView, this));
            this.model.on('change:goToDirection', _.bind(this.goToDirection, this));

            if(this.parentModel) {
                this.parentModel.on('change:view', _.bind(function(model, value) {
                    this.model.set('scrollToView', this.getViewOfFigure(value));
                }, this));
            }
        },

        render: function() {
            Scroll.prototype.render.apply(this, arguments);

            this.stripSize.reset();

            this.figures = this.getFigures();
            this.figures.each(_.bind(function(index, node) {
                this.renderView(node, index);
                this.stripSize.addLocal($(node).outerWidth(), $(node).outerHeight());
            }, this));

            if(this.model.get('viewCentered') === true) {
                this.offset = getOffset(this.$el, this.figures);
                this.wrapper.css({ top: this.offset.y + '%', left: this.offset.x + '%' });
            }

            this.determineMaxViews();
            this.goToView(this.model, this.model.get('view'));
        },

        renderView: function(node, index) {
            $(node).attr('data-no', index);
        },

        resize: function() {
            Scroll.prototype.resize.apply(this, arguments);
        },

        addView: function(view) {
            view.appendTo(this.wrapper);
            this.renderView(view, this.figures.length);

            this.figures = this.getFigures();
            // FIX: MUSS NOCH SORTIERT WERDEN WIE IM RENDERER
            this.determineMaxViews();
        },

        removeView: function(view) {
            view.remove();
            this.render();
        },

        determineMaxViews: function() {
            var size = 0;
            var max = 0;
            if(this.model.hasVerticalAlignment()) {
                size = this.offset.y / this.wrapper.height() * 100;
            } else {
                size = this.offset.x / this.wrapper.width() * 100;
            }

            this.views = this.figures.filter(_.bind(function(index, node) {
                if(this.model.hasVerticalAlignment()) {
                    size += math.dimension.getPixelToPercentHeight(this.wrapper, $(node));
                } else {
                    size += math.dimension.getPixelToPercentWidth(this.wrapper, $(node));
                }
                size = Math.round(size * 1000) / 1000;

                if(Math.ceil(size / 100) == max) {
                    return false;
                } else {
                    max = Math.ceil(size / 100);
                    return true;
                }
            }, this));

            this.model.set('viewMax', max);
        },

        getViewOfFigure: function(figureNo) {
            for(var i = 0; i < this.views.length; i++) {
                if($(this.views.get(i)).position().left > $(this.figures.get(figureNo)).position().left) {
                    return i-1;
                }
            }
            return i;
        },

        getFigures: function(parent) {
            return $('> figure:visible', this.wrapper).sort(function(a, b) {
                if($(a).position().left > $(b).position().left) {
                    return 1;
                } else {
                    return -1;
                }
            });
        },

        getPositionOfView: function(no) {
            var view = $(this.views.get(no)).position();
            if(view) {
                if(!this.views.get(no+1)) {
                    var width = 0;
                    var height = 0;

                    this.figures.each(function(index, node) {
                        height += $(node).outerHeight();
                        width += $(node).outerWidth();
                    });

                    var x = width - this.wrapper.outerWidth();
                    var y = height - this.wrapper.outerHeight();

                    if(this.$el.data('view-alignment') == 'vertical') {
                        x = 0;
                    } else {
                        y = 0;
                    }
                    return this.buffer.pagePoint.setX(-x).setY(-y);
                } else {
                    return this.buffer.pagePoint.setX(-view.left).setY(-view.top);
                }
            } else {
                return this.buffer.pagePoint.setX(0).setY(0);
            }
        },

        scrollToView: function(model, value) {
            this.animationToView(value, model.get('scrollDurationDefault'));
        },

        scrollToDirection: function(model, value) {
            model.set('scrollToDirection', 0, {silent: true});
            model.set('scrollToView', model.get('view') + value);
        },

        animationToView: function(view, duration) {
            this.model.set('scrollToView', -1, {silent: true});
            this.model.set('view', this.model.validateView(view));
            var position = this.getPositionOfView(this.model.get('view'));
            this.setAnimation(duration, position, null);
        },

        goToView: function(model, value) {
            model.set('goToView', -1, {silent: true});
            this.stepToView(value);
        },

        goToDirection: function(model, value) {
            model.set('goToDirection', 0, {silent: true});
            model.set('goToView', model.get('view') + value);
        },

        stepToView: function(view) {
            this.model.set('view', this.model.validateView(view));
            var position = this.getPositionOfView(this.model.get('view'));
            this.setPosition(position.x, position.y);
        },

        onDrop: function(e) {    //e.stopImmediatePropagation();
            Scroll.prototype.onDrop.apply(this, arguments);
            var direction = null;
            if(this.isValidDirection()) {
                direction = getDirection(this.buffer, this.model.hasVerticalAlignment());
            }

            var no = this.model.validateDirection(direction);
            var duration = this.buffer.forecastDuration(this.position, this.getPositionOfView(no));
            if( this.validScrolling == true && direction && duration > 0 && duration < this.model.get('scrollDurationMax') && this.model.get('view') !== no) {
                if(duration > this.model.get('scrollDurationMin')) {
                    this.animationToView(no, duration);
                } else {
                    this.animationToView(no, this.model.get('scrollDurationDefault'));
                }
            } else {
                this.animationToView(this.model.get('view'), this.model.get('scrollDurationDefault'));
            }


        }
    });

    function getDirection(buffer, verticalAlignment) {
        var direction = buffer.getDirection();
        if(verticalAlignment) {
            return direction.y;
        } else {
            return direction.x;
        }
    }

    function getOffset(frame, views) {
        var offset = math.dimension.getPixelToPercentSize(frame, views);
        offset.y = correctOffsetValue(offset.y);
        offset.x = correctOffsetValue(offset.x);
        return offset;
    }

    function correctOffsetValue(value) {
        if(value >= 100) {
            return ((100 - value) / 2);
        } else {
            return ((100 - (Math.ceil(100 / value)-1) * value) / 2);
        }
    }
});