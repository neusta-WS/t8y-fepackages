define([], function() {

    var NumberBuffer = function(size){
        this.size = size;
        this.reset();
    }

    NumberBuffer.prototype.reset = function(){
        this.list = [];
        this.index = 0;
        for( var i = 0; i < this.size; i ++ ) {
            this.list[i] = 0;
        }
    }

    NumberBuffer.prototype.add = function(value){
        this.list[this.index % this.size] = value;
        this.index++ ;
        return this;
    }

    NumberBuffer.prototype.get = function() {
        var res = 0;
        for( var i = 0; i < this.size; i ++ ) {
            res += this.list[i];
        }
        return res / this.size;
    }

    return NumberBuffer;
});