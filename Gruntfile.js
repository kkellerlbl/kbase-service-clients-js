/*global module*/
/*jslint white:true*/
module.exports = function (grunt) {
    'use strict';
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    /*
     * 
     * notes on "fixers"
     * - add js lint config to decrease noise of harmless lint violations
     * - wrap in define
     * - set strict mode
     * - determine the name of the "subject" and return it as the module object
     * - modest code repair to assist in reducing lint noise (and of course improve code reliability)
     */
    /*
     function serviceCall() {
     return Promise.resolve(json_call_ajax.apply(arguments));
     }
     */
    function fixLib(content) {
        var lintDecls = '/*global define */\n/*jslint white:true */',
            namespaceRe = /^function (.+?)\(/m,
            namespace = content.match(namespaceRe)[1],
            requireJsStart = 'define(["jquery", "bluebird"], function ($, Promise) {\n"use strict";',
            requireJsEnd = 'return ' + namespace + ';\n});',
            repairedContent = content.replace(/return promise;/, 'return Promise.resolve(promise);')
            .replace(/([^=!])==([^=])/g, '$1===$2')
            .replace(/!=([^=])/g, '!==$1');

        return [lintDecls, requireJsStart, repairedContent, requireJsEnd].join('\n');
    }

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
//        concat: {
//            options: {
//                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
//            },
//            my_target: {
//                src: 'js_clients/*.js',
//                dest: 'kbase-client-api.js',
//            }
//        },
//        uglify: {
//            options: {
//                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
//            },
//            my_target: {
//                src: 'kbase-client-api.js',
//                dest: 'kbase-client-api.min.js',
//            }
//        },
        copy: {
            fixLib: {
                files: [
                    {
                        cwd: 'src/kbase-clients/js_clients',
                        src: '*.js',
                        dest: 'dist/kb/service/client',
                        expand: true
                    }
                ],
                options: {
                    process: function (content) {
                        return fixLib(content);
                    }
                }
            },
            build: {
                files: [
                    {
                        cwd: 'src',
                        src: '*.js',
                        dest: 'dist/kb/service',
                        expand: true
                    }
                ]
            },
            plugin: {
                files: [
                    {
                        cwd: 'src/plugin',
                        src: '**',
                        dest: 'dist/plugin',
                        expand: true
                    }
                ]
            }
        },
        clean: {
            build: {
                src: ['dist']
            }
        }
    });

    // grunt.registerTask('default', ['concat', 'uglify']);
    //grunt.registerTask('clean', [
    //    'clean:build'
    //]);
    grunt.registerTask('build', [
        'copy:build',
        'copy:fixLib'
    ]);
};