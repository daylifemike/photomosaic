module.exports = function(grunt) {

// pass a param or call a task that picks HOME or WORK path
// http://gruntjs.com/api/grunt.option
var path = '../wordpress/wp-content/plugins/photomosaic-for-wordpress/';
/*
THE OLD WAY
 --> css
    - photoMosaic.css
    - photoMosaic.admin.css
    - photoMosaic.menu.css
 --> images
    - x4
 --> includes
    --> admin-markup
    --> prettyPhoto
    - Markdown.php
 --> js
    - jquery.photoMosaic.js
    - jquery.photoMosaic.editor.js
    - jquery.photoMosaic.wp.admin.js
 - photoMosaic.php
 - readme.txt
*/

    grunt.initConfig({
        clean : {
            src : path + '/**/*',
            options : {
                force : true
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/',
                        src: ['css/**/*', 'images/**/*', 'js/**/*', 'includes/admin-markup/**/*'],
                        dest: path,
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'app/includes/vendor/',
                        src: ['markdown.php'],
                        dest: path + 'includes/',
                        filter: 'isFile',
                        rename: function (dest, src) {
                            return dest + 'Markdown.php';
                        }
                    },
                    {
                        expand: true,
                        cwd: 'app/includes/vendor/prettyphoto/',
                        src: ['**/*'],
                        dest: path + 'includes/prettyPhoto/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'app/',
                        src: ['photomosaic.php'],
                        dest: path,
                        filter: 'isFile',
                        rename: function (dest, src) {
                            return dest + 'photoMosaic.php';
                        }
                    }
                ]
            }
        },
        concat: {
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', [ 'clean', 'copy:main' ]);
};