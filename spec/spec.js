var loader = require( "../index.js" );
require( "should" );

function callLoader( file, options ) {
	var _opts = {};
	if ( options ) {
		_opts.amdInjectLoader = options;
	}
	return loader.call( { options: _opts }, file );
}

describe( "amd-inject-loader", function() {
	it( "should throw an error when used with incompatible formats", function() {
		( function() {
			callLoader( "var d = require( 'lodash' );" );
		} ).should.throw();

		( function() {
			callLoader( "define({ val: true });" );
		} ).should.throw();
	} );
	it( "should transform the file correctly", function() {
		var resp = callLoader( [
			"define( [ 'lodash' ], function ( lodash ) {",
			"\t_.each( [ 1, 2, 3 ], console.log.bind( console ) );",
			"} );"
		].join( "\n" ) );

		resp.should.match( /var lodash =/ );

		// Different format
		var resp2 = callLoader( [
			"define( [ ",
			"'lodash'",
			" ], function ( lodash ) {",
			"\t_.each( [ 1, 2, 3 ], console.log.bind( console ) );",
			"} );"
		].join( "\n" ) );

		resp2.should.match( /var lodash =/ );
	} );
	it( "should support more dependencies than arguments", function() {
		var resp = callLoader( [
			"define( [ 'lodash', 'unreferenced' ], function ( lodash ) {",
			"\t_.each( [ 1, 2, 3 ], console.log.bind( console ) );",
			"} );"
		].join( "\n" ) );

		resp.should.match( /var lodash =/ );
		resp.should.match( /require\( "unreferenced" \)/ );
	} );

	it( "should add istanbul ignore comments before each line when turned on", function() {
		var resp = callLoader( [
			"define( [ 'lodash', 'react' ], function ( lodash, React ) {",
			"\t_.each( [ 1, 2, 3 ], console.log.bind( console ) );",
			"} );"
		].join( "\n" ), { istanbul: true } );

		var lines = resp.split( /\n/ );
		lines[ 1 ].should.equal( "\t/* istanbul ignore next - the following line of code is used for dependency injection */" );
		lines[ 2 ].should.startWith( "\tvar lodash =" );
		lines[ 3 ].should.equal( "\t/* istanbul ignore next - the following line of code is used for dependency injection */" );
		lines[ 4 ].should.startWith( "\tvar React =" );
	} );
} );
