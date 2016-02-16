
// Import quadtree
var Vector2 = require( './Vector2' );
var q = require( './quadtree' );

// Create a quadtree
var min = new Vector2( 0, 0 );
var max = new Vector2( 100, 100 );
var testtree = new q.Quadtree( min, max, 100 );

// Add a bunch of points
for ( var y=0; y<100; ++y ) {
    for ( var x=0; x<100; ++x ) {

        testtree.add_item( new q.Items.Point( x, y ) );

    }
}

// Create a circle in the middle
var circle = new q.Shapes.Circle( new Vector2( 50, 50 ), 10 );

// Perform the search
var results = testtree.find_items( circle );

console.log( results );