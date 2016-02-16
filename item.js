
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

Items = {

    Point: require( './items/point' )

};

module.exports = Items;