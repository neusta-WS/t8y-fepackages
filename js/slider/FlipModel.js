define(['t8y/types/DomModel'], function(DomModel) {
    return DomModel.extend( {
        VIEWALIGNMENT: {
            HORIZONTAL: 0,
            VERTICAL: 1
        },

        STATUS: {
            DEFAULT: 0,
            DRAG: 1,
            MOVE: 2,
            DROP: 3,
            ANIMATE: 4,
            LOADING: 5
        },

        defaults: function() {
            return {
                forceMouseSwipe: false,
                slideByFrame: false,

                viewAlignment: this.VIEWALIGNMENT.HORIZONTAL,
                viewCentered: false,
                viewMax: 0,
                view: 0,

                goToDirection: 0,
                goToView: -1,

                scrollDuration: 0,
                scrollDurationDefault: 500,
                scrollDurationMax: 2500,
                scrollDurationMin: 350,
                scrollToDirection: 0,
                scrollToView: -1,

                addToPosition: 0,
                status: 0
            }
        },

        hasVerticalAlignment: function() {
            return this.get('viewAlignment') == this.VIEWALIGNMENT.VERTICAL;
        },

        hasHorizontalAlignment: function() {
            return this.get('viewAlignment') == this.VIEWALIGNMENT.HORIZONTAL;
        },

        validateDirection: function(direction) {
            return this.validateView( this.get('view') + direction );
        },

        validateView: function(view) {
//            console.log(view, this.get('viewMax'));
            if(view < 0 || this.get('viewMax') <= 0) {
                return 0;
            } else if(view > this.get('viewMax') -1) {
                return this.get('viewMax')-1;
            }

            else {
                return view;
            }
        }
    } );
});