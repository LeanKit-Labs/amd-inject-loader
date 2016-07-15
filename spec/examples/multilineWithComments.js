define( [
	// libs
	"lodash",
	"jquery", // jquery
	// app code, dependency
	"app/code"
], function( _, appcode ) {
		_.each( [ 1, 2, 3 ], console.log.bind( console ) );
	} );
