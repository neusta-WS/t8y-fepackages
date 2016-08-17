require.config({
    baseUrl: '//localhost:8050/js',
    shim: {
        'native-history': {
            exports: 'History'
        }
    },
    map: {
        '*': {
            jquery: 'multiversion/jq_loader_bookmarklet',
            underscore: 'multiversion/underscore_loader',
            backbone: 'multiversion/backbone_loader'
        },
        'jq_loader_1.10.2': {
            jquery: 'jquery'
        },
        'underscore_loader': {
            underscore: 'underscore'
        },
        jQuery: {
            jquery: 'jquery'
        }
    },
    paths: {
        'jquery_bookmarklet': '../_resources/bower/jquery/dist/jquery',
        'jquery-ellocate': '../_resources/modified_sources/ellocate/jquery.ellocate',
        'underscore_1.6': '../_resources/bower/underscore/underscore',
        'backbone_1.1.0': '../_resources/bower/backbone/backbone',
        'css': '../_resources/bower/require-css/css',
        'native-history': '../_resources/bower/history/scripts/bundled-uncompressed/html5/native.history'
    }
});

require(['bookmarklet_fullscreen_main']);