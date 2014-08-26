module.exports = function (grunt) {
  grunt.initConfig({
    clean: ['ng-fhir.js'],
    coffee: {
      main: {
        options: {
          join: true
        },
        files: {
          'ng-fhir.js': 'coffee/**/*.coffee'
        }
      }
    },
    karma: {
      unit: {
         configFile: 'karma.conf.js',
         browsers: ['PhantomJS'],
         autoWatch: true,
         options: {
             files: ['test/**/*.js']
         }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['clean', 'coffee']);
};
