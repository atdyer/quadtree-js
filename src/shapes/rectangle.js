
// Requires
Vector2 = require( '../vector2' );
Items = require( '../item' );

// Rectangle constructor
function Rectangle ( bottom_left, top_right ) {

    this.bottom_left = ( bottom_left !== undefined ) ? bottom_left : new Vector2( 0, 0 );
    this.top_right = ( top_right !== undefined ) ? top_right : new Vector2( 1, 1 );
    this.edge_point = this.top_right;

}

// Rectangle prototype
Rectangle.prototype = {

    constructor: Rectangle,

    contains: function ( item ) {

        // Check for item type
        if ( item instanceof Vector2 || item instanceof Items.Point ) return this._contains_point( item );
        if ( item instanceof Items.Triangle ) return this._contains_triangle( item );

        // Unsupported item type, throw error
        throw new Error( 'Unsupported item type for Rectangle search' );

    },

    intersects: function ( x1, y1, x2, y2 ) {

        var p1 = new Vector2( x1, y1 );
        var p2 = new Vector2( x2, y2 );
        return this.contains( p1 ) != this.contains( p2 );

    },

    _contains_point: function ( point ) {

        return  point.x >= this.bottom_left.x &&
                point.x <  this.top_right.x &&
                point.y >= this.bottom_left.y &&
                point.y <  this.top_right.y;

    },

    _contains_triangle: function ( triangle ) {

        return  this._contains_point( triangle.p1 ) ||
                this._contains_point( triangle.p2 ) ||
                this._contains_point( triangle.p3 );

    }

};

// Exports
module.exports = Rectangle;