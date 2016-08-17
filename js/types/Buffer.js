define([], function() {

    var Buffer = function(size){
        this.size = size;
        this.type = function() {};
        this.reset();
    }

    Buffer.prototype.reset = function(){
        this.list = [];
        this.index = 0;
        for( var i = 0; i < this.size; i ++ ) {
            this.list[i] = new this.type();
        }
    }

    Buffer.prototype.add = function(value){
        this.list[this.index % this.size] = value;
        this.index++ ;
        return this;
    }

    Buffer.prototype.get = function(no) {
        return this.list[(this.index - 1 - no) % this.size];
    }

    Buffer.prototype.getLatestEntry = function() {
        return this.get(0);
    }

    Buffer.prototype.getOutdatedEntry = function() {
        var oldestIndex = (this.index - this.size) % this.size;
        if(oldestIndex < 0) {
            oldestIndex = 0;
        }
        return this.list[oldestIndex];
    }

    return Buffer;
});