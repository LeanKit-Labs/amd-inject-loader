require( "should" );
var sinon = require( "sinon" );
var er = require( "enhanced-require" )( module );

describe( "amd-inject-loader", function() {
	it( "should throw an error when used with incompatible formats", function() {
		( function() {
			er( "../index.js!./examples/invalid-commonjs" );
		} ).should.throw( /files with dependencies/ );

		( function() {
			er( "../index.js!./examples/invalid-amd" );
		} ).should.throw( /files with dependencies/ );

		( function() {
			er( "../index.js!./examples/validNoArgs" );
		} ).should.not.throw();
	} );
	it( "should transform the file correctly", function() {
		var factory = er( "../index.js!./examples/simple" );
		var resp = factory.toString();

		resp.should.match( /var _ =/ );

		var stub = sinon.stub();

		factory( {
			"lodash": { each: stub }
		} );

		stub.calledOnce.should.be.ok;
		stub.calledWith( [ 1, 2, 3 ] ).should.be.ok;
	} );
	it( "should tranform the file correctly even when define is multiline", function() {
		var factory = er( "../index.js!./examples/multiline" );
		var resp = factory.toString();

		resp.should.match( /var _ =/ );

		var stub = sinon.stub();

		factory( {
			"lodash": { each: stub }
		} );

		stub.calledOnce.should.be.ok;
		stub.calledWith( [ 1, 2, 3 ] ).should.be.ok;
	} );
	it( "should tranform the file correctly even when define has comments", function() {
		var localEr = require( "enhanced-require" )( module, {
			amdInjectLoader: {
				stripComments: true
			}
		} );
		var factory = localEr( "../index.js!./examples/multilineWithComments" );
		var resp = factory.toString();

		resp.should.match( /var _ =/ );

		var stub = sinon.stub();

		factory( {
			"lodash": { each: stub },
			"jquery": { each: stub },
			"app/code": { each: stub }
		} );

		stub.calledOnce.should.be.ok;
		stub.calledWith( [ 1, 2, 3 ] ).should.be.ok;
	} );

	it( "should allow the factory method to be called without any arguments", function() {
		var factory = er( "../index.js!./examples/withInclude" );
		var resp = factory.toString();

		resp.should.match( /var include =/ );
		factory.should.not.throw();
	} );

	it( "should support more dependencies than arguments", function() {
		var factory = er( "../index.js!./examples/moreDeps" );
		var resp = factory.toString();

		resp.should.match( /var _ =/ );
		resp.should.match( /require\( "unreferenced" \)/ );

		factory.bind( this, {
			lodash: { each: sinon.stub() },
			unreferenced: { somethingElse: true }
		} ).should.not.throw();
	} );

	it( "should add istanbul ignore comments before each line when turned on", function() {
		var localEr = require( "enhanced-require" )( module, {
			amdInjectLoader: {
				istanbul: true
			}
		} );
		var factory = localEr( "../index.js!./examples/istanbul" );
		var resp = factory.toString();

		var lines = resp.split( /\n/ );
		lines[ 1 ].should.equal( "\t/* istanbul ignore next - the following line of code is used for dependency injection */" );
		lines[ 2 ].should.startWith( "\tvar _ =" );
		lines[ 3 ].should.equal( "\t/* istanbul ignore next - the following line of code is used for dependency injection */" );
		lines[ 4 ].should.startWith( "\tvar React =" );
	} );
} );
