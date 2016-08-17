define(['underscore', 'backbone', './UserList', './Message'], function(_, Backbone, UserList, Message) {

    var defaultMessage = new Message();

    return Backbone.Model.extend({

        defaults: function() {
            return {
                name: 'default',
                user: null,
                users: new UserList(),
                socket: null,
                success: function() {}
            }
        },

        initialize: function() {
            Backbone.Model.prototype.initialize.apply(this, arguments);

            this.register('user:registered', _.bind(function(userList) {
                this.set('users', userList);
                console.log('REGISTERED - RETRIEVED USER LIST LENGTH:', this.get('users').length);
                this.get('success')(this);
            }, this));
            this.register('user:add', _.bind(addUser, this));
            this.register('user:remove', _.bind(removeUser, this), true);

            this.get('socket').emit('room:join', {to: this.get('name')});
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
            defaultMessage.set('to', this.get('name'));
            defaultMessage.set('type', data.type);

            this.get('socket').emit(eventName, defaultMessage);
        },

        destroy: function() {
            defaultMessage.reset();
            defaultMessage.set('to', this.get('name'));

            this.get('socket').emit('room:leave', defaultMessage);
            Backbone.Model.prototype.destroy.apply(this, arguments);
        }
    });

    function addUser(user, type, from, to, time) {
        this.get('users').add(user);
        console.log('AFTER ADD', this.get('users'));
    }

    function removeUser(user, type, from, to, time) {
        this.get('users').remove(user.get('id'));
        console.log('AFTER REMOVE', this.get('users'));
    }
});