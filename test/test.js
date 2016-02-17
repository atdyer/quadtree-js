
// Import chai for testing
var expect = require( 'chai' ).expect;

// Import quadtree
var q = require( './../src/quadtree' );
var Vector2 = q.Vector2;

describe( 'Quadtree Class Functionality', function () {

    it( 'Retrieve all items from a quadtree', function () {

        // Create the quadtree
        var tree = new q.Quadtree( new Vector2( 0, 0 ), new Vector2( 2, 2 ), 1 );

        // Add eight points
        tree.add_item( new q.Items.Point( 0.25, 0.25 ) );
        tree.add_item( new q.Items.Point( 0.75, 0.75 ) );
        tree.add_item( new q.Items.Point( 1.25, 1.25 ) );
        tree.add_item( new q.Items.Point( 1.75, 1.75 ) );
        tree.add_item( new q.Items.Point( 0.25, 1.75 ) );
        tree.add_item( new q.Items.Point( 0.75, 1.25 ) );
        tree.add_item( new q.Items.Point( 1.25, 0.75 ) );
        tree.add_item( new q.Items.Point( 1.75, 0.25 ) );

        // Get the points back
        var points = tree.items;

        // Perform test
        expect( points.length ).to.equal( 8 );

    });

});

describe( 'Quadtree Structure', function () {

    // Function to test that only leaves can have data stored
    function leaf_branch_test ( tree ) {

        if ( !!tree._children ) {
            expect( tree._items.length ).to.equal( 0 );
            expect( tree._children.length ).to.equal( 4 );
            for ( var i=0; i<4; ++i ) {
                leaf_branch_test( tree._children[i] );
            }
        }
    }

    it( 'Quadtree with exactly four leaves', function () {

        // Create the quadtree
        var tree = new q.Quadtree( new Vector2( 0, 0 ), new Vector2( 1, 1 ), 1 );

        // Add four points
        tree.add_item( new q.Items.Point( 0.25, 0.25 ) );
        tree.add_item( new q.Items.Point( 0.75, 0.25 ) );
        tree.add_item( new q.Items.Point( 0.25, 0.75 ) );
        tree.add_item( new q.Items.Point( 0.75, 0.75 ) );

        // Test the tree structure
        expect( tree._children.length ).to.equal( 4 );
        for ( var i=0; i<4; ++i ) {
            expect( tree._children[i]._items.length ).to.equal( 1 );
        }

        // Peform leaf/branch test
        leaf_branch_test( tree );

    });

    it( '1,000,000 point dataset with unit spacing', function () {

        // Create the quadtree
        var min = new Vector2( 0, 0 );
        var max = new Vector2( 10, 10 );
        var tree = new q.Quadtree( min, max, 1 );

        // Add the points
        for ( var y=0; y<10; ++y ) {
            for ( var x=0; x<10; ++x ) {

                tree.add_item( new q.Items.Point( x+0.5, y+0.5 ) );

            }
        }

        // Perform leaf/branch test
        leaf_branch_test( tree );

    });

    it( '10,000,000 point dataset with unit spacing', function () {

        // This one will take a little longer
        this.timeout( 5000 );

        // Create the quadtree
        var min = new Vector2( 0, 0 );
        var max = new Vector2( 1000, 10000 );
        var tree = new q.Quadtree( min, max, 5000 );

        // Add the points
        for ( var y=0; y<10000; ++y ) {
            for ( var x=0; x<1000; ++x ) {

                tree.add_item( new q.Items.Point( x+0.5, y+0.5 ) );

            }
        }

        // Perform leaf/branch test
        leaf_branch_test( tree );

    });

});


