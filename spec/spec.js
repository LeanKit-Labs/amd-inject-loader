var loader = require( "../index.js" );
require( "should" );

describe( "amd-inject-loader", function() {
	it( "should throw an error when used with incompatible formats", function() {
		( function() {
			loader( "var d = require( 'lodash' );" );
		} ).should.throw();

		( function() {
			loader( "define({ val: true });" );
		} ).should.throw();
	} );
	it( "should transform the file correctly", function() {
		var resp = loader( [
			"define( [ 'lodash' ], function ( lodash ) {",
			"\t_.each( [ 1, 2, 3 ], console.log.bind( console ) );",
			"} );"
		].join( "\n" ) );

		resp.should.match( /var lodash =/ );

		// Different format
		var resp2 = loader( [
			"define( [ ",
			"'lodash'",
			" ], function ( lodash ) {",
			"\t_.each( [ 1, 2, 3 ], console.log.bind( console ) );",
			"} );"
		].join( "\n" ) );

		resp2.should.match( /var lodash =/ );
	} );
	it( "should support more dependencies than arguments", function() {
		var resp = loader( [
			"define( [ 'lodash', 'unreferenced' ], function ( lodash ) {",
			"\t_.each( [ 1, 2, 3 ], console.log.bind( console ) );",
			"} );"
		].join( "\n" ) );

		resp.should.match( /var lodash =/ );
		resp.should.match( /require\( "unreferenced" \)/ );
	} );
} );
