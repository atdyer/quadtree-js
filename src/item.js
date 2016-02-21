

/**
 * The Item function and prototype are here only as a reference
 * to describe the minimum requirements for an item that can be
 * placed into a quadtree. There is no need to subclass Item, as
 * long as all of the required functions are there.
 */


function Item () {

    /**
     * An item variable has no required properties.
     */

}

Item.prototype = {

    constructor: Item,

    is_inside: function ( quadtree ) {

        /**
         * This function should test if the item falls into the quadtree.
         * A quadtree will always have quadtree.min and quadtree.max, which
         * are two Vector2 objects representing the southwest and northeast
         * corners of the bounding box.
         */
        return false;

    }

};


/**
 * Create exports
 */
Items = {

    Point: require( './items/point' ),
    Triangle: require( './items/triangle' )

};

module.exports = Items;