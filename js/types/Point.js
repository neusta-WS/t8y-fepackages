define(['../utils/math'], function(math) {
    var defaultValue = 0;

    var Point = function(x, y){
        this.reset(x, y);
    }

    Point.prototype.setX = function(value){
        this.x = value || defaultValue;
        return this;
    }

    Point.prototype.setY = function(value){
        this.y = value || defaultValue;
        return this;
    }

    Point.prototype.length = function(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    Point.prototype.reset = function(x, y){
        var result = this;
        return validateValues(arguments, function(x, y) {
            return result.setX(x).setY(y);
        });
    }

    Point.prototype.add = function(point){
        return add(this, arguments, new Point());
    }

    Point.prototype.addLocal = function(point){
        return add(this, arguments, this);
    }

    function add(left, right, result) {
        return validateValues(right, function(x, y) {
            return result.setX(left.x + x).setY(left.y + y);
        });
    }

    Point.prototype.subtract = function(point){
        return subtract(this, arguments, new Point());
    }

    Point.prototype.subtractLocal = function(point){
        return subtract(this, arguments, this);
    }

    function subtract(left, right, result) {
        return validateValues(right, function(x, y) {
            return result.setX(left.x - x).setY(left.y - y);
        });
    }

    Point.prototype.multiply = function(point){
        return multiply(this, arguments, new Point());
    }

    Point.prototype.multiplyLocal = function(point){
        return multiply(this, arguments, this);
    }

    function multiply(left, right, result){
        return validateValues(right, function(x, y) {
            return result.setX(left.x * x).setY(left.y * y);
        });
    }

    Point.prototype.divide = function(point){
        return divide(this, arguments, new Point());
    }

    Point.prototype.divideLocal = function(point){
        return divide(this, arguments, this);
    }

    function divide(left, right, result){
        return validateValues(right, function(x, y) {
            return result.setX(left.x / x).setY(left.y / y);
        });
    }

    Point.prototype.normalize = function(size) {
        return normalize(this, size, new Point());
    }

    Point.prototype.normalizeLocal = function(size) {
        return normalize(this, size, this);
    }

    function normalize(left, right, result) {
        return result.setX(left.x).setY(left.y).divideLocal(right.width, right.height);
    }

    Point.prototype.equal = function(point) {
        var result = this;
        return validateValues(arguments, function(x, y) {
            return result.x != x || result.y != y;
        });
    }

    Point.prototype.forecastPosition = function(duration, refTime, refDistance) {
        return forecastPosition(this, duration, refTime, refDistance, new Point());
    }

    Point.prototype.forecastPositionLocal = function(duration, refTime, refDistance) {
        return forecastPosition(this, duration, refTime, refDistance, this);
    }

    function forecastPosition(left, duration, refTime, refDistance, result) {
        if(refDistance == 0) {
            return result.setX(left.x).setY(left.y);
        } else {
            var pxPerMillisec = math.calcPixelPerMillisecond(refTime, refDistance);
            return result.setX(left.x + pxPerMillisec * duration).setY(left.y + pxPerMillisec * duration);
        }
    }

    Point.prototype.forecastDurationX = function(to, refTime, refDistance) {
        return forecastDuration(this.x, to.x, refTime, refDistance);
    }

    Point.prototype.forecastDurationY = function(to, refTime, refDistance) {
        return forecastDuration(this.y, to.y, refTime, refDistance);
    }

    Point.prototype.forecastDuration = function(to, refTime, refDistance) {
        return forecastDuration(this.length(), to.length(), refTime, refDistance);
    }

    function forecastDuration(from, to, refTime, refDistance) {
        return math.calcExpectedDuration(from, to, refTime, refDistance);
    }

    Point.prototype.clamp = function(maxX, maxY) {
        return this.setX(math.clamp(this.x, 0, maxX)).setY(math.clamp(this.y, 0, maxY));
    }

    function validateValues(args, func) {
        if(args[0] !== undefined) {
            if(args[0].constructor === Point) {
                return func(args[0].x, args[0].y);
            } else if(!args[1] && args[1] !== 0) {
                return func(args[0], args[0]);
            } else {
                return func(args[0], args[1]);
            }
        } else {
            return func(defaultValue, defaultValue);
        }
    }

    return Point;
});