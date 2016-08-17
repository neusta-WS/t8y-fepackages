var handlebars = require('../../node_modules/grunt-compile-handlebars/node_modules/handlebars');

module.exports = function(path, options) {
    return handlebars.partials[path](getContext(this, options));
};

function getContext(scope, options) {
    var context = Object.create(scope);
    filterParameters(options, function(name, value) {
        context[name] = value;
    });

    var content = compileContent(context, options);
    if(content) {
        context["content"] = content;
    }
    return context;
}

function filterParameters(options, callback) {
    for(var name in options) {
        if(name != 'hash') {
            callback(name, options[name]);
        }
    }
    filterHashValues(options, callback);
}

function filterHashValues(options, callback) {
    if(options && options.hash) {
        for (var name in options.hash) {
            callback(name, options.hash[name]);
        }
    }
}

function compileContent(context, options) {
    if(options && options.fn) {
        return options.fn(context);
    } else {
        return;
    }
}