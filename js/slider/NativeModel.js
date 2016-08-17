define(['t8y/types/DomModel'], function(DomModel) {
    return DomModel.extend( {
        VIEWALIGNMENT: {
            HORIZONTAL: 0,
            VERTICAL: 1
        },

        defaults: function() {
            return {
                viewAlignment: this.VIEWALIGNMENT.HORIZONTAL,
                scrollBy: 0
            }
        },

        hasVerticalAlignment: function() {
            return this.get('viewAlignment') == this.VIEWALIGNMENT.VERTICAL;
        },

        hasHorizontalAlignment: function() {
            return this.get('viewAlignment') == this.VIEWALIGNMENT.HORIZONTAL;
        }
    } );
});