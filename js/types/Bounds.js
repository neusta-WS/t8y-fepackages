define(['underscore', '../utils/math', './Point', './Size'], function(_, math, Point, Size) {
    var defaultValue = Point;
    var intersectionInfo = new Point();
    var result = [];
    /*
     * Bounds Object
     * Contains the min and max Coordinates of an Object
     *
     * Instance Example:
     * new Bounds(min<Point>, max<Point>);
     * new Bounds(minX<Number>, minY<Number>, maxX<Number>, maxY<Number>);
     * new Bounds(min<Point>, size<Size>);
     *
     * Functions:
     * <Self> setMin(<Point>)
     * <Self> setMax(<Point>)
     * <Self> setSize(<Size>)
     */

    var Bounds = function(min, max){
        this.min = new Point();
        this.max = new Point();
        this.size = new Size();
        this.reset(arguments);

    }

    Bounds.prototype.setMin = function(value){
        var result = this.min;
        validateValue(value, function(values) {
            result.setX(values[0]).setY(values[1]);
        });
        this.size.setWidth(this.max.x - this.min.x).setHeight(this.max.y - this.min.y);
        return this;
    }

    Bounds.prototype.setMax = function(value){
        var result = this.max;
        validateValue(value, function(values) {
            result.setX(values[0]).setY(values[1]);
        });
        this.size.setWidth(this.max.x - this.min.x).setHeight(this.max.y - this.min.y);
        return this;
    }

    Bounds.prototype.setSize = function(size){
        var result = this.size;
        validateValue(value, function(values) {
            result.setWidth(values[0]).setHeight(values[1]);
        });
        this.max.setX(this.min.x + this.size.width).setY(this.min.y + this.size.height);
        return this;
    }

    Bounds.prototype.getCenter = function(){
        return new Point((this.max.x + this.min.x) / 2, (this.max.y + this.min.y) / 2);
    }

    Bounds.prototype.getSize = function() {
        return this.size;
    }

    Bounds.prototype.getIntersectionInfo = function(bounds) {
        var x = (bounds.max.x - this.min.x) - (this.max.x - bounds.min.x);
        var y = (bounds.max.y - this.min.y) - (this.max.y - bounds.min.y);
        return intersectionInfo.setX(x).setY(y);
    }

    Bounds.prototype.reset = function(min, max){
        var result = this;
        return validateValues(arguments, function(minX, minY, maxX, maxY) {
            result.min.setX(minX).setY(minY);
            result.max.setX(maxX).setY(maxY);
            return result;
        });
    }

    Bounds.prototype.contains = function(arg) {
        if(arg.constructor === Point) {
            return arg.x >= this.min.x
                && arg.y >= this.min.y
                && arg.x <= this.max.x
                && arg.y <= this.max.y;
        } else if(arg.constructor === Bounds) {
            return arg.min.x >= this.min.x
                && arg.min.y >= this.min.y
                && arg.max.x <= this.max.x
                && arg.max.y <= this.max.y;
        }
        return;
    }

    Bounds.prototype.intersects = function(bounds) {
        return bounds.max.x > this.min.x
            && bounds.max.y > this.min.y
            && bounds.min.x < this.max.x
            && bounds.min.y < this.max.y;
    }

    function validateValues(args, func) {
        clearArray(result);

        _.each(args, function(arg, index) {
            if(arg) {
                validateValue(arg);
            }
        });
        return func(result[0], result[1], result[2], result[3]);
    }

    function validateValue(arg, callback) {
        if(callback) {
            clearArray(result);
        }

        if(!!arg.x || arg.x == 0) {
            // Wenn <Point>
            result.push(arg.x);
            result.push(arg.y);
        } else if(!!arg.width || arg.width == 0) {
            // Wenn <Size>
            result.push(result[result.length - 2] + arg.width);
            result.push(result[result.length - 2] + arg.height);
        } else {
            result.push(arg);
        }

        if(callback) {
            callback(result)
        } else {
            return result;
        }
    }

    function clearArray() {
        while(result.length > 0) {
            result.pop();
        }
    }

    return Bounds;
});