define(['module', 'underscore', 'backbone', '../utils/device'], function(module, _, Backbone, device){

    window.FB = null;
    var permissionCheckQueue = [];
    var accessedPermissions = [];
    var fbUrl = '//connect.facebook.net/' + (module.config().localization || 'en_US') + '/sdk.js';

    var fbSingleton = new (Backbone.Model.extend({
        defaults: function() {
            return {
                id: null,
                accessToken: null,
                appId: '669637759781844',
                xfbml: true,
                version: 'v2.0',
//                authSuccess: null,
                user: null
            };
        },

        initialize: function() {
            require([fbUrl], _.bind(function() {
                FB.init(this.attributes);
                FB.getLoginStatus(_.bind(setStatus, this));
            }, this));
        },

        login: function(permissions, callback) {
            FB.login(_.bind(function(data) {
                _.bind(setStatus, this)(data);
                callback();
            }, this), {scope: permissions.join(',')});
        },

        getApiData: function(restUrl, permissions, onSuccess, onError) {
            this.hasPermissions(permissions, _.bind(function(result) {
                callFacebookApi(restUrl, onSuccess, onError);
            }, this), onError);
        },

        hasPermissions: function(permissions, onSuccess, onError) {
            if(this.get('id')) {
                checkPermissions(permissions, onSuccess, onError);
            } else {
                permissionCheckQueue.push({ permissions: permissions, onSuccess: onSuccess, onError: onError });
//                onError();
            }
        }
    }))();

    return fbSingleton;

    function setStatus(data) {
        if (data.status === 'connected') {
            var scope = this;

            checkPermissions(['installed'], function() {
                scope.set({ id: data.authResponse.userID, accessToken: data.authResponse.accessToken });
                proceedPermissionCallbackQueue(function(permissions, onSuccess, onError) {
                    scope.hasPermissions(permissions, onSuccess, onError);
                });
            }, function() {
                proceedPermissionCallbackQueue(function(permissions, onSuccess, onError) {
                    onError();
                });
            });
        } else {
            proceedPermissionCallbackQueue(function(permissions, onSuccess, onError) {
                onError();
            });
        }
    }

    function callFacebookApi(restUrl, onSuccess, onError) {
        FB.api(restUrl, function (response) {
            if (response && !response.error) {
                onSuccess(response.data || response);
            } else {
                onError();
            }
        });
    }

    function checkPermissions(permissions, onSuccess, onError) {
        if(requestedPermissionsAreAvailable(permissions)) {
            onSuccess();
        } else {
            updatePermissions(function(updatedPermissions) {
                accessedPermissions = updatedPermissions;
                if(requestedPermissionsAreAvailable(permissions)) {
                    onSuccess();
                } else {
                    onError();
                }
            });
        }
    }

    function updatePermissions(callback) {
        callFacebookApi('/me/permissions', function(data) {
            callback(_.pluck(data, 'permission'));
        }, function() {
            callback([]);
        });
    }

    function requestedPermissionsAreAvailable(requestedPermissions) {
        return (_.difference(requestedPermissions, accessedPermissions).length == 0);
    }

    function proceedPermissionCallbackQueue(proceed) {
        for(var i = 0; i < permissionCheckQueue.length; i++) {
            var requested = permissionCheckQueue[i];
            proceed(requested.permissions, requested.onSuccess, requested.onError);
        }
//        while(permissionCheckQueue.length > 0) {
//
//        }
    }
});