define( [ "lodash", "unreferenced" ], function( lodash ) {
	_.each( [ 1, 2, 3 ], console.log.bind( console ) );
} );
