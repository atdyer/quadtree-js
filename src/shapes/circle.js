
// Requires
Vector2 = require( '../vector2' );

// Circle constructor
function Circle ( center_point, radius ) {

    this.center_point = ( center_point !== undefined ) ? center_point : new Vector2( 0, 0 );
    this.radius = ( radius !== undefined ) ? radius : 1;
    this.edge_point = this.center_point.clone().setX( this.center_point.x + this.radius );

    this._rsq = this.radius * this.radius;

}

// Circle prototype
Circle.prototype = {

    constructor: Circle,

    contains: function ( point ) {

        return this.center_point.distanceToSquared( point ) <= this._rsq;

    },

    intersects: function ( x1, y1, x2, y2 ) {

        var p1 = new Vector2( x1, y1 );
        var p2 = new Vector2( x2, y2 );
        var d1 = this.center_point.distanceToSquared( p1 );
        var d2 = this.center_point.distanceToSquared( p2 );
        var p1inside = d1 <= this._rsq;
        var p2inside = d2 <= this._rsq;
        if ( p1inside && p2inside ) {
            return false;
        }
        else if ( p1inside != p2inside ) {
            return true;
        }

        var xdiff = p2.x - p1.x;
        var ydiff = p2.y - p1.y;
        var dsq = xdiff * xdiff + ydiff * ydiff;
        var u = ( xdiff * ( this.center_point.x - p1.x ) +
                  ydiff * ( this.center_point.y - p1.y ) ) / dsq;

        if ( u >= 0 && u <= 1 ) {

            var closestx = p1.x + u * xdiff;
            var closesty = p1.y + u * ydiff;
            return this.center_point.distanceToSquared( new Vector2( closestx, closesty ) ) <= this._rsq;

        } else {

            return  this.center_point.distanceToSquared( p1 ) <= this._rsq ||
                    this.center_point.distanceToSquared( p2 ) <= this._rsq;

        }

    }

};

// Exports
module.exports = Circle;