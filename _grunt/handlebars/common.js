var handlebars = require('../../node_modules/grunt-compile-handlebars/node_modules/handlebars');

module.exports = function(common, options) {
    var context = Object.create(this);
    context["content"] = options.fn? options.fn(context): '';

    for (var name in options.hash) {
        context[name] = options.hash[name];
    }

    return handlebars.partials['common/' + common](context);
};