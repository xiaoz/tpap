module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),

            kmc: {
                options: {
                    packages: [
                        {
                            name: 'openjs',
                            path: './assets',
                            charset: 'utf8'
                        }
                    ]
                },
                main: {
                    files: [
                        {
                            expand: true,
                            cwd: "assets/openjs",
                            src: "**/*.js",
                            dest: "assets/openjs",
                            ext: "-min.js"
                        }
                    ]
                }
            },
            clean: {
                build: {
                    src: ['assets/**/*-min.js']
                }
            },
            copy: {
                main: {
                    files: [
                        {expand: true, cwd: 'src/scripts', src: ['**/*.js'], dest: 'build/scripts'} // makes all src relative to cwd
                    ]
                }
            },
            uglify: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    beautify : {
                        ascii_only : true
                    }
                },
                openjs: {
                    expand: true,
                    src: "**/*-min.js",
                    cwd: 'assets/openjs',
                    dest: "assets/openjs",
                    ext: '.js'
                },
                base: {
                    expand: true,
                    src: "**/*.js",
                    cwd: 'assets/base',
                    dest: "assets/base",
                    ext: '-min.js'
                },
                widgets: {
                    expand: true,
                    src: "**/*.js",
                    cwd: 'assets/widgets',
                    dest: "assets/widgets",
                    ext: '-min.js'
                }
            },
            cssmin: {
                compress: {
                    expand: true,
                    src: '**/*.css',
                    ext: "-min.css",
                    cwd: "build/stylesheets",
                    dest: "build/stylesheets/"

                }
            },
            concat: {
                foo: {
                    src: ['src/stylesheets/css/*.css'],
                    dest: ['build/stylesheets/combo.css']
                }
            },
            native2ascii: {
                dist: {
                    expand: true,
                    src: '*-min.js',
                    cwd: "build/scripts",
                    dest: "build/scripts/"
                }
            },
            compass: {
                dist: {
                    options: {
                        sassDir: "src/stylesheets/sass",
                        cssDir: "src/stylesheets/css"
                    }
                }
            },
            watch: {
                compass: {
                    files: "src/stylesheets/sass",
                    tasks: ['compass']
                },
                velocity: {
                    files: "src/page/vm/**/**",
                    tasks: ['velocity_js']
                }
            },
            velocity_js: {
                dist: {
                    expand: true,
                    src: ['*.vm', '!_*.vm'],
                    ext: ".html",
                    cwd: "src/page/vm",
                    dest: "src/page/html"
                }
            },

            tpsmate: {
                build: {
                    src: ['src/page/vm/**/*.vm']
                },
                options: {
                    argu: " --inplace --force "
                }
            }
        }
    );

    grunt.loadNpmTasks('grunt-kmc');
    grunt.loadNpmTasks('grunt-native2ascii');
    grunt.loadNpmTasks('grunt-tpsmate');
    grunt.loadNpmTasks('grunt-velocity.js');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('watchall', ['watch']);

    // Default task(s).
    grunt.registerTask('default', ['clean', 'kmc', 'uglify']);
    grunt.registerTask('demo', ['clean', 'kmc']);

};