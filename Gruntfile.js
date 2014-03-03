module.exports = function(grunt) {

    // pass a param or call a task that picks HOME or WORK path
    // http://gruntjs.com/api/grunt.option
    var plugin_path = '../wordpress/wp-content/plugins/photomosaic-for-wordpress/';
    var dist_path = 'app/dist/';

    grunt.initConfig({
        clean : {
            dist : {
                src : dist_path
            },
            plugin : {
                src : plugin_path + '/**/*',
                options : {
                    force : true
                }
            }
        },
        concat : {
            js : {
                src : [
                    'app/js/app.js',
                    'app/includes/vendor/jquery-1.9.1.min.js',
                    'app/includes/vendor/jstween-1.1.js',
                    'app/includes/vendor/prettyphoto/jquery.prettyphoto.js',
                    'app/includes/vendor/mustache.js',
                    'app/includes/vendor/modernizr.js',
                    'app/includes/vendor/imagesloaded.js',
                    'app/js/photomosaic.js'
                ],
                dest : dist_path + 'js/photomosaic.js',
                nonull : true
            }
        },
        copy : {
            dist : {
                files : [
                    {
                        expand : true,
                        cwd : 'app/',
                        src : ['css/**/*', 'images/**/*', 'includes/**/*'],
                        dest : dist_path,
                        filter : 'isFile'
                    },
                    {
                        expand : true,
                        cwd : 'app/',
                        src : ['js/photomosaic.admin.js', 'js/photomosaic.editor.js'],
                        dest : dist_path,
                        filter : 'isFile'
                    },
                    {
                        expand: true,
                        cwd : 'app/includes/vendor/',
                        src : ['markdown.php'],
                        dest : dist_path + 'includes/',
                        filter : 'isFile',
                        rename : function (dest, src) {
                            return dest + 'Markdown.php';
                        }
                    },
                    {
                        expand: true,
                        cwd : 'app/',
                        src : ['photomosaic.php'],
                        dest : dist_path,
                        filter : 'isFile'
                    }
                ]
            },
            plugin : {
                expand : true,
                cwd : dist_path,
                src : '**/*',
                dest : plugin_path 
            }
        },
        uglify : {
            dist : {
                src : dist_path + 'js/photomosaic.js',
                dest : dist_path + 'js/photomosaic.min.js',
                options : {
                    // sourceMap : true,
                    preserveComments : 'all',
                    mangle: false,
                    banner : '/* !!! PhotoMosaic v2.5.2 !!! */'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', [ 'clean:dist', 'concat', 'copy:dist', 'uglify:dist', 'clean:plugin', 'copy:plugin', 'clean:dist' ]);
};