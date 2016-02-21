
// Import chai for testing
var expect = require( 'chai' ).expect;

// Import quadtree
var q = require( './../src/quadtree' );
var Vector2 = q.Vector2;
var Point = q.Items.Point;
var Triangle = q.Items.Triangle;

// Build tests
describe( 'Triangle Shape Tests', function () {

    // Create the quadtree
    var tree;

    before( 'Populate quadtree with triangles', function () {
        tree = new q.Quadtree(new Vector2(0, 0), new Vector2(10, 10), 1);

        // Add four triangles
        // TODO: Add implicit casting from Vector2 to Shape.Point
        var t1 = new Triangle(
            new Point(1, 1),
            new Point(3, 1),
            new Point(2, 2)
        );

        var t2 = new Triangle(
            new Point(6, 1),
            new Point(8, 1),
            new Point(7, 2)
        );

        var t3 = new Triangle(
            new Point(1, 6),
            new Point(3, 6),
            new Point(2, 7)
        );

        var t4 = new Triangle(
            new Point(6, 6),
            new Point(8, 6),
            new Point(7, 7)
        );

        // Add the triangles to the tree
        tree.add_item(t1);
        tree.add_item(t2);
        tree.add_item(t3);
        tree.add_item(t4);

    });

    it( 'Retrieve all items from a quadtree', function () {

        // Get them back
        var triangles = tree.items;

        // Perform test
        expect( triangles.length ).to.equal( 4 );

    });

    it( 'Circle Search', function () {

        // Create a few different circles
        var circle1 = new q.Shapes.Circle( new Vector2( 0, 0 ), 2 );
        var circle2 = new q.Shapes.Circle( new Vector2( 5, 5 ), 10 );

        // Perform the searches
        var results1 = tree.find_items( circle1 );
        var results2 = tree.find_items( circle2 );

        // Perform tests
        expect( results1.length ).to.equal( 1 );
        expect( results2.length ).to.equal( 4 );

    });

});