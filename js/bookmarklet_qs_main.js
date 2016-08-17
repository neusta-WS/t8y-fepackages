define(['jquery', 'underscore', './layer/Panel', './navigation/Menu', 'jquery-ellocate', 'css!../_release/css/bookmarklet', 'css!../_release/assets/fonts/icomoon/style.css'], function($, _, Panel, Menu) {
    console.log('jQuery Version:', $.fn.jquery);

    var nodes = $('html').find('.controller[data-controller]');
    var masters = nodes.not('[data-target]');


    var slaves = nodes.filter('[data-target]');

    slaves.each(function(index, node) {
        var $target = $($(node).data('target'));
        if(!!$target.data('controller')) {
            if(!$target.data('slaves')) {
                $target.data('slaves', []);
            }
            $target.data('slaves').push($(node));
        } else {
            masters = masters.add(node)
        }
    });

    var test = Array.prototype.reverse.call(masters);
    for(var i = 0; i < test.length-1; i++) {
        for(var j = i+1; j < test.length; j++) {
            if($(test[j]).find($(test[i])).length > 0) {
                if(!$(test[j]).data('slaves')) {
                    $(test[j]).data('slaves', []);
                }
                $(test[j]).data('slaves').push($(test[i]));
                test[i] = null;
                break;
            }
        }
    }

    var masters = Array.prototype.reverse.call(test);

    var node = $('<div class="bookmarklet-panel controller" data-controller="t8y/layer/Panel">' +
            '<a class="close" href="#close">close</a>' +
            '<div class="content"></div>' +
        '</div>');
    $('body').append(node);
    $('.content', node).append(createNavigation(masters));

    new Panel({el: node.get(0)});

    function createNavigation(nodes) {
        var list = $('<ul></ul>');
        nodes.each(function(index, node) {
            if(node) {
                var item = $('<li></li>');
                item.append('<a href="#">' + $(node).data('controller') + '</a>');
                if($(node).data('slaves')) {
                    item.addClass('menu');
                    item.append(createNavigation($($(node).data('slaves'))));
                }
                item.appendTo(list);
                console.log($(node).data('controller'));
                new Menu({el: item.get(0)});
            }
        });
        return list;
    }
});