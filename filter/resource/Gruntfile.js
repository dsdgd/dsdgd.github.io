module.exports = function(grunt) {
	
	grunt.initConfig({
		
		 pkg: grunt.file.readJSON('package.json'),
		 
		 transport : {
			 webfilter : {
				 files : {
					 'js/.build' : [
						 'js/WebFilter/jQuery.webFilter.js',
						 'js/WebFilter/data-processing.js',
						 'js/WebFilter/ui-screening.js',
						 'js/WebFilter/ui-slider.js',
						 'js/WebFilter/ui-checkbox.js',
						 'js/WebFilter/ui-moreKey.js',
						 'js/WebFilter/ui-toggle.js',
						 'js/WebFilter/ui-reset.js',
						 'js/WebFilter/data-getKeyWord.js',
						 'js/WebFilter/data-ajax.js',
						 'js/WebFilter/ui-paging.js',
						 'js/WebFilter/ui-fixHead.js',
						 'js/WebFilter/ui-hoverBgColor.js'
					 ]
				 }
			 }
		 },
		 
		 concat : {
			 webfilter : {
				 files : {
					 'js/dist/jQuery.webFilter.js' : [
						 'js/.build/WebFilter/jQuery.webFilter.js',
						 'js/.build/WebFilter/data-processing.js',
						 'js/.build/WebFilter/ui-screening.js',
						 'js/.build/WebFilter/ui-slider.js',
						 'js/.build/WebFilter/ui-checkbox.js',
						 'js/.build/WebFilter/ui-moreKey.js',
						 'js/.build/WebFilter/ui-toggle.js',
						 'js/.build/WebFilter/ui-reset.js',
						 'js/.build/WebFilter/data-getKeyWord.js',
						 'js/.build/WebFilter/data-ajax.js',
						 'js/.build/WebFilter/ui-paging.js',
						 'js/.build/WebFilter/ui-fixHead.js',
						 'js/.build/WebFilter/ui-hoverBgColor.js'
					 ]
				 }
			 }
		 },
		 uglify : {
			 webfilter : {
				 files : {
					 'js/dist/jQuery.webFilter.min.js' : ['js/dist/jQuery.webFilter.js']
 				 }
			 }
		 }
		
	});
	
	grunt.loadNpmTasks('grunt-cmd-transport');
	grunt.loadNpmTasks('grunt-cmd-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

  	grunt.registerTask('default', ['transport','concat','uglify']);

	
};