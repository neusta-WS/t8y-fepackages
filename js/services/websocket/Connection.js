define(['jquery', 'underscore', 'backbone', 'socketIO', './User', './UserList', './Room', './Message'], function($, _, Backbone, socketIO, User, UserList, Room, Message) {
    var defaultMessage = new Message();

    return Backbone.Model.extend({
        defaults: function() {
            return {
                socket: null,
                channel: '/',
                rooms: {},
                user: null,
                success: function() {}
            }
        },

        initialize: function() {
            Backbone.Model.prototype.initialize.apply(this, arguments);

            $(window).on('beforeunload', _.bind(function() {
                this.destroy();
            }, this));

            this.set('socket', socketIO.connect('http://localhost' + this.get('channel'))
                .on('connect', _.bind(onConnect, this))
                .on('disconnect', _.bind(onDisconnect, this)));
        },

        joinRoom: function(name, success) {
            var room = this.get('rooms')[name];
            if(!room) {
                room = new Room({name: name, user: this.get('user'), socket: this.get('socket'), success: success});
                this.get('rooms')[name] = room;
            }
            return room;
        },

        leaveRoom: function(name) {
            this.get('rooms')[name].destroy();
            this.get('rooms')[name] = null;
        },

        register: function(name, callback, rawData) {
            this.get('socket').on(name, _.bind(function(msg) {
                if(msg.to == this.get('name')) {
                    defaultMessage.reset(msg);
                    defaultMessage.triggerObject(callback, rawData);
                }
            }, this));
        },

        send: function(eventName, data) {
            defaultMessage.reset();
            defaultMessage.set('data', data);

            this.get('socket').emit(eventName, defaultMessage);
        },

        destroy: function() {
            this.get('socket').disconnect();
            Backbone.Model.prototype.destroy.apply(this, arguments);
        }
    });

    function onConnect() {
        this.get('user').set('id', this.get('socket').io.engine.id);
        this.send('register', this.get('user'));
        this.joinRoom('default', this.get('success'));
    }

    function onDisconnect() {
        this.set('rooms', {});
    }
});