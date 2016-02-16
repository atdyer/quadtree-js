

/**
 * The Shape function and prototype are here only as a reference
 * to describe the minimum requirements for a shape that can be
 * used to search a quadtree. There is no need to subclass Shape,
 * as long as all of the required functions are there.
 */


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
         *
         * Must return true or false.
         */

        return false;

    },

    intersects: function ( x1, y1, x2, y2 ) {

        /**
         * This function should test if a line segment intersects with the
         * shape's edge. The variables x1, y1 are the x, y coordinates
         * of one end of the line segment and x2, y2 are the coordinates
         * of the other end.
         *
         * Must return true or false.
         */

        return false;

    }

};


/**
 * Create exports
 */
Shapes = {

    Circle: require( './shapes/circle' )

};

module.exports = Shapes;