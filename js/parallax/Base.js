define(['jquery', 'underscore', '../types/Controller', './BaseModel', '../utils/viewport'], function($, _, Controller, BaseModel, viewport) {

    return Controller.extend({
        model: BaseModel,

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);

            var scope = this;
            this.scrollEntry = viewport.register(function(type) {
                if(type === viewport.EVENT_TYPES.RESIZE) {
                    update(scope);
                }

                var bounds = scope.model.get('bounds');
                if(bounds.intersects(viewport.get('bounds'))) {
                    // Normalisierung des Überschneidungs-Wertes (±1) und speichern als Point
                    var scrollPos = bounds.getIntersectionInfo(viewport.get('bounds')).normalizeLocal(scope.model.get('outerSize'));

                    scope.onActive(scrollPos);
                } else {
                    scope.onInactive();
                }
            });

            update(this);
        },

        onActive: function() {},

        onInactive: function() {},

        destroy: function() {
            Controller.prototype.destroy.apply(this, arguments);
            viewport.unregister(this.scrollEntry);
        }
    });

    function update(scope) {
        var offset = scope.$el.offset();
        scope.model.get('position').setX(offset.left).setY(offset.top).subtractLocal(parseInt(scope.$el.css('margin-left')) || 0, parseInt(scope.$el.css('margin-top')) || 0);
        scope.model.get('size').setWidth(scope.$el.outerWidth()).setHeight(scope.$el.outerHeight());
        scope.model.get('bounds').reset(scope.model.get('position'), scope.model.get('size'));
        scope.model.get('outerSize').copyLocal(scope.model.get('size')).addLocal(viewport.get('size'))
    }
});