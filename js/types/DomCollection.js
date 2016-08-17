define(['jquery', 'backbone', 't8y/types/Controller', 't8y/types/DomModel'], function($, Backbone, Controller, DomModel) {

    return Backbone.Collection.extend({

        initialize: function() {
            Backbone.Collection.prototype.initialize.apply(this, arguments);
            this.on('remove add', function(model, collection) {
                console.log('Collection Length:', collection.length);
            });
        },

        add: function() {
            var args = arguments;
            args[0] = getModelsOfDomNodes(args[0]);
            Backbone.Collection.prototype.add.apply(this, args);
        }
    });

    function getModelsOfDomNodes(nodes) {
        var list = [];

        if(nodes) {
            $(nodes).each(function(index, node) {
                if(node instanceof DomModel) {
                    list.push(node);
                } else if(node instanceof Controller){
                    list.push(node.model);
                } else if(isElement(node)){
                    list.push($(node).data('interface').model);
                } else if(node instanceof Object){
                    list.push(node);
                }
            });
        }
        return list;
    }

    function isElement(o){
        return (typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string");
    }
});