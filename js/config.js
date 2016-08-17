require.config({
    shim: {
        'native-history': {
            exports: 'History'
        },
        'TweenMax': {
            deps: [
                'greensock/plugins/CSSPlugin',
                'greensock/easing/EasePack'
            ],
            exports: 'TweenMax'
        }
    },
    map: {
        '*': {
            jquery: 'multiversion/jq_loader_1.10.2',
            underscore: 'multiversion/underscore_loader',
            backbone: 'multiversion/backbone_loader'
        },
        'jq_loader_1.9.1': {
            jquery: 'jquery'
        },
        'jq_loader_1.10.2': {
            jquery: 'jquery'
        },
        jQuery: {
            jquery: 'jquery'
        },
        'underscore_loader': {
            underscore: 'underscore'
        },
        'backbone_loader': {
            backbone: 'backbone'
        }
    },
    paths: {
        t8y: '.',
        'jquery_1.10.2': '../_resources/bower/jquery/dist/jquery',
        'underscore_1.6': '../_resources/bower/underscore/underscore',
        'backbone_1.1.0': '../_resources/bower/backbone/backbone',
        'native-history': '../_resources/bower/history/scripts/bundled-uncompressed/html5/native.history',
        modernizr: '../_resources/bower/modernizr/modernizr',
        mediaelementplayer: '../_resources/modified_sources/mediaelement/build/mediaelement-and-player',
        'jquery-cookie': '../_resources/bower/jquery-cookie/jquery.cookie',
        jquery: '../_resources/bower/jquery/dist/jquery',
        css: '../_resources/bower/require-css/css',
        'css-builder': '../_resources/bower/require-css/css-builder',
        normalize: '../_resources/bower/require-css/normalize',
        'requirejs-text': '../_resources/bower/requirejs-text/text',
        requirejs: '../_resources/bower/requirejs/require',

        async: '../_resources/bower/requirejs-plugins/src/async',
        propertyParser : '../_resources/bower/requirejs-plugins/src/propertyParser',
        goog: '../_resources/bower/requirejs-plugins/src/goog',

        'jquery-whenlive': '../_resources/bower/jquery-whenlive/src/jquery.whenlive',
        TweenMax: '../_resources/bower/greensock/src/uncompressed/TweenMax',
        greensock: '../_resources/bower/greensock/src/uncompressed',
        'jquery-pointerevents': '../_resources/bower/jquery-pointerevents/dist/jquery-pointerevents',
        pusher: '//js.pusher.com/2.2/pusher.min',
        'socketIO': '/socket.io/socket.io',
        cookie: '../_resources/bower/jquery-cookie/jquery.cookie',
        plupload: '../_resources/bower/plupload/js/plupload.full.min'
    },

    packages: [
        "t8y"
    ],

    config: {
        't8y/utils/parser': {
            parseOnLoad: true
        },
        'utils/device/display': {
            orientationOnDesktop: true,
            zoomable: false,
            fullscreen: false,
            retinaSupport: {
                ios: false,
                android: false
            }
        },
        'History': {
//            pattern: 'REST',
//            pattern: 'GETREST'
//            pattern: 'GET'
        },

        't8y/api/bitly/url': {
            apiKey: '666877ab837b9bec03e196907e89a411167f9c0a'
        },

        't8y/api/google/url': {
            apiKey: 'AIzaSyC_IJ0DBKW7ROOcxeK3aN5bSQkIubFvrPM'
        },

        't8y/api/Google': {
            apiKey: 'AIzaSyC_IJ0DBKW7ROOcxeK3aN5bSQkIubFvrPM'
        },
        'media/Video': {
            "pluginPath": "../ext_sources/"
        }
    }
});


require(['t8y'], function ($) {

});





