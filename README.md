## quadtree-js

[![Build Status](https://travis-ci.org/atdyer/quadtree-js.svg?branch=master)](https://travis-ci.org/atdyer/quadtree-js)

A simple, fast, and flexible quadtree search for static datasets.

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

#### Shapes

The following shapes can be used to search a quadtree:

##### Rectangle

```javascript
// Create a rectangle
var rectangle = new q.Shapes.Rectangle( bottom_left, top_right );
```

where ```bottom_left``` and ```top_right``` are both ```Vector2``` objects
corresponding to the bottom left and top right coordinates of the rectangle.

##### Circle

```javascript
// Create a circle
var circle = new q.Shapes.Circle( center_point, radius );
```

where ```center_point``` is a ```Vector2``` object corresponding to the coordinates
of the center point of the circle, and ```radius``` is a numerical value
corresponding to the radius of the circle.