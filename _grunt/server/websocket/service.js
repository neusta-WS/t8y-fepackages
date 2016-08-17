var users = [];
var message = {
    type: '',
    room: '',
    from: null,
    data: null,
    time: null
};

var rooms = [];

var _ = require('underscore');

module.exports = function(io) {
    var service = io.of('/service')
        .on('connection', function(socket){
            socket.on('register', _.bind(registerUser, socket));
//            socket.on('user:add', _.bind(addUser, socket));
            socket.on('disconnect', _.bind(unregisterUser, socket));

            socket.on('room:join', function(data) {
                console.log('JOIN ROOM', data.to);
                joinRoom(socket, data.to);
            });

            socket.on('room:leave', function(data) {
                console.log('LEAVE', data, socket.id);
                leaveRoom(socket, data.to);
            });

            socket.on('event name', function(msg){
                socket.to(msg.to).emit('event name', msg);
            });
        });

    function addUser(msg) {
        console.log('MESSAGE', msg);

        this.to(msg.to).emit('user:add', enrichMessage(this, msg));


    }

    function registerUser(msg) {
        this.user = msg.data;
        users.push(this.user);
    }

    function unregisterUser() {
        var socket = this;
        _.each(this.rooms, function(item) {
            leaveRoom(socket, item);
        });
        this.user = null;
        users = _.reject(users, function(item) { return item.id === socket.id; });
        console.log(users);
    }

    function joinRoom(socket, name) {
        // join room
        socket.join(name);

        // send user the user list of the room
        socket.emit('user:registered', createMessage('t8y/services/websocket/UserList', findRoom(name).users, name));

        // update user list of the room
        var room = findRoom(name);
        room.users.push(socket.user);

        // notify other clients of new user which also registered to the room
        socket.to(name).emit('user:add', createMessage('t8y/services/websocket/User', socket.user, name));
        console.log('new user added to', name, 'length:', room.users.length);
    }

    function leaveRoom(socket, name) {
        // leave room
        socket.leave(name);

        // remove user from user list of rooms
        var room = findRoom(name);
        room.users = _.reject(room.users, function(item) { return item.id === socket.id; });

        // notify other clients of removed user which are also registered to the room
        socket.to(name).emit('user:remove', createMessage('t8y/services/websocket/User', socket.user, name));
        console.log('user removed from', name, 'length:' ,room.users.length);
    }

    function findRoom(name) {
        var room = _.findWhere(rooms, {name: name});
        if(!room) {
            room = {name: name, users: []};
            rooms.push(room);
        }
        return room;
    }

    function enrichMessage(socket, msg) {
        msg.from = socket.id;
        msg.time = Date.now();
        return msg;
    }

    function createMessage(type, data, to) {
        message.type = type;
        message.data = data;
        message.to = to;
        message.time = Date.now();
        return message;
    }
}