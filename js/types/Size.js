define(['../utils/math'], function(math) {
    var defaultValue = 0;

    var Size = function(width, height){
        this.reset(width, height);
    }

    Size.prototype.setWidth = function(value){
        this.width = value || defaultValue;
        return this;
    }

    Size.prototype.setHeight = function(value){
        this.height = value || defaultValue;
        return this;
    }

    Size.prototype.reset = function(width, height){
        var result = this;
        return validateValues(arguments, function(width, height) {
            return result.setWidth(width).setHeight(height);
        });
    }

    Size.prototype.copy = function(){
        return new Size(this.width, this.height);
    }

    Size.prototype.copyLocal = function(Size){
        return this.setWidth(Size.width).setHeight(Size.height);
    }

    Size.prototype.add = function(Size){
        return add(this, arguments, new Size());
    }

    Size.prototype.addLocal = function(Size){
        return add(this, arguments, this);
    }

    function add(left, right, result) {
        return validateValues(right, function(width, height) {
            return result.setWidth(left.width + width).setHeight(left.height + height);
        });
    }

    Size.prototype.subtract = function(Size){
        return subtract(this, arguments, new Size());
    }

    Size.prototype.subtractLocal = function(Size){
        return subtract(this, arguments, this);
    }

    function subtract(left, right, result) {
        return validateValues(right, function(width, height) {
            return result.setWidth(left.width - width).setHeight(left.height - height);
        });
    }

    Size.prototype.multiply = function(Size){
        return multiply(this, arguments, new Size());
    }

    Size.prototype.multiplyLocal = function(Size){
        return multiply(this, arguments, this);
    }

    function multiply(left, right, result) {
        return validateValues(right, function(width, height) {
            return result.setWidth(left.width * width).setHeight(left.height * height);
        });
    }

    Size.prototype.divide = function(Size){
        return divide(this, arguments, new Size());
    }

    Size.prototype.divideLocal = function(Size){
        return divide(this, arguments, this);
    }

    function divide(left, right, result) {
        return validateValues(right, function(width, height) {
            return result.setWidth(left.width / width).setHeight(left.height / height);
        });
    }

    Size.prototype.equal = function(Size) {
        var result = this;
        return validateValues(arguments, function(width, height) {
            return result.width != width || result.height != height;
        });
    }

    Size.prototype.clamp = function(maxWidth, maxHeight) {
        return this.setWidth(math.clamp(this.width, 0, maxWidth)).setHeight(math.clamp(this.height, 0, maxHeight));
    }

    function validateValues(args, func) {
        if(args[0] !== undefined) {
            if(args[0].constructor === Size) {
                return func(args[0].width, args[0].height);
            } else if(!args[1]) {
                return func(args[0], args[0]);
            } else {
                return func(args[0], args[1]);
            }
        } else {
            return func(defaultValue, defaultValue);
        }
    }

    return Size;
});