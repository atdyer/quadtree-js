
// Requires
Vector2 = require( '../vector2' );
Point = require( './point' );

// Triangle constructor
function Triangle ( p1, p2, p3 ) {

    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;

}

// Triangle prototype
Triangle.prototype = {

    constructor: Triangle,

    is_inside: function ( quadtree ) {

        return  this.p1.is_inside( quadtree ) ||
                this.p2.is_inside( quadtree ) ||
                this.p3.is_inside( quadtree );

    }

};

module.exports = Triangle;