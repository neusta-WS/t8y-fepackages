define(['module', 'underscore', './omniture/PageLoad', './omniture/InternalLink', './omniture/InternalCustomerLink', './omniture/DownloadLink', 'requirejs-text'], function(module, _, PageLoad, InternalLink, InternalCustomerLink, DownloadLink) {
    var devAccount = 'vwpkwd4cmstest';
    var intAccount = 'vwintmktgprod';

    require.config( {
        config: {
            'tracking/omniture/Core': module.config()
        }
    } );

    return {
        setup: function(pageName, callback) {
            if(module.config().enable) {
                if(module.config().live == true) {
                    identifyLiveReportSuite(_.bind(function() {
                        initializeTrackingScript(this, pageName, callback);
                    }, this));
                } else {
                    window.s_account = devAccount;
                    initializeTrackingScript(this, pageName, callback);
                }
            }
        },

        pageLoad: new PageLoad(),
        internalLink: new InternalLink(),
        internalCustomerLink: new InternalCustomerLink(),
        downloadLink: new DownloadLink()
    };

    function initializeTrackingScript(scope, pageName, callback) {
        require([module.config().script], function() {
            window.s.useForcedLinkTracking = false;
            window.s.trackExternalLinks = false;
            window.s.trackInlineStats = true;
            window.s.trackDownloadLinks = false;

            scope.pageLoad.send(pageName);
            setTimeout(function() {
                callback();
            }, 500);
        });
    }

    function identifyLiveReportSuite(callback) {
        if(/(.json)$/.test(module.config().reportsuite)) {
            require(['requirejs-text!' + module.config().reportsuite], function(reportsuites) {
                var reportSuiteId = getReportSuiteId(JSON.parse(reportsuites));
                if(reportSuiteId != intAccount) {
                    reportSuiteId += ',' + intAccount;
                }
                window.s_account = reportSuiteId;
                callback();
            });
        } else {
            window.s_account = module.config().reportsuite;
            callback();
        }
    }

    function getReportSuiteId(reportsuites){
        var key = (module.config().language + '-' + module.config().country).toLowerCase();d
        var result = _.filter(reportsuites, function(obj){
            return key == obj[3].toLowerCase();
        });
        if(result.length == 1) {
            return result[0][2];
        } else {
            return intAccount;
        }
    }
});