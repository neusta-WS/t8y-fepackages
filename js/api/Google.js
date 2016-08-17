define(['module', 'jquery', 'underscore', 'backbone'], function(module, $, _, Backbone) {
    var ytCallbacks = [];
    var loadedLibraries = {};

    window.onYouTubeIframeAPIReady = function() {
        while(ytCallbacks.length > 0) {
            ytCallbacks.pop()(YT);
        }
    }

    return {
        getMaps: function(callback) {
            if(loadedLibraries['maps']) {
                callback(loadedLibraries['maps']);
            } else {
                loadLibrary('//maps.googleapis.com/maps/api/js?key=' + module.config().apiKey + '&sensor=true&callback', _.bind(function(maps) {
                    loadedLibraries['maps'] = maps;
                    callback(maps);
                }, this), 'google.maps');
            }
        },

        loadClientLibrary: function(submodule, callback) {
            var scope = this;
            if(loadedLibraries[submodule]) {
                callback(loadedLibraries[submodule]);
            } else {
                loadLibrary('//apis.google.com/js/client.js!onload', function(client) {
                    client.setApiKey(module.config().apiKey);
                    client.load(submodule, 'v1', function() {
                        loadedLibraries[submodule] = client[submodule];
                        callback(client[submodule]);
                    });
                }, 'gapi.client');
            }
        },

        getYoutube: function(callback) {
            if(window.YT === undefined) {
                ytCallbacks.push(callback);
                require(['//www.youtube.com/iframe_api']);
            } else {
                callback(YT);
            }
        }
    };

    function loadLibrary(url, callback, obj) {
        require(['async!' + url], function() {
            callback(eval(obj));
        });
    }
});

