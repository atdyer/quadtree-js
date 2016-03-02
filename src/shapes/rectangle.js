
// Requires
Vector2 = require( '../vector2' );
Items = require( '../item' );

// Rectangle constructor
function Rectangle ( bottom_left, top_right ) {

    this.bottom_left = ( bottom_left !== undefined ) ? bottom_left : new Vector2( 0, 0 );
    this.top_right = ( top_right !== undefined ) ? top_right : new Vector2( 1, 1 );
    this.edge_point = this.bottom_left;

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

        // Note there is a bug here, if the given line completely overlaps and edge, will return false

        var p1 = new Vector2( x1, y1 );
        var p2 = new Vector2( x2, y2 );
        var top_left = new Vector2( this.bottom_left.x, this.top_right.y );
        var bottom_right = new Vector2( this.top_right.x, this.bottom_left.y );

        return  this._edges_intersect( p1, p2, this.bottom_left, top_left ) ||
                this._edges_intersect( p1, p2, top_left, this.top_right ) ||
                this._edges_intersect( p1, p2, this.top_right, bottom_right ) ||
                this._edges_intersect( p1, p2, bottom_right, this.bottom_left );

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

    },

    _edges_intersect: function( a, b, c, d ) {

        if ( this._is_ccw( a, c, d ) == this._is_ccw( b, c, d ) ) {
            return false;
        }

        return this._is_ccw( a, b, c ) != this._is_ccw( a, b, d );

    },

    _is_ccw: function ( a, b, c ) {

        return ( (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x) );
    }



};

// Exports
module.exports = Rectangle;