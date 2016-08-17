define(['jquery', 'underscore', './Base', '../utils/viewport', 'TweenMax'], function($, _, Base, viewport) {

    return Base.extend({



        onActive: function(scrollPos) {

            this.model.get('elements').each(function(index, node) {
                node.style.cssText = 'margin-top:' + (-viewport.get('size').height * scrollPos.y) + 'px;';
            });
//            TweenMax.set(this.el, {y: -viewport.get('size').height * scrollPos.y});
        }
    });
});