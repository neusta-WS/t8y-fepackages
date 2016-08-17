define(['./NumberBuffer'], function(NumberBuffer) {

    var AngleBuffer = function(size){
        this.size = size;
        this.reset();
    }

    AngleBuffer.prototype.reset = function(){
        this.x = new NumberBuffer(this.size);
        this.y = new NumberBuffer(this.size);
    }

    AngleBuffer.prototype.add = function(value){
        this.x.add(Math.sin(value));
        this.y.add(Math.cos(value));
        return this;
    }

    AngleBuffer.prototype.addDegree = function(value) {
        this.add(value / 360 * Math.PI * 2);
    }

    AngleBuffer.prototype.get = function() {
        var rx = this.x.get();
        var ry = this.y.get();

        return Math.atan2(rx, ry);
    }

    AngleBuffer.prototype.getDegree = function() {
        return this.get() / (Math.PI * 2) * 360;
    }

    return AngleBuffer;
});