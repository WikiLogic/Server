module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compass: {                  // Task
			dist: {                   // Target
				options: {              // Target options
					sassDir: 'app/sass',
					cssDir: '.tmp/styles',
					environment: 'production'
				}
			}
		},
		sass: {
			dist: {
				options: {
					style: 'nested',
					require: 'sass-globbing'
				},
				files: {
					'.tmp/styles/main.css' : 'app/sass/main.scss'
				}
			}
		},
		watch: {
			css: {
				files: 'app/sass/**/*.scss',
				tasks: ['sass']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-sass-globbing');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default',['watch']);
}