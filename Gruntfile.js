module.exports = function (grunt) {
  grunt.initConfig({
    clean: ['js/**/*'],
    coffee: {
      main: {
        options: {
          join: true
        },
        files: {
          'js/ng-fhir.js': 'coffee/**/*.coffee'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');

  grunt.registerTask('default', ['clean', 'coffee']);
};
