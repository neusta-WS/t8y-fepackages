define([ 'module', 'jquery', 't8y/slider/Flip', 't8y/utils/device/display', 't8y/utils/math', 't8y/utils/animationFrame', 'Backbone', 'TweenMax' ], function (module, $, Flip, display, math, animationFrame) {

    return Flip.extend({
        el: $('[data-controller="' + module.id + '"]'),

        numberOfOffsetNodes: 2,

        events: function(){
            return _.extend(Flip.prototype.events,{
                'view:animation:start' : animationStart,
                'view:animation:stop' : animationStop
            });
        },

        initialize: function () {
            var wrapper =  $('[data-element="wrapper"]', this.$el);
            var views = $('[data-element="view"]', wrapper);

            this.determineMaxViews(views);

            if(views.length > 1) {
                for(var i = 0; i < this.numberOfOffsetNodes; i++) {
                    $(views.get(i)).clone().appendTo(wrapper).attr('data-clone', '');
                }
                for(var i = views.length; i > views.length - this.numberOfOffsetNodes; i--) {
                    $(views.get(i-1)).clone().prependTo(wrapper).attr('data-clone', '');
                }
            }

            if(this.$el.data('view-no')) {
                this.$el.data('view-no', +this.$el.data('view-no') + this.numberOfOffsetNodes);
            } else {
                this.$el.data('view-no', this.numberOfOffsetNodes);
            }

            Flip.prototype.initialize.apply(this, arguments);
        },

        render: function() {
            Flip.prototype.render.apply(this, arguments);
        }
    });

    function animationStart(e) {
        if(e.no == 1 || e.no == this.views.length - this.numberOfOffsetNodes) {
            this.disableScrolling();
        }
    }

    function animationStop( e ) {
        var secondViewNo = -1 + this.numberOfOffsetNodes;
        var secondLastViewNo = this.views.length - this.numberOfOffsetNodes;
        if(e.no == secondViewNo) {
            addViewsFromWrapperToNode(1, 0, this.views, this.$el, this.alignment, this.ALIGNMENT);

            var x = -$(this.views.get(secondLastViewNo - 1)).position().left;
            var y = -$(this.views.get(secondLastViewNo - 1)).position().top;
            this.setPosition({x: x, y: y});
            this.no = secondLastViewNo - 1;

            addViewsFromNodeToWrapper(0, 1, this.views, this.wrapper, this.alignment, this.ALIGNMENT, _.bind(function() {
                this.enableScrolling();
            }, this), true);
        } else if(e.no >= secondLastViewNo) {
            addViewsFromWrapperToNode(secondLastViewNo, this.views.length - 1, this.views, this.$el, this.alignment, this.ALIGNMENT);

            var x = -$(this.views.get(this.numberOfOffsetNodes + Math.abs( secondLastViewNo - e.no))).position().left;
            var y = -$(this.views.get(this.numberOfOffsetNodes + Math.abs( secondLastViewNo - e.no))).position().top;
            this.setPosition({x: x, y: y});
            this.no = this.numberOfOffsetNodes + Math.abs( secondLastViewNo - e.no);

            addViewsFromNodeToWrapper(secondLastViewNo, this.views.length - 1, this.views, this.wrapper, this.alignment, this.ALIGNMENT, _.bind(function() {
                this.enableScrolling();
            }, this));
        }
    }

    function addViewsFromWrapperToNode(from, to, views, root, alignment, ALIGNMENT ) {
        // Ermittlung min/max damit die for schleife immer korrekt greift, egal ob element am anfang oder am ende des stripes definiert werden müssen
        var max = Math.max(from, to);
        var min = Math.min(from, to);
        for(var i = max; i >= min; i--) {
            var node = $(views.get(i));
            if(alignment == ALIGNMENT.VERTICAL) {
                node.prependTo(root).css('top', -(from - i) * math.dimension.getPixelToPercentHeight($(node).parent(), $(node)) + '%');
            } else {
                node.prependTo(root).css('left', -(from - i) * math.dimension.getPixelToPercentWidth($(node).parent(), $(node)) + '%');
            }
        }
    }

    function addViewsFromNodeToWrapper(from, to, views, root, alignment, ALIGNMENT, callback, prepend) {
        var count = 0;
        // FIX: Wartet 10 Keyframes ab, bis die geklonten Elemente wieder an ihren ursprünglichen Platz im Wrapper zurückgesetzt werden, da ansonsten ein Flackern wahrzunehmen ist (iPad relevant)
        var test = animationFrame.add(function(e){
            count++;
            if(count == 10) {
                if(prepend === true) {
                    for(var i = to; i >= from; i--) {
                        var node = $(views.get(i));
                        addToWrapper(node, root, alignment, ALIGNMENT, 'prependTo');
                    }
                } else {
                    for(var i = from; i <= to; i++) {
                        var node = $(views.get(i));
                        addToWrapper(node, root, alignment, ALIGNMENT, 'appendTo');
                    }
                }
                animationFrame.cancel(test);
                callback();
            }
        });
    }

    function addToWrapper(node, root, alignment, ALIGNMENT, addFunc) {
        var viewNo = +$(node).data('no');
        if(alignment == ALIGNMENT.VERTICAL) {
            node[addFunc](root).css({
                top: viewNo * math.dimension.getPixelToPercentHeight($(node).parent(), $(node)) + '%'
            });
        } else {
            node[addFunc](root).css({
                left: viewNo * math.dimension.getPixelToPercentWidth($(node).parent(), $(node)) + '%'
            });
        }
    }
});