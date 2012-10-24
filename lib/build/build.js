load("steal/rhino/rhino.js");

steal('steal/build', function(){
	steal.build('build/build.html', {
		to: '../bin'
	});
});
