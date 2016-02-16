
function Shape ( edge_point ) {

    /**
     * A shape must have a variable called edge_point of type Vector2 which
     * represents any single arbitrary point that falls on the shape's edge
     */
    this.edge_point = edge_point;

}

Shape.prototype = {

    constructor: Shape,

    contains: function ( point ) {

        /**
         * This function should test if a point falls into the shape.
         * The point variable will be a Vector2 object.
         */

        return false;

    },

    intersects: function ( x1, y1, x2, y2 ) {

        /**
         * This function should test if a line intersects with the
         * shape's edge. The p1 and p2 variables are the endpoints of
         * the line and are both Vector2 objects.
         */

        return false;

    }

};

Shapes = {

    Circle: require( './shapes/circle' )

};

module.exports = Shapes;