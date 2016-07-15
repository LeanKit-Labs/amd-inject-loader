define( [ "lodash", "unreferenced", blah ], function( _ ) {
	_.each( [ 1, 2, 3 ], console.log.bind( console ) );
} );
