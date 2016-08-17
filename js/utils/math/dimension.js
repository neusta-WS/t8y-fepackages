define([], function () {

    return {
        getPixelToPercent: function(val1, val2) {
            return 100 / (val1 / val2);
        },
        getPixelToPercentSize: function(outerNode, innerNode) {
            return {
                x: this.getPixelToPercentWidth(outerNode, innerNode),
                y: this.getPixelToPercentHeight(outerNode, innerNode)
            }
        },
        getPixelToPercentHeight: function(outerNode, innerNode) {
            return 100 / this.getNumberOfNodesFitInsideVertical(outerNode, innerNode);
        },
        getPixelToPercentWidth: function(outerNode, innerNode) {
            return 100 / this.getNumberOfNodesFitInsideHorizontal(outerNode, innerNode);
        },
        getNumberOfNodesFitInsideVertical: function(outerNode, innerNode) {
            var sizeFactor = getSizeFactor(outerNode, innerNode, 'outerHeight');
            return correctSizeFactor(sizeFactor);
        },
        getNumberOfNodesFitInsideHorizontal: function(outerNode, innerNode) {
            var sizeFactor = getSizeFactor(outerNode, innerNode, 'outerWidth');
            return correctSizeFactor(sizeFactor);
        }
    }

    function getSizeFactor(outerNode, innerNode, property) {
        var diff = Math.abs(outerNode[property]() - innerNode[property]());

        if(diff > 0 && diff <= 1) {
            return 1;
        } else {
            return outerNode[property]() / innerNode[property]();
        }
    }

    function correctSizeFactor(sizeFactor) {
//        console.log('sizeFactor', sizeFactor);
        if(Math.abs(sizeFactor - Math.round(sizeFactor)) < 0.1) {
            sizeFactor = Math.round(sizeFactor);
        }
//        console.log('sizeFactor', sizeFactor);
        return sizeFactor;
    }
});