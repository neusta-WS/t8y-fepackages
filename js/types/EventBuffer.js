define(['./Buffer', './Point', '../utils/math'], function(Buffer, Point, math) {
    var EventBuffer = function(size){
        this.size = size;
        this.distance = new Point();
        this.pagePoint = new Point();
        this.entryPoint = new Point();
        this.direction = new Point();
    }

    EventBuffer.prototype = new Buffer();
    EventBuffer.prototype.constructor = EventBuffer;

    EventBuffer.prototype.add = function(event) {
        if(!event.timeStamp) {
            event.timeStamp = new Date().getTime();
        }
        this.pagePoint.setX(event.pageX).setY(event.pageY);
        Buffer.prototype.add.apply(this, [event])
    }

    EventBuffer.prototype.getDistance = function() {
        var newest = this.getLatestEntry();
        var oldest = this.getOutdatedEntry();

        this.distance.x = newest.pageX - oldest.pageX;
        this.distance.y = newest.pageY - oldest.pageY;
        return this.distance.length();
    }

    EventBuffer.prototype.getDuration = function() {
        var newest = this.getLatestEntry();
        var oldest = this.getOutdatedEntry();

        return newest.timeStamp - oldest.timeStamp;
    }

    EventBuffer.prototype.getDirection = function() {
        var latest = this.getLatestEntry();
        var outdated = this.getOutdatedEntry();

        this.direction.setX(-math.getDirection(latest.pageX - outdated.pageX));
        this.direction.setY(-math.getDirection(latest.pageY - outdated.pageY));
        return this.direction;
    }

    EventBuffer.prototype.forecastPosition = function(expectedDuration) {
        var newest = this.getLatestEntry();
        this.pagePoint.setX(newest.pageX).setY(newest.pageY);
        return this.pagePoint.forecastPositionLocal(expectedDuration, this.getDuration(), this.getDistance());
    }

    EventBuffer.prototype.forecastDuration = function(position, expectedPosition) {
        return position.forecastDuration(expectedPosition, this.getDuration(), this.getDistance());
    }

    return EventBuffer;
});