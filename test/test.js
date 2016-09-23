var glob = require( 'glob' )
var path = require( 'path' );

glob.sync( './test/static/**/*.js' ).forEach( function( file ) {
  var moduleTest = require( path.resolve( file ) );
  for (var test in moduleTest){
  	moduleTest[test]();
  }
});
