module.exports = function (grunt) {


    grunt.initConfig({
        uglify: {
            options: {
                mangle: false,
                sourceMap : true
            },
            minify_js: {
                files: {
                    './dist/TreineticEpubReader.min.js': [
                        'build-output/_single-bundle/TreineticEpubReader.js'
                    ]
                }
            }
        },

        concat: {
            libcss: {
                src: [
                    'src/css/Tr_style.css',
                    'src/css/sourcesanspro.css',
                    'src/css/readium_js.css',
                    'src/css/viewer.css',
                    'src/css/viewer_audio.css'
                ],
                dest: './dist/TreineticEpubReader.css',
            },
        },

        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            minify_css: {
                files: [{
                    expand: true,
                    cwd: './dist/',
                    src: ['TreineticEpubReader.css'],
                    dest: './dist/',
                    ext: '.min.css'
                }]
            }
        },
        copy: {
            main: {
                files: [
                    {cwd: 'build-output/_single-bundle', expand: true, src: ['TreineticEpubReader.js'], dest: 'dist/'},
                    {cwd: 'dev/grunt_build', expand: true, src: ['index.html'], dest: 'dist/sample/'},
                    {cwd: 'dev/grunt_build/css', expand: true, src: ['style.css'], dest: 'dist/sample/css'},
                    {cwd: 'dev/grunt_build/js', expand: true, src: ['main.js'], dest: 'dist/sample/js'},
                    {
                        cwd: 'dev/grunt_build/assets',
                        expand: true,
                        src: ['images/**',],
                        dest: './dist/sample/assets/'
                    },
                    {
                        cwd: 'epub_content',
                        expand: true,
                        src: ['epub_2/**',],
                        dest: './dist/sample/assets/epub/'
                    },
                    {
                        cwd: 'epub_content',
                        expand: true,
                        src: ['epub_1.epub'],
                        dest: './dist/sample/assets/epub/'
                    },
                    {
                        cwd: 'build-output/',
                        expand: true,
                        src: ['deflate.js', 'inflate.js', 'z-worker.js'],
                        dest: './dist/workers/'
                    },
                    {
                        cwd: 'build-output/',
                        expand: true,
                        src: ['deflate.js', 'inflate.js', 'z-worker.js'],
                        dest: './dist/sample/assets/workers/'
                    },
                ],
            },
            copyToSample :{
                files: [
                    {cwd: 'dist', expand: true, src: ['TreineticEpubReader.css'], dest: 'dist/sample/css'},
                    {cwd: 'dist', expand: true, src: ['TreineticEpubReader.js'], dest: 'dist/sample/js'},
                ],
            }
        },
    });


    //ZIPJS --> deflate.js inflate.js z-worker.js
    grunt.registerTask("build", ["copy:main", "concat:libcss" , "cssmin:minify_css" , "uglify:minify_js", "copy:copyToSample"]);

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
};
