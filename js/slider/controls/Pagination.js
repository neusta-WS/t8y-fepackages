define([ 'module', 'jquery', 'underscore', 'backbone' ], function (module, $, _, Backbone) {

    return Backbone.View.extend({
        events: {
            'click [data-element="anchor"]': sendUpdate
        },

        initialize: function (root) {
            var master = $(this.$el.data('target'));

            this.model = master.data('interface').model;
            this.model.on('change:view', _.bind(this.render, this));
            this.model.on('change:viewMax', _.bind(this.render, this));

            this.anchors = $();

            this.render();
        },

        render: function(e) {
            var numNeededAnchors = this.model.get('viewMax');
            var numAdditionalAnchors = numNeededAnchors - this.anchors.length;
            if(numAdditionalAnchors >= 0) {
                _.bind(createMissingAnchors, this)(numAdditionalAnchors);
            } else {
                _.bind(removeRedundantAnchors, this)(numNeededAnchors);
            }

            for(var i = 0; i < this.anchors.length; i++) {
                this.anchors.eq(i).attr('data-no', i).data('no', i);
            }
            update.call(this);
        }
    });

    function createMissingAnchors(numAdditionalAnchors) {
        for(var i = 0; i < numAdditionalAnchors; i++) {
            var listElem = $('<li></li>').appendTo(this.$el);
            var link = $('<a data-element="anchor"></a>').appendTo(listElem);
            this.anchors.push( listElem.get(0) );
        }
    }

    function removeRedundantAnchors(numNeededAnchors) {
        while(this.anchors.length > numNeededAnchors) {
            var anchor = this.anchors.pop();
            $(anchor).remove();
        }
    }

    function update(e) {
        this.anchors.removeClass('active');
            this.anchors.filter('[data-no="' + this.model.get('view') + '"]').addClass('active');
    }

    function sendUpdate(e) {
        this.model.set('scrollToView', $(e.currentTarget).parent().data('no'));
    }
});