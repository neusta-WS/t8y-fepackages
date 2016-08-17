var chalk = require('chalk');
var filesize = require('filesize');
var fs = require('fs');

module.exports = function(grunt, registeredTask) {
    var watchConfig = grunt.config.get('watch');

    return function(action, sourcePath, watchTask) {
        if (action === 'deleted' && watchTask == registeredTask) {
            var tasks = watchConfig[watchTask].tasks;
            if(tasks) {
                for(var i = 0; i < tasks.length; i++) {
                    var taskConfig = getTaskConfig(tasks[i]);
                    for(var k = 0; k < taskConfig.files.length; k++) {
                        var destPath = convertSourceToDestinationPath(sourcePath, taskConfig.files[i]);
                        removeFile(destPath);
                    }
                }
            }
        }
    }

    function getTaskConfig(taskName) {
        var taskPath = taskName.split(':');
        var taskConfig = grunt.config.get(taskPath[0]);
        for(var j = 1; j < taskPath.length; j++) {
            taskConfig = taskConfig[taskPath[j]];
        }
        return taskConfig;
    }

    function convertSourceToDestinationPath(sourcePath, filesPattern) {
        var regexp = new RegExp('^' + filesPattern.cwd);
        return sourcePath.replace(regexp, filesPattern.dest);
    }

    function removeFile(destPath) {
        if(grunt.file.exists(destPath)) {
            fs.stat(destPath, function(error, stat) {
                if(grunt.file.delete(destPath)) {
                    grunt.log.writeln(chalk.green('✔ ') + destPath + ' deleted! ' + chalk.gray('(' + filesize(stat.size) + ')'));
                }
            });
        }
    }
}