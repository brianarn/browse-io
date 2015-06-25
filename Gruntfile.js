var webpackConfig = require('./webpack.config');

module.exports = function (grunt) {
  grunt.initConfig({
    webpack: webpackConfig,

    watch: {
      webpack: {
        files: [
          'lib/client/**/*.js',
          'lib/client/**/*.jsx',
          'lib/client/**/*.css'
        ],
        tasks: ['webpack']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('default', ['webpack', 'watch']);
};
