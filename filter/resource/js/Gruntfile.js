module.exports = function(grunt) {
	
	grunt.initConfig({
		
		 pkg: grunt.file.readJSON('package.json'),
		 
		 transport : {
			 webfilter : {
				 files : {
					 '.build' : [
						 'WebFilter/jQuery.webFilter.js',
						 'WebFilter/data-processing.js',
						 'WebFilter/ui-screening.js',
						 'WebFilter/ui-slider.js',
						 'WebFilter/ui-checkbox.js',
						 'WebFilter/ui-moreKey.js',
						 'WebFilter/ui-toggle.js',
						 'WebFilter/ui-reset.js',
						 'WebFilter/data-getKeyWord.js',
						 'WebFilter/data-ajax.js',
						 'WebFilter/ui-paging.js',
						 'WebFilter/ui-fixHead.js',
						 'WebFilter/ui-hoverBgColor.js'
					 ]
				 }
			 }
		 },
		 
		 concat : {
			 webfilter : {
				 files : {
					 'dist/jQuery.webFilter.js' : [
						 '.build/WebFilter/jQuery.webFilter.js',
						 '.build/WebFilter/data-processing.js',
						 '.build/WebFilter/ui-screening.js',
						 '.build/WebFilter/ui-slider.js',
						 '.build/WebFilter/ui-checkbox.js',
						 '.build/WebFilter/ui-moreKey.js',
						 '.build/WebFilter/ui-toggle.js',
						 '.build/WebFilter/ui-reset.js',
						 '.build/WebFilter/data-getKeyWord.js',
						 '.build/WebFilter/data-ajax.js',
						 '.build/WebFilter/ui-paging.js',
						 '.build/WebFilter/ui-fixHead.js',
						 '.build/WebFilter/ui-hoverBgColor.js'
					 ]
				 }
			 }
		 },
		 uglify : {
			 webfilter : {
				 files : {
					 'dist/jQuery.webFilter.min.js' : ['dist/jQuery.webFilter.js']
 				 }
			 }
		 }
		
	});
	
	grunt.loadNpmTasks('grunt-cmd-transport');
	grunt.loadNpmTasks('grunt-cmd-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

  	grunt.registerTask('default', ['transport','concat','uglify']);

	
};