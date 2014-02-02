module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jadeUsemin: {
      options: {
        uglify: true,
        prefix: 'public/'
      },
      files: {
        src: ['views/layout.jade']
      }
    }
  });

  require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['jadeUsemin']);

};