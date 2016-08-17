define(['module', 'backbone'], function(module, Backbone) {

    return Backbone.Model.extend({
        defaults: function() {
            return {
                pageName: null,
                channel: null,

                eVar1: getEVAR1(),
                eVar8: 'None',
                eVar9: 'None',
                eVar10: 'None',

                prop8: module.config().tenantID || getEVAR1(),
                prop32: module.config().campaign,
                prop33: null,
                prop41: null,
                prop42: null,

                pev1: null,
                pev2: null
            }
        },

        initialize: function() {
            this.setParameters(module.config().parameters);
        },

        send: function() {
            sendTrackingRequest(this, null, null);
        },

        setCarModel: function(carlineGroupName, carlineName, equipmentlineName) {
            this.set('eVar8', carlineGroupName);
            this.set('eVar9', carlineName);
            this.set('eVar10', equipmentlineName);
            this.set('prop41', carlineGroupName);
        },

        resetCarModel: function() {
            var defaultParams = this.defaults();
            this.set('eVar8', defaultParams.eVar8);
            this.set('eVar9', defaultParams.eVar9);
            this.set('eVar10', defaultParams.eVar10);
            this.set('prop41', defaultParams.prop41);
        },

        setParameters: function(params) {
            if(params) {
                for(var key in params) {
                    this.set(key, params[key]);
                }
            }
        }
    });

    function getEVAR1() {
        return module.config().campaign + '-' + module.config().language + '-' + module.config().country;
    }

    function sendTrackingRequest(scope, target, pointer) {
        var linkTrackVars = [];
        for(var key in scope.attributes) {
            // PageName und LinkName mit TrackValuePrefix versehen
            if((key == 'pageName' || key == 'pev2') && scope.attributes[key]) {
                window.s[key] = module.config().trackValuePrefix + ' : ' + scope.attributes[key];
            } else {
                window.s[key] = scope.attributes[key];
            }
            if(scope.attributes[key] != null) {
                linkTrackVars.push(key);
            }
        }

        if(scope.type != 'p') {
            window.s.linkTrackVars = linkTrackVars.join(',');
            window.s.trackExternalLinks = false;

        }
        var s_code = null;
        if(scope.type == 'p') {
            s_code = s.t();
        } else {
            if (!pointer) {
                pointer = true;
            }
            s_code = s.tl(pointer, scope.type, window.s.pev2);
        }

        if(s_code) {
            document.write(s_code);
        }
    }
});