module.exports = function( grunt ) {
    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),
        browserify: {
            maze: {
                files: {
                    'demo/maze.js': [ 'src/index.js' ]
                },
                options: {
                    browserifyOptions: {
                        debug: true,
                    },
                    external: [ 'jquery', 'underscore' ],
                    transform: [ [ 'babelify', { presets: [ 'es2015' ] } ] ]
                }
            },

            lib: {
                files: {
                    'demo/lib.js': [ 'node_modules/jquery/dist/jquery.js',  'node_modules/underscore/underscore.js' ]
                },
                options: {
                    alias: {
                        'jquery': './node_modules/jquery/dist/jquery.js',
                        'underscore': './node_modules/underscore/underscore.js'
                    }
                }
            },

            demo: {
                files: {
                    'demo/demo.js': [ 'demo/index.js' ]
                },
                options: {
                    browserifyOptions: {
                        debug: true,
                    },
                    transform: [ [ 'babelify', { presets: [ 'es2015' ] } ] ]
                }
            }
        },
        watch: {
            maze: {
                files: [ 'src/**/*.js' ],
                tasks: [ 'browserify:maze' ]
            },

            demo: {
                files: [ 'demo/demo.js' ],
                tasks: [ 'browserify:demo' ]
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-browserify' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );

    grunt.registerTask( 'default', [ 'browserify', 'watch' ] );
};
