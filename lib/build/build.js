load("steal/rhino/rhino.js");

steal('steal/build', function(){
	steal.build('build/build.html', {
		to: 'app'
	});
});

/*load("steal/rhino/rhino.js");
steal('steal/build/pluginify', function() {

	var excludes = [ 'steal/dev',
			'can/',
			'jquery',
			'steal/less' ];

	// Create full library
	steal.build.pluginify('app/app.js', {
		out: "../bin/production.js",
		skipCallbacks: true,
		exclude : excludes,
		shim : { 'jquery' : 'jQuery', 'can/util' : 'can' }
	});

});
*/
