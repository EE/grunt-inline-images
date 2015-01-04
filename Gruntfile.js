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

        eslint: {
            all: {
                src: [
                    'Gruntfile.js',
                    'tasks',
                    'test',
                ],
            },
        },

        jscs: {
            all: {
                src: [
                    'Gruntfile.js',
                    'tasks/**/*.js',
                    'test/**/*.js',
                ],
                options: {
                    config: '.jscsrc',
                },
            },
        },

        // Configuration to be run (and then tested).
        inlineImages: {
            all: {
                options: {
                    toInline: [ // beginnings of URLs to images to be inlined in a base64 representation
                        'example.com/',
                        'raw\\.githubusercontent\\.com/',
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
        mochaTest: {
            all: {
                options: {
                    reporter: 'spec',
                },
                src: ['test/*.js'],
            },
        },

    });

    // Load all grunt tasks matching the `grunt-*` pattern.
    require('load-grunt-tasks')(grunt);

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.registerTask('lint', [
        'eslint',
        'jscs',
    ]);

    // By default, lint and run all tests.
    grunt.registerTask('default', [
        'clean',
        'lint',
        'inlineImages',
        'mochaTest',
    ]);
};
