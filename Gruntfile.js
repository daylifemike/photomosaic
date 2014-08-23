module.exports = function(grunt) {

    var plugin_name = 'photomosaic-for-wordpress';
    var plugin_path = '../wordpress/wp-content/plugins/' + plugin_name + '/';
    var nonwp_path = 'app/non-WP/download/files/'
    var dist_path = 'app/dist/';
    var release_path = '../' + plugin_name + '/';
    var files = [
        // base
        'app/js/app.js',
        // dependencies
        'app/includes/vendor/modernizr.js',
        'app/includes/vendor/react.js',
        'app/includes/vendor/imagesloaded.js',
        'app/includes/vendor/waypoints.js',
        'app/includes/vendor/prettyphoto/jquery.prettyphoto.js',
        // utils
        'app/js/utils.js',
        'app/js/error_checks.js',
        'app/js/inputs.js',
        'app/js/loader.js',
        // view constructors
        'app/js/layouts/common.js',
        'app/js/layouts/columns.js',
            // 'app/js/layouts/rows.js',
        'app/js/layouts/grid.js',
        // react
        'app/js/layouts/react.js',
        // photomosaic
        'app/js/core.js'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
                src : plugin_name + '-<%= pkg.version %>/'
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
            nonwp : {
                files : [
                    {
                        expand : true,
                        cwd : dist_path,
                        src : [
                            'js/**/*', 'css/**/*', 'images/**/*',
                            '!**/admin-page-icon.gif', '!**/photomosaic.admin.css', '!**/photomosaic.admin.js', '!**/photomosaic.editor.js'
                        ],
                        dest : nonwp_path,
                        filter : 'isFile'
                    },
                    {
                        expand: true,
                        cwd : dist_path + '/includes/vendor/',
                        src : ['prettyphoto/**/*'],
                        dest : nonwp_path + 'includes/',
                        filter : 'isFile'
                    }
                ]
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
                dest : plugin_name + '-<%= pkg.version %>/'
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
                            return dest + 'markdown.php';
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
                    mangle: true,
                    sourceMap : true,
                    banner : '' +
                        '/*\n' +
                            '<%= pkg.name %> v<%= pkg.version %>\n' +
                            '<%= grunt.template.today("dddd, mmmm d, yyyy h:MM:ss TT Z") %>\n' +
                        '*/\n'
                }
            }
        },
        compress : {
            wordpress : {
                expand : true,
                cwd : dist_path,
                src : ['**/*'],
                options : {
                    archive : plugin_name + '-<%= pkg.version %>/' + plugin_name + '.zip'
                }
            },
            codecanyon : {
                expand : true,
                cwd : plugin_name + '-<%= pkg.version %>/',
                src : ['**/*'],
                options : {
                    archive : plugin_name + '-<%= pkg.version %>.zip'
                }
            }
        },
        replace : {
            dev : {
                src : dist_path + 'photomosaic.php',
                overwrite : true,
                replacements : [{
                    from : 'photomosaic.min.js',
                    to : 'photomosaic.js'
                }]
            },
            nonwp : {
                src : dist_path + 'js/photomosaic.js',
                overwrite : true,
                replacements : [{
                    from : 'JQPM',
                    to : 'jQuery'
                },
                {
                    from : 'var $sub = jQuery.sub();',
                    to : ''
                },
                {
                    from : "registerNamespace('jQuery', $sub || {});",
                    to : ''
                },
                {
                    from : "$sub",
                    to : "jQuery"
                }]
            }
        },
        watch : {
            dev : {
                files : [ 'app/**/*', '!app/dist/**/*', 'Gruntfile.js' ],
                tasks : [ 'concat', 'copy:dist', 'replace:dev', 'clean:plugin', 'copy:plugin', 'clean:dist' ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-text-replace');

    grunt.registerTask('dist', [ 'concat', 'copy:dist', 'uglify:dist' ]);
    grunt.registerTask('default', [ 'dist', 'clean:plugin', 'copy:plugin', 'clean:dist' ]);
    grunt.registerTask('release', [ 'dist', 'clean:release', 'copy:release', 'copy:changelog', 'clean:dist' ]);
    grunt.registerTask('codecanyon', [ 'dist', 'compress:wordpress', 'copy:readme', 'compress:codecanyon', 'clean:codecanyon', 'clean:dist' ]);
    grunt.registerTask('nonwp', [ 'concat', 'copy:dist', 'replace:nonwp', 'uglify:dist', 'copy:nonwp', 'clean:dist' ]);
};