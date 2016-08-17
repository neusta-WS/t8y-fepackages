define(['jquery', 'underscore', './Base', '../utils/viewport', 'TweenMax'], function($, _, Base, viewport) {

    $(function() {
        var count = 0;
        Array.prototype.reverse.call($('.col-xs-12')).each(function(index, node) {
            $(node).css('z-index', count);
            if($(node).is('[data-controller="t8y/parallax/Fixed"]')) {
                count++;
            }
        })
    })

    return Base.extend({
        visible: false,
        fullSize: true,

        initialize: function() {
            Base.prototype.initialize.apply(this, arguments);
        },

        onActive: function(scrollPos) {
            this.visible = updateVisibility(this.$el, true, this.visible);
            this.fullSize = updateSize(this.model.get('elements'), scrollPos, this.fullSize);
        },

        onInactive: function() {
            this.visible = updateVisibility(this.$el, false, this.visible);
        }
    });

    function updateSize(nodes, scrollPos, fullSize) {
        nodes.each(function(index, node) {
            if(scrollPos.y > 0) {
                node.style.cssText = 'height:' + ((1 - scrollPos.y) * 100) + '%;';
                fullSize = false;
            } else if(fullSize == false) {
                node.style.cssText = '';
                fullSize = true;
            }
        });
        return fullSize;
    }

    function updateVisibility(node, visible, saved) {
        if(saved == false && visible == true) {
            node.addClass('visible');
            return visible;
        } else if(saved == true && visible == false) {
            node.removeClass('visible');
            return false;
        }
        return saved;
    }
});