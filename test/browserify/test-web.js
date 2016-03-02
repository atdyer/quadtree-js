
Vector2 = Quadtree.Vector2;
Items = Quadtree.Items;
Shapes = Quadtree.Shapes;

function run_test () {

    console.log( 'Starting tests' );

    // Create the quadtree
    var min = new Vector2( 0, 0 );
    var max = new Vector2( 10, 10 );
    var tree = new Quadtree.Quadtree( min, max, 5 );

    // Add the points
    for ( var y=0; y<10; ++y ) {
        for ( var x=0; x<10; ++x ) {

            tree.add_item( new Items.Point( x+0.5, y+0.5 ) );

        }
    }

    // Create a few different circles
    var circle1 = new Shapes.Circle( new Vector2( 5.5, 5.5 ), 0.1 );
    var circle2 = new Shapes.Circle( new Vector2( 5.5, 5.5 ), 2.0 );

    // Perform the searches
    var results1 = tree.find_items( circle1 );
    var results2 = tree.find_items( circle2 );

    console.log( results1 );
    console.log( results2 );

    console.log( 'Done' );

}