var path = require('path');
var glob = require('glob');
var handlebars = require('handlebars');

module.exports = function(grunt, partialRepos) {
    return function() {
        collectPartialResources(partialRepos, function(repos) {
            while(repos.length > 0) {
                loadPartialsFromRepo(grunt, repos.pop());
            }
        });
    }
}

function collectPartialResources(partialRepos, callback) {
    var repos = [];
    while(partialRepos.length > 0) {
        var repo = partialRepos.pop();
        if(repo == 't8y') {
            repos.push(getPartialRepoConfig('t8y', ''));
        } else {
            addPartialResourceFolder(repos, repo);
        }
    }
    callback(repos);
}


// add folder to repo if exists
function addPartialResourceFolder(repos, name) {
    glob('_resources/bower/' + name + '*/bower.json', {
        sync: true,
        cwd: ''
    }, function (er, files) {
        if(files.length == 1) {
            repos.push(getPartialRepoConfig(name, path.dirname(files[0]) + '/'));
        }
    });
}

function getPartialRepoConfig(name, path) {
    return {name: name, path: path};
}

function loadPartialsFromRepo(grunt, repo) {
    grunt.file.expand(repo.path + 'tmpl/**/*.handlebars').forEach(function (tmpl) {
        var name = repo.name + tmpl.substring((repo.path + 'tmpl').length, tmpl.lastIndexOf('.'));
        handlebars.registerPartial(name, require(path.resolve(tmpl)));
    });
}