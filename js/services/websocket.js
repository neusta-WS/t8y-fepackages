define(['jquery', 'underscore', './websocket/User', './websocket/Connection', './websocket/Message', './websocket/Debug'], function($, _, User, Connection, Message, Debug) {
    $(function() {

        var message = new Message({to: 'chat'});
        var user = new User({name: 'EXAMPLE'});
        var c = new Connection({user: user, channel: '/service', success: function(room) {
                console.log(room);
            room.register('event name', function() {
                console.log(arguments);
//                c.leaveRoom('default');
            }, true);
            room.send('event name', new Debug({info: 'Hello World!'}));

            console.log(requirejs.s.contexts._.config);

            console.log(message.constructor == User);

//              console.log(connection.get('user').get('id'), connection.get('users'));
//            console.log(connection.get('user').createMessage());
//            connection.register('chat message', function(message) {
//                console.log(message);
//            });
//
//            message.set('data', 'hello world');
//
//            connection.send('chat message', message);
//            setTimeout(function() {
//                connection.send('chat message', 'zwei');
//            }, 5000);
        }});
    })
});