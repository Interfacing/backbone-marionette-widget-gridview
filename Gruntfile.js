fs = require('fs');
_ = require('underscore');

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less: {
      all: {
        options: {
          paths: ['src/less']
        },
        files: {
          'dist/marionette-widget-gridview.css': 'src/less/main.less'
        }
      }
    },

    clean: ['dist'],

    cssmin: {
      all: {
        files: {
          'dist/marionette-widget-gridview.min.css': 'dist/marionette-widget-gridview.css'
        }
      }
    },

    uglify: {
      main: {
        options: {
          compress: true,
          mangle: true
        },
        files: {
          'dist/marionette.gridview.min.js': [
            'dist/marionette.gridview.js'
          ]
        }
      }
    },

    preprocess: {
      bundle: {
        src: 'src/js/build/bundled.js',
        dest: 'dist/marionette.gridview.js'
      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true
      },
      all: ['src/js/**/*.js']
    },

    karma: {
      all: {
        hostname: '127.0.0.1',
        client: { captureConsole: true },
        options: {
          logLevel: 'INFO',
          browsers: ['Firefox'],
          frameworks: ['jasmine'],
          reporters: ['progress'],
          singleRun: true,
          background: false,
          captureConsole: true,
          files: [
            "node_modules/jquery/dist/jquery.min.js",
            "node_modules/underscore/underscore-min.js",
            "node_modules/backbone/backbone-min.js",
            "node_modules/backbone.marionette/lib/backbone.marionette.min.js",
            "dist/marionette-widget-gridview.min.js",
            'test/unit/libs/jasmine-jquery.js',
            'dist/marionette-widget-gridview.js',
            'test/unit/spec/**/*.js']
        }
      }
    },

    protractor: {
      all: {
        options: {
          configFile: 'test/e2e/config.js'
        }
      }
    },

    watch: {
      css: {
        files: ['src/less/**/*.*'],
        tasks: ['less', 'cssmin'],
        options: {
          spawn: false,
          debounceDelay: 200
        }
      },

      js: {
        files: ['src/js/**/*.js'],
        tasks: ['preprocess', 'uglify'],
        options: {
          spawn: false,
          debounceDelay: 200
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-mincer');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default',  ['clean', 'less', 'preprocess', 'uglify', 'cssmin', 'watch']);
  grunt.registerTask('test',  [ 'karma']);
};