describe( 'Quadtree Search Accuracy', function () {

    describe( 'Dataset: 100 points with unit spacing', function () {

        // Create the quadtree
        var min = new Vector2( 0, 0 );
        var max = new Vector2( 10, 10 );
        var tree = new q.Quadtree( min, max, 5 );

        // Add the points
        for ( var y=0; y<10; ++y ) {
            for ( var x=0; x<10; ++x ) {

                tree.add_item( new q.Items.Point( x+0.5, y+0.5 ) );

            }
        }

        it( 'Circle Search', function () {

            // Create a few different circles
            var circle1 = new q.Shapes.Circle( new Vector2( 5.5, 5.5 ), 0.1 );
            var circle2 = new q.Shapes.Circle( new Vector2( 5.5, 5.5 ), 2.0 );

            // Perform the searches
            var results1 = tree.find_items( circle1 );
            var results2 = tree.find_items( circle2 );

            // Perform tests
            expect( results1.length ).to.equal( 1 );
            expect( results2.length ).to.equal( 13 );

        });

        it( 'Rectangle Search', function () {

            // Create a rectangle in the middle
            var rectangle1 = new q.Shapes.Rectangle( new Vector2( 5, 5 ), new Vector2( 6, 6 ) );
            var rectangle2 = new q.Shapes.Rectangle( new Vector2( 4, 4 ), new Vector2( 7, 7 ) );

            // Perform the search
            var results1 = tree.find_items( rectangle1 );
            var results2 = tree.find_items( rectangle2 );

            // Perform test
            expect( results1.length ).to.equal( 1 );
            expect( results2.length ).to.equal( 9 );

        });

    });

});

describe( 'Quadtree Performance', function () {

    describe( 'Dataset: 1,000,000 points with unit spacing', function () {

        var tree;

        it( 'Build quadtree and dataset', function () {

            // Create the quadtree
            var min = new Vector2( 0, 0 );
            var max = new Vector2( 1000, 1000 );
            tree = new q.Quadtree( min, max, 250 );

            // Add the points
            for ( var y=0; y<1000; ++y ) {
                for ( var x=0; x<1000; ++x ) {

                    tree.add_item( new q.Items.Point( x+0.5, y+0.5 ) );

                }
            }

        });

        it( '2 Circle Searches', function () {

            // Create a few different circles
            var circle1 = new q.Shapes.Circle( new Vector2( 100.5, 100.5 ), 0.1 );
            var circle2 = new q.Shapes.Circle( new Vector2( 400.5, 725.5 ), 2.0 );

            // Perform the searches
            var results1 = tree.find_items( circle1 );
            var results2 = tree.find_items( circle2 );

            // Perform tests
            expect( results1.length ).to.equal( 1 );
            expect( results2.length ).to.equal( 13 );

        });

        it( '2 Rectangle Searches', function () {

            // Create a few different rectangles
            var rectangle1 = new q.Shapes.Rectangle( new Vector2( 50, 50 ), new Vector2( 51, 51 ) );
            var rectangle2 = new q.Shapes.Rectangle( new Vector2( 300, 50 ), new Vector2( 400, 200 ) );

            // Perform the searches
            var results1 = tree.find_items( rectangle1 );
            var results2 = tree.find_items( rectangle2 );

            // Perform test
            expect( results1.length ).to.equal( 1 );
            expect( results2.length ).to.equal( 15000 );

        });

    });

    describe( 'Dataset: 10,000,000 points with unit spacing', function () {

        var tree;

        it( 'Build quadtree and dataset', function () {

            // This one will take a little longer
            this.timeout( 15000 );

            // Create the quadtree
            var min = new Vector2( 0, 0 );
            var max = new Vector2( 1000, 10000 );
            tree = new q.Quadtree( min, max, 5000 );

            // Add the points
            for ( var y=0; y<10000; ++y ) {
                for ( var x=0; x<1000; ++x ) {

                    tree.add_item( new q.Items.Point( x+0.5, y+0.5 ) );

                }
            }

        });

        it( '2 Circle Searches', function () {

            // Create a few different circles
            var circle1 = new q.Shapes.Circle( new Vector2( 100.5, 100.5 ), 0.1 );
            var circle2 = new q.Shapes.Circle( new Vector2( 400.5, 725.5 ), 2.0 );

            // Perform the searches
            var results1 = tree.find_items( circle1 );
            var results2 = tree.find_items( circle2 );

            // Perform tests
            expect( results1.length ).to.equal( 1 );
            expect( results2.length ).to.equal( 13 );

        });

        it( '2 Rectangle Searches', function () {

            // Create a few different rectangles
            var rectangle1 = new q.Shapes.Rectangle( new Vector2( 500, 500 ), new Vector2( 501, 501 ) );
            var rectangle2 = new q.Shapes.Rectangle( new Vector2( 0, 0 ), new Vector2( 100, 100 ) );

            // Perform the searches
            var results1 = tree.find_items( rectangle1 );
            var results2 = tree.find_items( rectangle2 );

            // Perform test
            expect( results1.length ).to.equal( 1 );
            expect( results2.length ).to.equal( 10000 );

        });

    });

});
