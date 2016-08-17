define(['underscore', 'backbone', './Image', '../utils/animationFrame'], function(_, Backbone, Image, animationFrame) {

    return Backbone.Collection.extend({
        model: Image,
        loaded: 0,
        partial: 0,

        initialize: function() {
            Backbone.Collection.prototype.initialize.apply(this, arguments);
            this.on('change:loaded', _.bind(updateProgress, this));
        },

        load: function(maxSynchronized) {
            this.maxSynchronized = maxSynchronized;
            this.partial += loadPartial(this.models, 0, this.length, Math.ceil(this.length / maxSynchronized));
        },

        getProgress: function() {
            return this.loaded / this.length;
        }
    });

    function updateProgress(model) {
//        console.log('url', model.get('url'));
        this.loaded++;
        this.trigger('progress', this.getProgress());

        animationFrame.add(_.bind(function() {


            var list = _.filter(this.models, function(model) {
                return !model.get('loaded');
            });

            var max = list.length;
            // Wenn Image Package fertig geladen
            if(this.partial == this.loaded) {
                this.trigger('complete:partial', this.getProgress());
                // Wenn nicht geladene Images noch vorhanden sind
                if(max > 0) {
                    var start = Math.round(list.length / this.maxSynchronized / 2);
                    var step = Math.round(list.length / this.maxSynchronized);

                    // Wenn kalkulierter Step die max. Anzahl gleichzeitig zu ladender Bilder unterschreitet
                    if(step < this.maxSynchronized) {
                        start = 0;
                        step = 1;
                        max = this.maxSynchronized;
                    }

                    // Wenn Liste noch zu ladender Images die max. Anzahl gleichzeitig zu ladender Bilder unterschreitet
                    if(list.length < this.maxSynchronized) {
                        max = list.length;
                    }
    //            console.log('TOLL', start, max, step, list);
                    this.partial += loadPartial(list, start, max, step);
                } else {
                    this.trigger('complete', this.getProgress());
                }
            }
        }, this))
    }

    function loadPartial(list, start, max, step) {
        var partial = 0;
        for(var i = start; i < max; i+=step) {
            partial++;
            list[i].load();
        }
        return partial;
    }
});