module.exports = function(grunt) {

    var plugin_name = 'photomosaic-for-wordpress';
    var plugin_path = '../wordpress/wp-content/plugins/' + plugin_name + '/';
    var dist_path = 'app/dist/';
    var release_path = '../' + plugin_name + '/';
    var files = [
        // base
        'app/js/app.js',
        // dependencies
        'app/includes/vendor/jstween-1.1.js',
        'app/includes/vendor/prettyphoto/jquery.prettyphoto.js',
        'app/includes/vendor/mustache.js',
        'app/includes/vendor/modernizr.js',
        'app/includes/vendor/imagesloaded.js',
        // utils
        'app/js/utils.js',
        'app/js/error_checks.js',
        'app/js/inputs.js',
        // view constructors
        // 'app/js/layouts/columns.js',
        // 'app/js/layouts/rows.js',
        // 'app/js/layouts/grid.js',
        // photomosaic
        'app/js/core.js'
    ];

    grunt.initConfig({
        version : '0.0.0',
        clean : {
            dist : {
                src : dist_path
            },
            plugin : {
                src : plugin_path + '/**/*',
                options : {
                    force : true
                }
            },
            release : {
                src : release_path + '/**/*',
                options : {
                    force : true
                }
            },
            codecanyon : {
                src : plugin_name + '-<%= version %>/'
            }
        },
        concat : {
            js : {
                src : files,
                dest : dist_path + 'js/photomosaic.js',
                nonull : true
            }
        },
        copy : {
            plugin : {
                expand : true,
                cwd : dist_path,
                src : '**/*',
                dest : plugin_path
            },
            release : {
                expand : true,
                cwd : dist_path,
                src : '**/*',
                dest : release_path
            },
            changelog : {
                expand : true,
                cwd : dist_path + 'includes/admin-markup/',
                src : 'whatsnew.txt',
                dest : release_path,
                filter : 'isFile',
                rename : function (dest, src) {
                    return dest + 'CHANGES.md';
                },
                options : {
                    process: function (content, srcpath) {
                        return content.replace(/(#{2,3})/g,"#$1");
                    }
                }
            },
            readme : {
                expand : true,
                cwd : 'app/',
                src : 'readme.txt',
                dest : plugin_name + '-<%= version %>/'
            },
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
                        cwd : 'app/js/admin/',
                        src : ['photomosaic.admin.js', 'photomosaic.editor.js'],
                        dest : dist_path + 'js/',
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
            }
        },
        uglify : {
            dist : {
                src : dist_path + 'js/photomosaic.js',
                dest : dist_path + 'js/photomosaic.min.js',
                options : {
                    preserveComments : 'all',
                    mangle: false
                }
            }
        },
        compress : {
            wordpress : {
                expand : true,
                cwd : dist_path,
                src : ['**/*'],
                options : {
                    archive : plugin_name + '-<%= version %>/' + plugin_name + '.zip'
                }
            },
            codecanyon : {
                expand : true,
                cwd : plugin_name + '-<%= version %>/',
                src : ['**/*'],
                options : {
                    archive : plugin_name + '-<%= version %>.zip'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('dist', [ 'clean:dist', 'concat', 'copy:dist' /*, 'uglify:dist'*/]);
    grunt.registerTask('default', [ 'dist', 'clean:plugin', 'copy:plugin', 'clean:dist' ]);
    grunt.registerTask('release', [ 'dist', 'clean:release', 'copy:release', 'copy:changelog', 'clean:dist' ]);
    grunt.registerTask('codecanyon', function (version) {
        grunt.config.data.version = version || grunt.config.data.version;
        grunt.task.run([ 'dist', 'compress:wordpress', 'copy:readme', 'compress:codecanyon', 'clean:codecanyon' ]);
    });
};