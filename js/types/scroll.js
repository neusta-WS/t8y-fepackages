define(['backbone', '../types/Point', '../types/Size'], function(Backbone, Point, Size) {
    var docElement = document.documentElement;
    var body = document.body;

    return Backbone.Model.extend({

        defaults: function() {
            return {
                content: document.body,
                position: new Point(),
                size: new Size(),
                range: new Size()
            }
        },

        update: function(size) {
            if(size) {
                updateScrollSize(this);
                updateScrollRange(this, size);
            }
            updateScrollPosition(this);
        }
    });

    function updateScrollPosition(scope) {
        scope.get('position').setX(getScrollLeft(scope.get('content'))).setY(getScrollTop(scope.get('content')));
    }

    function updateScrollSize(scope) {
        scope.get('size').setWidth(scope.get('content').scrollWidth).setHeight(scope.get('content').scrollHeight);
    }

    function updateScrollRange(scope, size) {
        scope.get('range').setWidth(scope.get('size').width).setHeight(scope.get('size').height);
        scope.get('range').subtractLocal(size);
    }

    function getScrollTop(content) {
        if(content === document.body) {
            return window.pageYOffset || (docElement || body.parentNode || body).scrollTop
        }
        return content.scrollTop;
    }

    function getScrollLeft(content) {
        if(content === document.body) {
            return window.pageXOffset || (docElement || body.parentNode || body).scrollLeft
        }
        return content.scrollLeft;
    }
});