
// Requires
Vector2 = require( '../Vector2' );

// Point constructor
function Point ( x, y ) {

    Vector2.call( this, x, y );

}

// Points are just Vector2 objects with an extra is_inside
// function in order to work with quadtrees
Point.prototype = Object.create( Vector2.prototype );
Point.prototype.constructor = Point;
Point.prototype.is_inside = function ( quadtree ) {

    return  this.x >= quadtree.min.x &&
            this.x <  quadtree.max.x &&
            this.y >= quadtree.min.y &&
            this.y <  quadtree.max.y;

};

module.exports = Point;