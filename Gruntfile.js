/**
 * grunt-inline-images
 * https://github.com/EE/grunt-inline-images
 *
 * Author Michał Gołębiowski <michal.golebiowski@laboratorium.ee>
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        clean: {
            test: {
                src: ['test/tmp/*.json'],
            },
        },

        jshint: {
            all: {
                options: {
                    jshintrc: '.jshintrc',
                },
                src: [
                    'Gruntfile.js',
                    'tasks/*.js',
                ],
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc',
                },
                src: ['<%= mochacli.tests %>'],
            },
        },

        // Configuration to be run (and then tested).
        inlineImages: {
            all: {
                options: {
                    toInline: [ // beginnings of URLs to images to be inlined in a base64 representation
                        'example.com/',
                        'gravatar\\.com/',
                    ],
                    toDiscard: [ // beginnings of URLs to be changed to "about:blank"
                        '(player\\.|)vimeo\\.com/',
                        'youtube\\.com/',
                        'facebook\\.com/',
                    ],
                },
                files: {
                    'test/tmp/actual.json': ['test/fixtures/input.json'],
                },
            },
        },

        // Unit tests.
        mochacli: {
            options: {
                require: ['should'],
                bail: true
            },
            tests: ['test/*.js'],
        },

    });

    // Load all grunt tasks matching the `grunt-*` pattern.
    require('load-grunt-tasks')(grunt);

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.registerTask('test', ['mochacli']);

    // By default, lint and run all tests.
    grunt.registerTask('default', [
        'clean',
        'jshint',
        'inlineImages',
        'test',
    ]);
};
