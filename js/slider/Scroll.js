define([ 'module', 'jquery', 'underscore', 'TweenMax', './FlipModel', '../types/PointerController', '../types/Point', '../types/Size', '../utils/math', '../utils/device', '../utils/device/display', 'modernizr' ], function (module, $, _, TweenMax, FlipModel, PointerController, Point, Size, math, device, display) {

    var scrollingEnabled = true;

    return PointerController.extend({
        model: FlipModel,
        bufferSize: 20,
        options: function() {
            return {
                transformPerspective: 100
            }
        },

        resizeFactor: null,
        position: null,

        initialize: function () {
            this.resizeFactor = new Point(1);
            this.wrapperSize = new Size();

            this.position = new Point();

            // Definition der Default Values
            this.wrapper = $('> .wrapper', this.$el);

            if($('html').hasClass('csstransforms3d')) {
                TweenMax.set(this.wrapper, {transformPerspective: this.options.transformPerspective});
            }

            PointerController.prototype.initialize.apply(this, arguments);
        },

        ready: function() {
            // Resize Listener um den Slider responsive anzupassen. Orientiert sich an der prozentualen Größe am Elternelement
            $(display).on('resize.scroll', _.bind(this.resize, this));

            PointerController.prototype.ready.apply(this, arguments);
        },

        /*
         *  Saves new size of wrapper and reposition it
         */
        render: function() {
            PointerController.prototype.render.apply(this, arguments);

            this.wrapperSize.reset(this.wrapper.outerWidth(), this.wrapper.outerHeight());
            var position = this.getPosition();
            this.setPosition(position.x, position.y);
        },

        /*
         * calculates the resizeFactor of slider to reposition the wrapper correctly
         */
        resize: function(e) {
            this.resizeFactor.setX(this.wrapper.width() / this.wrapperSize.width);
            this.resizeFactor.setY(this.wrapper.height() / this.wrapperSize.height);

            if( this.resizeFactor.x != 1 || this.resizeFactor.y != 1) {
                this.render();
                this.resizeFactor.reset(1);
            }
        },

        /*
         *  activates mouse and finger gestures
         */
        enableScrolling: function() {
            scrollingEnabled = true;
        },

        /*
         *  deactivates mouse and finger gestures
         */
        disableScrolling: function() {
            scrollingEnabled = false;
        },

        /*
         *  check if mouse and finger gestures are activated
         */
        isScrollingEnabled: function() {
            return scrollingEnabled;
        },

        /*
         *  detects actual position of wrapper
         */
        getPosition: function() {
            if(!$('html').hasClass('csstransforms') || this.$el.data('prevent-hardware-acceleration')) {
                this.position.reset(parseInt(this.wrapper.css('left')), parseInt(this.wrapper.css('top')));
            } else {
                if(this.wrapper.get(0)._gsTransform) {
                    this.position.reset(this.wrapper.get(0)._gsTransform.x, this.wrapper.get(0)._gsTransform.y);
                } else {
                    this.position.reset();
                }
            }
            return this.position.multiplyLocal(this.resizeFactor);
        },

        /*
         *  set new static position of wrapper
         */
        setPosition: function(x, y) {
            TweenMax.set(this.wrapper, convertPointToTweenLiteObject(x, y, this.$el.data('prevent-hardware-acceleration')));
        },

        /*
         *  set animation to new position of wrapper
         */
        setAnimation: function(duration, position, ease ,callback) {
            this.model.set('status', this.model.STATUS.ANIMATE);
            var animation = convertPointToTweenLiteAnimationObject(position, ease, this.$el.data('prevent-hardware-acceleration'));
            console.log('DURATION',duration);
            animation.onComplete = callback || _.bind(function() { this.model.set('status', this.model.STATUS.DEFAULT); }, this);
            TweenMax.to(this.wrapper, duration / 1000, animation);
        },

        /*
         *  check if direction of mouse and finger gesture is valid
         */
        isValidDirection: function() {
            var direction = this.buffer.getDirection();
            if(direction.x != 0 && this.model.hasHorizontalAlignment()) {
                return true;
            } else if(direction.y != 0 && this.model.hasVerticalAlignment()) {
                return true;
            }
            return false;
        },

        /*
         * detects if scroll direction is equal to slider alignment definition
         */
        isValidScrollDirection: function(point1, point2, model) {
            var absRad = Math.abs( math.getRadBetweenPoints(point1, point2) );
            if (absRad < Math.PI * 0.25 || absRad > Math.PI * 0.75) {
                return model.hasHorizontalAlignment();
            } else {
                return model.hasVerticalAlignment();
            }
        },

        onDrag: function(e) {
            // Wenn generell Swipe nicht deaktiviert ist und es sich um ein portables Geräte handelt oder der Swipe per Mouse aktiviert wurde
            if(scrollingEnabled == true && this.$el.data('disable-swipe') != '' && (device.isPortable() == true || this.model.get('forceMouseSwipe') === true)) {
                PointerController.prototype.onDrag.apply(this, arguments);
                //prevent drag & drop of images on devices controlled by mouse
                if($('html').hasClass('no-touch')) {
                    e.preventDefault();
                }

                this.model.set('status', this.model.STATUS.DRAG);
                this.validScrolling = null;
                this.getPosition();
            }
        },

        onAnd: function(e) {
            //        e.stopPropagation();
            PointerController.prototype.onAnd.apply(this, arguments);

            if(this.validScrolling == null) {
                this.validScrolling = this.isValidScrollDirection(this.dragPoint, this.buffer.pagePoint, this.model);
            }

            if(this.validScrolling == true) {
                e.preventDefault();
                this.model.set('status', this.model.STATUS.MOVE);
                this.buffer.pagePoint.addLocal(this.position).subtractLocal(this.dragPoint);
                if(this.model.hasHorizontalAlignment()) {
                    this.setPosition(this.buffer.pagePoint.x, 0);
                } else {
                    this.setPosition(0, this.buffer.pagePoint.y);
                }
            } else {
                this.buffer.pagePoint.reset(-1);
            }
        },

        onDrop: function(e) {
            PointerController.prototype.onDrop.apply(this, arguments);
            if(this.validScrolling == true && this.isValidDirection() && this.$el.data('controller') == module.id) {
                this.model.set('status', this.model.STATUS.DROP);
                var position = this.buffer.forecastPosition(this.model.get('scrollDurationDefault'));

                var maxWidth = this.wrapperSize.width - this.$el.outerWidth();
                var maxHeight = this.wrapperSize.height - this.$el.outerHeight();
                this.buffer.pagePoint.reset(position).multiplyLocal(-1).clamp(maxWidth, maxHeight).multiplyLocal(-1);

                var easing = null;
                if(position.equal(this.buffer.pagePoint)) {
                    easing = 'Back.easeOut';
                }
                this.setAnimation(this.model.get('scrollDurationDefault'), this.buffer.pagePoint, easing);
            }
            this.dragPoint.reset(-1);
            this.buffer.pagePoint.reset(-1);
        },

        /*
         *  destroy view
         */
        destroy: function() {
            $(display).off('resize.scroll');
            PointerController.prototype.apply(this, arguments);
        }
    });

    function convertPointToTweenLiteObject(x, y, preventHardwareAcceleration) {
        if(!$('html').hasClass('csstransforms') || preventHardwareAcceleration) {
            return {left: x, top: y};
        } else {
            // z = android fix, else the slider stucks on first touch
            return {x: x, y: y};
        }
    }

    function convertPointToTweenLiteAnimationObject(point, easing, preventHardwareAcceleration) {
        if(!$('html').hasClass('csstransforms') || preventHardwareAcceleration) {
            return {left: point.x + 'px', top: point.y + 'px', overwrite: 'all', ease: easing || 'Quad.easeOut'};
        } else {
            return {x: point.x + 'px', y: point.y + 'px', overwrite: 'all', ease: easing || 'Quad.easeOut'};
        }
    }
});