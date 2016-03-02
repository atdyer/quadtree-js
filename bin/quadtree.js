(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Quadtree = require( '../../src/quadtree' );
},{"../../src/quadtree":5}],2:[function(require,module,exports){


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
},{"./items/point":3,"./items/triangle":4}],3:[function(require,module,exports){

// Requires
Vector2 = require( '../vector2' );

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
},{"../vector2":9}],4:[function(require,module,exports){

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
},{"../vector2":9,"./point":3}],5:[function(require,module,exports){

Vector2 = require( './vector2' );

function Quadtree ( min, max, bin_size, parent ) {

    // this.min is the southwest corner of the bounding box
    this.min = ( min !== undefined ) ? min : new Vector2( -1, -1 );

    // this.max is the northeast corner of the bounding box
    this.max = ( max !== undefined ) ? max : new Vector2( 1, 1 );

    // this.bin_size is the max number of items that a leaf can hold
    this.bin_size = ( bin_size !== undefined ) ? bin_size : 500;

    // Use the northeast corner of the bounding box as an arbitrary
    // point that falls on the bounding box
    this.edge_point = this.max.clone();

    // Children will either be a list of Quadtrees or undefined.
    this._children = undefined;

    // Parent will be undefined if this is the top of the quadtree
    this._parent = parent;
    this._depth = ( this._parent !== undefined ) ? this._parent._depth + 1 : 0;

    // Items will be a list of items. Will be unpopulated if
    // this.children is not undefined.
    this._items = [];

}


Quadtree.prototype = {

    constructor: Quadtree,

    get items () {

        if ( !!this._children ) {

            return this._items.slice( 0 ).concat(
                this._children[0].items,
                this._children[1].items,
                this._children[2].items,
                this._children[3].items
            );

        }

        return this._items.slice( 0 );

    },

    add_item: function ( item ) {

        // Is this a branch?
        if ( !!this._children ) {

            // Yes, so find which child it falls into
            for ( var i=0; i<4; ++i ) {

                // Check if the item falls into this child
                if ( item.is_inside( this._children[i] ) ) {

                    // It does, so add it and exit
                    this._children[i].add_item( item );
                    return;

                }

            }

        } else {

            // No, so either add the item or split into a branch
            if ( this._items.length >= this.bin_size && item.is_inside( this ) ) {

                this.branch();
                this.add_item( item );

            } else {

                this._items.push( item );

            }

        }

    },

    branch: function () {

        // Find the centerpoint
        var center = new Vector2(
            ( this.min.x + this.max.x ) / 2.0,
            ( this.min.y + this.max.y ) / 2.0
        );

        // Create children
        var ll = new Quadtree( this.min, center, this.bin_size, this );
        var ur = new Quadtree( center, this.max, this.bin_size, this );
        var lr = new Quadtree( this.min.clone().setX( center.x ), this.max.clone().setY( center.y ), this.bin_size, this );
        var ul = new Quadtree( this.min.clone().setY( center.y ), this.max.clone().setX( center.x ), this.bin_size, this );
        this._children = [ ll, lr, ul, ur ];

        // Move items to children
        var _item;
        while ( _item = this._items.pop() ) {

            this.add_item( _item );

        }

    },

    contains: function ( point ) {

        return  point.x >= this.min.x && point.y >= this.min.y &&
                point.x <  this.max.x && point.y <  this.max.y;

    },

    find_items: function ( shape ) {

        var _search_result = {
            _early_exit: false,
            _items: []
        };

        // Check for an edge intersection
        if ( this.intersects( shape ) ) {

            // Check if this is a branch
            if ( !!this._children ) {

                // It is so recurse through children
                for ( var i=0; i<4; ++i ) {

                    // Get the search results from each child
                    var _child_items = this._children[i].find_items( shape );

                    // Append results to the list
                    Array.prototype.push.apply( _search_result._items, _child_items._items );

                }

            } else {

                // It isn't so look through the items contained in
                // this leaf
                for ( var i=0; i<this._items.length; ++i ) {

                    // The shape will tell us if it contains the item
                    if ( shape.contains( this._items[i] ) ) {

                        _search_result._items.push( this._items[i] );

                    }

                }

            }

            // Return without early exit
            return this._parent ? _search_result : _search_result._items;

        } else {

            // There's no edge intersection, so if the shape's edge point
            // falls inside of this quadtree, we're done with the search
            // after performing recursion below this level.
            if ( this.contains( shape.edge_point ) ) {

                // Check if this is a branch
                if ( !!this._children ) {

                    // It is so recurse through the children
                    for ( var i=0; i<4; ++i ) {

                        // Get the search results from each child
                        var _child_items = this._children[i].find_items( shape );

                        // Append results to the list
                        Array.prototype.push.apply( _search_result._items, _child_items._items );

                        // Check for early exit
                        if ( _child_items._early_exit ) {

                            _search_result._early_exit = true;
                            return this._parent ? _search_result : _search_result._items;

                        }

                    }

                } else {

                    // It isn't so look through the items contained in
                    // this leaf
                    for ( var i=0; i<this._items.length; ++i ) {

                        // The shape will tell us if it contains the item
                        if ( shape.contains( this._items[i] ) ) {

                            _search_result._items.push( this._items[i] );

                        }

                    }

                }

                // Early exit
                _search_result._early_exit = true;
                return this._parent ? _search_result : _search_result._items;

            }


            // There is no edge intersection, so if the shape contains
            // a point that falls on the edge of this quadtree, all items
            // contained by this quadtree must fall inside of the shape.
            if ( shape.contains( this.edge_point ) ) {

                Array.prototype.push.apply( _search_result._items, this.items );

            }

            return this._parent ? _search_result : _search_result._items;

        }

    },

    intersects: function ( shape ) {

        return  shape.intersects( this.min.x, this.min.y, this.max.x, this.min.y ) ||
                shape.intersects( this.max.x, this.min.y, this.max.x, this.max.y ) ||
                shape.intersects( this.min.x, this.min.y, this.min.x, this.max.y ) ||
                shape.intersects( this.min.x, this.max.y, this.max.x, this.max.y );

    }

};

module.exports = {

    Quadtree: Quadtree,
    Shapes: require( './shape' ),
    Items: require( './item' ),
    Vector2: require( './vector2' )

};
},{"./item":2,"./shape":6,"./vector2":9}],6:[function(require,module,exports){


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

    contains: function ( item ) {

        /**
         * This function should test if an item falls into the shape.
         * At the very minimum, the Vector2 type must be supported, and
         * additional item types must be tested for in order for a shape
         * to support searching for that type of item.
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

    Circle: require( './shapes/circle' ),
    Rectangle: require( './shapes/rectangle' )

};

module.exports = Shapes;
},{"./shapes/circle":7,"./shapes/rectangle":8}],7:[function(require,module,exports){

// Requires
Vector2 = require( '../vector2' );
Items = require( '../item' );

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

    contains: function ( item ) {

        // Check for item type
        if ( item instanceof Vector2 || item instanceof Items.Point ) return this._contains_point( item );
        if ( item instanceof Items.Triangle ) return this._contains_triangle( item );

        // Unsupported item type, throw error
        throw new Error( 'Unsupported item type for Circle search' );

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

    },

    _contains_point: function ( point ) {

        return this.center_point.distanceToSquared( point ) <= this._rsq;

    },

    _contains_triangle: function ( triangle ) {

        return  this._contains_point( triangle.p1 ) ||
                this._contains_point( triangle.p2 ) ||
                this._contains_point( triangle.p3 );

    }

};

// Exports
module.exports = Circle;
},{"../item":2,"../vector2":9}],8:[function(require,module,exports){

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
},{"../item":2,"../vector2":9}],9:[function(require,module,exports){

/**
 * A somewhat slimmed down version of Vector2 from the
 * THREE.js library. I took out a few functions that other
 * THREE.js dependencies and left ones that I thought might
 * be useful in the future. Original authors are:
 *
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

function Vector2 ( x, y ) {

    this.x = x || 0;
    this.y = y || 0;

}

Vector2.prototype = {

    constructor: Vector2,

    get width() {

        return this.x;

    },

    set width( value ) {

        this.x = value;

    },

    get height() {

        return this.y;

    },

    set height( value ) {

        this.y = value;

    },

    //

    set: function ( x, y ) {

        this.x = x;
        this.y = y;

        return this;

    },

    setScalar: function ( scalar ) {

        this.x = scalar;
        this.y = scalar;

        return this;

    },

    setX: function ( x ) {

        this.x = x;

        return this;

    },

    setY: function ( y ) {

        this.y = y;

        return this;

    },

    clone: function () {

        return new this.constructor( this.x, this.y );

    },

    copy: function ( v ) {

        this.x = v.x;
        this.y = v.y;

        return this;

    },

    add: function ( v ) {

        this.x += v.x;
        this.y += v.y;

        return this;

    },

    addScalar: function ( s ) {

        this.x += s;
        this.y += s;

        return this;

    },

    addVectors: function ( a, b ) {

        this.x = a.x + b.x;
        this.y = a.y + b.y;

        return this;

    },

    addScaledVector: function ( v, s ) {

        this.x += v.x * s;
        this.y += v.y * s;

        return this;

    },

    sub: function ( v ) {

        this.x -= v.x;
        this.y -= v.y;

        return this;

    },

    subScalar: function ( s ) {

        this.x -= s;
        this.y -= s;

        return this;

    },

    subVectors: function ( a, b ) {

        this.x = a.x - b.x;
        this.y = a.y - b.y;

        return this;

    },

    multiply: function ( v ) {

        this.x *= v.x;
        this.y *= v.y;

        return this;

    },

    multiplyScalar: function ( scalar ) {

        if ( isFinite( scalar ) ) {

            this.x *= scalar;
            this.y *= scalar;

        } else {

            this.x = 0;
            this.y = 0;

        }

        return this;

    },

    divide: function ( v ) {

        this.x /= v.x;
        this.y /= v.y;

        return this;

    },

    divideScalar: function ( scalar ) {

        return this.multiplyScalar( 1 / scalar );

    },

    min: function ( v ) {

        this.x = Math.min( this.x, v.x );
        this.y = Math.min( this.y, v.y );

        return this;

    },

    max: function ( v ) {

        this.x = Math.max( this.x, v.x );
        this.y = Math.max( this.y, v.y );

        return this;

    },

    floor: function () {

        this.x = Math.floor( this.x );
        this.y = Math.floor( this.y );

        return this;

    },

    ceil: function () {

        this.x = Math.ceil( this.x );
        this.y = Math.ceil( this.y );

        return this;

    },

    negate: function () {

        this.x = - this.x;
        this.y = - this.y;

        return this;

    },

    dot: function ( v ) {

        return this.x * v.x + this.y * v.y;

    },

    lengthSq: function () {

        return this.x * this.x + this.y * this.y;

    },

    length: function () {

        return Math.sqrt( this.x * this.x + this.y * this.y );

    },

    normalize: function () {

        return this.divideScalar( this.length() );

    },

    distanceTo: function ( v ) {

        return Math.sqrt( this.distanceToSquared( v ) );

    },

    distanceToSquared: function ( v ) {

        var dx = this.x - v.x, dy = this.y - v.y;
        return dx * dx + dy * dy;

    },

    setLength: function ( length ) {

        return this.multiplyScalar( length / this.length() );

    },

    equals: function ( v ) {

        return ( ( v.x === this.x ) && ( v.y === this.y ) );

    },

    fromArray: function ( array, offset ) {

        if ( offset === undefined ) offset = 0;

        this.x = array[ offset ];
        this.y = array[ offset + 1 ];

        return this;

    },

    toArray: function ( array, offset ) {

        if ( array === undefined ) array = [];
        if ( offset === undefined ) offset = 0;

        array[ offset ] = this.x;
        array[ offset + 1 ] = this.y;

        return array;

    }

};

module.exports = Vector2;
},{}]},{},[1]);
