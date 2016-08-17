define(['module', 'jquery', 'underscore', 'backbone', 'native-history', './history/Entry', './history/Callback', './utils/url'], function(module, $, _, Backbone, History, Entry, Callback, url) {
    // both variables are required -> tempBrowserControlsUsed will be overwritten, so browserControlsUsed is required to save state permanently
    var tempBrowserControlsUsed = true;
    var browserControlsUsed = true;

    var h = new (Backbone.Collection.extend({
        model: Entry,

        callbacks: new (Backbone.Collection.extend({
            model: Callback
        }))(),

        initialize: function() {
            Backbone.Collection.prototype.initialize.apply(this, arguments);

            History.Adapter.bind(window,'statechange', _.bind(function() {
                browserControlsUsed = tempBrowserControlsUsed;
                tempBrowserControlsUsed = true;
                this.add(History.getState().data,{merge: true});
            }, this));

            this.add(toCollection(decodeURIComponent(History.getState().cleanUrl)));

            this.on('change:value', _.bind(function(model, value) {
                _.each(this.callbacks.where({key: model.get('name')}), function(entry, index) {
                    entry.get('callback')(value, browserControlsUsed, entry);
                })
            }, this));
        },

        getValue: function(key) {
            var entry = this.get(key);
            if(entry) {
                return entry.get('value');
            } else {
                return null;
            }
        },

        /*
         * Register hash:change observer and set default hash to browser url, when default value was set
         */
        register: function(name, callback, defaultValue, defaultTitle) {
            if( name===undefined ){
                return;
            }

            var entry = this.callbacks.add({key: name, callback: callback});

            var model = this.get(name);
            // registration - if hash doesn't exist in url
            if(!model) {
                model = this.add(createEntry(name, null));
            }

            // defaultValue - if no value was added to model and defaultValue is defined
            if(!model.get('value') && defaultValue){
                this.replace(name, defaultValue, defaultTitle);
            } else if(model.get('value')) {
                callback(model.get('value'), false, entry);
            }
            return entry;
        },

        unregister: function(entry) {
            this.callbacks.remove(entry);
        },

        /*
         * Update model and update key/value pair in browser url
         *
         * Function Calls:
         * .update(deep<string>, uri<string>, title<string>, browserControls<boolean>)
         * .update(hashmap <object>, title<string>, browserControls<boolean>)
         */
        update: function(deep, uri, title, browserControls) {
            tempBrowserControlsUsed = getBrowserControlsFlag(arguments);
            var tmpCollection = getUpdatedTemporaryCollection(arguments, this);
            // Check if values are changed
            var currentCollection = getUpdatedTemporaryCollection({}, this);
            if( toString(currentCollection)==toString(tmpCollection) ){
                return;
            }

            History.pushState(tmpCollection, getTitle(arguments), toString(tmpCollection));
        },

        /*
         * Replace model value and key/value pair in browser url
         *
         * Function Calls:
         * .replace(deep<string>, uri<string>, title<string>)
         * .replace(hashmap <object>, title<string>)
         */
        replace: function(deep, uri, title, browserControls) {
            var tmpCollection = getUpdatedTemporaryCollection(arguments, this);
            tempBrowserControlsUsed = getBrowserControlsFlag(arguments);
            History.replaceState(tmpCollection, getTitle(arguments), toString(tmpCollection));
        },

        /*
         * Remove model value and remove key/value pair from browser url
         *
         * Function Calls:
         * .remove(deep<string||array>, title<string>)
         */
        remove: function(deep, title, browserControls) {
            var tmpCollection = getUpdatedTemporaryCollection([convertStringOrListToHashMap(deep), title, browserControls], this);
            tempBrowserControlsUsed = browserControls || false;
            History.pushState(tmpCollection, title || null, toString(tmpCollection));
        },

        reset: function(exclude, title, browserControls) {
            var list = [];
            _.each(this.models, function(model, index) {
                if(exclude) {
                    if(isString(exclude) && model.get('name') != exclude) {
                        list.push(model.get('name'));
                    } else if(exclude.indexOf(model.get('name')) == -1) {
                        list.push(model.get('name'));
                    }
                } else {
                    list.push(model.get('name'));
                }
            })
            this.remove(list, title, browserControls);
        },

        isManualStateChange: function() {
            return browserControlsUsed;
        }
    }))();

    return h;

    function isString(obj) {
        return (typeof obj == 'string');
    }

    function getTitle(args) {
        var title = null;
        if(!isString(args[0])) {
            title = args[1];
        } else {
            title = args[2];
        }
        return title || null;
    }

    function toString(collection) {
        var queryString = '';
        switch(module.config().pattern) {
            case 'REST':
                break;
            case 'GETREST':
                queryString = url.convertCollectionToRESTUrl(collection);
                if(!!queryString) {
                    return '?/' + queryString;
                }
                break;
            default:
                queryString = url.convertCollectionToGETUrl(collection);
                if(!!queryString) {
                    return '?' + queryString;
                }
                break;
        }
        return window.location.pathname;
    }

    function toCollection(string) {
        var stack = null;
        switch(module.config().pattern) {
            case 'REST':
                break;
            case 'GETREST':
                stack = url.convertRESTUrlToCollection(string);
                break;
            default:
                stack = url.convertGETUrlToCollection(string);
                break;
        }
        return stack;
    }

    function getUpdatedTemporaryCollection(args, collection) {
        var tmpCollection = collection.toJSON();
        if(isString(args[0])) {
            tmpCollection = updateCollection(tmpCollection, args[0], args[1]);
        } else {
            _.each(args[0], function(value, key) {
                tmpCollection = updateCollection(tmpCollection, key, value);
            });
        }
        return tmpCollection;
    }

    function updateCollection(collection, deep, uri) {
        var model = _.findWhere(collection, {name: deep});
        if(model) {
            model.value = normalizeValue(uri);
        } else {
            collection.push(createEntry(deep, normalizeValue(uri)));
        }
        return collection;
    }

    function normalizeValue(value) {
        var search = /#+/;
        if(search.test(value)) {
            return url.toObject(value).hash;
        } else {
            return value;
        }
    }

    function createEntry(name, value) {
        return {
            name: name,
            value: value
        };
    }

    function getBrowserControlsFlag(args) {
        if(!isString(args[0])) {
            return args[2] || false;
        } else {
            return args[3] || false;
        }
    }

    function convertStringOrListToHashMap(stringOrList) {
        var hashmap = {};
        if(!isString(stringOrList)) {
            _.each(stringOrList, function(value) {
                hashmap[value] = null;
            })
        } else {
            hashmap[stringOrList] = null;
        }
        return hashmap;
    }
});