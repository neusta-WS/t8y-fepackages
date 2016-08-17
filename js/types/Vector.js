define([], function() {
    var defaultValue = 0;

    var Vector = function(x, y, z) {
        this.reset(x, y, z);
    }

    Vector.prototype.setX = function(value) {
        this.x = value || defaultValue;
        return this;
    }

    Vector.prototype.setY = function(value) {
        this.y = value || defaultValue;
        return this;
    }

    Vector.prototype.setZ = function(value) {
        this.z = value || defaultValue;
        return this;
    }

    Vector.prototype.length = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    Vector.prototype.reset = function(x, y, z) {
        return this.setX(x).setY(y).setZ(z);
    }

    Vector.prototype.add = function(vector){
        return add(this, arguments, new Vector());
    }

    Vector.prototype.addLocal = function(vector){
        return add(this, arguments, this);
    }

    function add(left, right, result) {
        return validateValues(right, function(x, y, z) {
            return result.setX(left.x + x).setY(left.y + y).setZ(left.z + z);
        });
    }

    Vector.prototype.subtract = function(vector){
        return subtract(this, arguments, new Vector());
    }

    Vector.prototype.subtractLocal = function(vector){
        return subtract(this, arguments, this);
    }

    function subtract(left, right, result) {
        return validateValues(right, function(x, y, z) {
            return result.setX(left.x - x).setY(left.y - y).setZ(left.z - z);
        });
    }

    Vector.prototype.multiply = function(vector){
        return multiply(this, arguments, new Vector());
    }

    Vector.prototype.multiplyLocal = function(vector){
        return multiply(this, arguments, this);
    }

    function multiply(left, right, result){
        return validateValues(right, function(x, y, z) {
            return result.setX(left.x * x).setY(left.y * y).setZ(left.z * z);
        });
    }

    Vector.prototype.divide = function(vector){
        return divide(this, arguments, new Vector());
    }

    Vector.prototype.divideLocal = function(vector){
        return divide(this, arguments, this);
    }

    function divide(left, right, result){
        return validateValues(right, function(x, y, z) {
            return result.setX(left.x / x).setY(left.y / y).setZ(left.z / z);
        });
    }

    function validateValues(args, doFunc) {
        if(args[0] && args.length == 1) {
            if(args[0].constructor === Vector) {
                // Auswertung Vector Object
                doFunc(args[0].x, args[0].y, args[0].z);
            } else if(args[0].constructor === Number) {
                // Auswertung wenn Number Object
                doFunc(args[0], args[0], args[0]);
            }
        } else if(args.length > 1) {
            var values = getNumbersAsArguments(args);
            doFunc(values[0], values[1], values[2]);
        } else {
            doFunc(defaultValue, defaultValue, defaultValue);
        }
    }

    function getNumbersAsArguments(args) {
        var values = [defaultValue, defaultValue, defaultValue];
        for(var i = 0; i < values.length; i++) {
            if(args[i].constructor != Number) {
                values[i] = defaultValue;
            }
        }
        return values;
    }
})