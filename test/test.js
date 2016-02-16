
// Import chai for testing
var expect = require( 'chai').expect;

// Import quadtree
var Vector2 = require( './../src/vector2' );
var q = require( './../src/quadtree' );


describe( 'Quadtree', function () {

    describe( 'Point unit spacing circle search', function () {

        it( 'Searches for points in the unit spacing grid', function () {

            // Create a quadtree
            var min = new Vector2( 0, 0 );
            var max = new Vector2( 1000, 1000 );
            var testtree = new q.Quadtree( min, max, 100 );

            // Add a bunch of points
            for ( var y=0; y<1000; ++y ) {
                for ( var x=0; x<1000; ++x ) {

                    testtree.add_item( new q.Items.Point( x, y ) );

                }
            }

            // Create a circle in the middle
            var circle = new q.Shapes.Circle( new Vector2( 500, 500 ), 100 );

            // Perform the search
            var results = testtree.find_items( circle );

            // Perform test
            expect( results.length ).to.equal( 3031 );

        });

    });

});
