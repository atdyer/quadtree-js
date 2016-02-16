
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