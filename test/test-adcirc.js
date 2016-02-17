
// Chai for testing
var expect = require( 'chai').expect;

// File I/O
var readline = require( 'readline' );
var fs = require( 'fs' );
var http = require( 'http' );

// Quadtree
var q = require( '../src/quadtree' );
var Vector2 = q.Vector2;

// fort.14 properties that we'll get directly from the file
var num_nodes = 0;
var num_elements = 0;

// Functions to build stuff
function read_fort14( file, callback ) {

    const rl = readline.createInterface({
        input: fs.createReadStream( file )
    });

    // File reading variables
    var nonwhite = /\S+/g;
    var currline = 0;
    var min_node = new Vector2( + Infinity, + Infinity );
    var max_node = new Vector2( - Infinity, - Infinity );
    var nodes = [];

    rl.on( 'line', function( line ) {

        if ( currline == 1 ) {

            var infoline = line.match( nonwhite );

            if ( infoline.length >= 2 ) {

                num_elements = parseInt( infoline[0], 10 );
                num_nodes = parseInt( infoline[1], 10 );
                console.log( '\tProperties of ' + file );
                console.log( '\t\t' + num_nodes + ' nodes' );
                console.log( '\t\t' + num_elements + ' elements' );

            }

        }

        else if ( currline >= 2 ) {

            if ( nodes.length < num_nodes ) {

                var node_dat = line.match( nonwhite );
                var node = new q.Items.Point( parseFloat( node_dat[1] ), parseFloat( node_dat[2] ) );
                min_node.min( node );
                max_node.max( node );
                nodes.push( node );

            }

        }

        ++currline;

    }).on( 'close', function () {

        // Top right boundaries are not inclusive, so we need to move the max
        // out by just a hair.
        max_node.addScalar( 0.00001 );

        // Call the callback
        callback( min_node, max_node, nodes );


    });

}

describe( 'ADCIRC Quadtree Functionality', function () {

    var min_node, max_node, node_list, quadtree;

    before( 'Read the fort.14 file', function ( done ) {

        this.timeout( 15000 );

        // Git: 'data/fort.14'
        // Fran: '/home/tristan/Adcirc/fran/fort.14'
        // Louisiana: '/home/tristan/box/adcirc/domains/louisiana/fort.14'
        read_fort14( 'data/fort.14', function ( _min_node, _max_node, _nodes ) {

            min_node = _min_node;
            max_node = _max_node;
            node_list = _nodes;
            done();

        });

    });

    it( 'Build quadtree from a subdomain', function () {

        // Create the quadtree
        quadtree = new q.Quadtree( min_node, max_node, 500 );

        // Add nodes to the quadtree
        for ( var i=0; i<node_list.length; ++i ) {

            quadtree.add_item( node_list[i] );

        }

        expect( quadtree ).to.not.be.undefined;

    });

    it( 'Retrieve all nodes from quadtree', function () {

        var nodes = quadtree.items;

        expect( nodes.length ).to.equal( num_nodes );

    });

});