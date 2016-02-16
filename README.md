## quadtree-js

[![Build Status](https://travis-ci.org/atdyer/quadtree-js.svg?branch=master)](https://travis-ci.org/atdyer/quadtree-js)

A simple, fast, and flexible quadtree search.

#### Features

- Basic items such as point, node, and element are able to be inserted into a quadtree
- Custom items are very easy to create for use with the quadtree
- Basic search shapes such as circle, rectangle, and polygon are provided for searching for items inside of a shape
- Custom shapes are very easy to create for use with the quadtree

#### Usage

```js
// Import the quadtree-js package
q = require( 'quadtree' );

// Calculate the bounds of your dataset and define a bin size
var min = ...; // Of type q.Vector2
var max = ...; // Of type q.Vector2
var bin_size = ...; // e.g. 250

// Create a quadtree with the known bounds of your dataset
var quadtree = new q.Quadtree( min, max, bin_size );

// Create and add items to the quadtree
quadtree.add_item( new q.Items.Point( x, y ) );
...

// Create the shape for searching
var circle = new q.Shapes.Circle( new q.Vector2( x, y ), radius );

// Perform the search
var search_results = quadtree.find_items( circle ); // Returns a list of items

```