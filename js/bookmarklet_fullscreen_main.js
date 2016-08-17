define(['jquery', 'underscore'], function($, _) {
    var button = $('<button style="position:fixed; top: 0;">Fullscreen</button>').appendTo($('body'));
    button.on('click', function() {
        var node = $('body')[0];
        if(node.requestFullscreen) {
            console.log('requestFullscreen');
            node.requestFullscreen();
        } else if(node.mozRequestFullScreen) {
            console.log('mozRequestFullScreen');
            node.mozRequestFullScreen();
        } else if(node.webkitRequestFullscreen) {
            console.log('webkitRequestFullscreen');
            node.webkitRequestFullscreen();
        } else if(node.msRequestFullscreen) {
            console.log('msRequestFullscreen');
            node.msRequestFullscreen();
        } else if(node.webkitEnterFullscreen) {
            console.log('webkitEnterFullscreen');
            node.webkitEnterFullscreen();
        }
    });

});