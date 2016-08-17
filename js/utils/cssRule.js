define(['jquery', 'underscore', 'backbone', 'modernizr'], function($, _, Backbone) {
    var styleTag = $('<style type="text/css"></style>').appendTo($('head')).get(0);
    var stylesheet = styleTag.styleSheet || styleTag.sheet;

    var cssRule = new (Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function () {
                return {
                    id: null,
                    style: null
                }
            },

            style: function(style) {
                for(var key in style) {
                    console.log(style[key]);
                    this.get('style')[Modernizr.prefixed(key, this.get('style'), false)] = style[key];
                }
            }
        }),

        initialize: function() {
            Backbone.Collection.prototype.initialize.apply(this, arguments);

            this.on('add', addRule);
        }
    }))();

    return cssRule;

    function addRule(model, collection) {
//        for(var key in stylesheet) {
//            console.log(key);
//        }
//        console.log(stylesheet.styleSheet.addRule);
//        console.log(document.styleSheets[0].addRule);
        if (stylesheet.addRule) {
            stylesheet.addRule(model.get('id'), null, 0);
        } else {
            stylesheet.insertRule(model.get('id') + ' { }', 0);
        }
        model.set('style', getRule(model.get('id')).style);
    }

    function getRule(selector) {
        var rules = stylesheet.rules || stylesheet.cssRules;
//        console.log(rules.length);
        return _.filter(rules, function(cssRule, index) {
//            console.log(getSelector(cssRule));
            if (cssRule.type != 5 && getSelector(cssRule) == selector) {
//                console.log('BESTANDEN' + selector);
                return cssRule;
            }
        })[0];
    }

    function getSelector(rule) {
        var selector = rule.selectorText || rule.name;
        return selector.replace(/\'/g, '"').toLowerCase();
    }
});