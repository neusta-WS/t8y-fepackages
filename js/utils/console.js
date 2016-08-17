define(['module'], function(module) {
    var methods = ('assert,count,debug,dir,dirxml,error,exception,group,' +
        'groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,' +
        'time,timeEnd,trace,warn').split(',');

    if(module.config().disable == true) {
        for(var i = 0; i < methods.length; i++) {
            window.console[methods[i]] = function() {};
        }
    }
});