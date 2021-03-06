
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
    this.edge_point = this.min.clone();

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