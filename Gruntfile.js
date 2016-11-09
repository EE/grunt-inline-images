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
                src: [
                    'test/tmp/*',
                ],
            },
        },

        eslint: {
            all: {
                src: [
                    'Gruntfile.js',
                    'src/**/*.js',
                    'test/**/*.js',
                ],
            },
        },

        // Configuration to be run (and then tested).
        inlineImages: {
            all: {
                options: {
                    // Beginnings of URLs to images to be inlined in a base64 representation.
                    toInline: [
                        'example.com/',
                        'raw\\.githubusercontent\\.com/',
                    ],
                    // Beginnings of URLs to be changed to "about:blank".
                    toDiscard: [
                        '(player\\.|)vimeo\\.com/',
                        'youtube\\.com/',
                        'facebook\\.com/',
                    ],
                },
                files: {
                    'test/tmp/actual1.json': ['test/fixtures/input1.json'],
                    'test/tmp/actual2.json': ['test/fixtures/input2.json'],
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

    // Actually load this plugin's task...
    grunt.loadTasks('tasks');

    grunt.registerTask('lint', [
        'eslint',
    ]);

    // By default, lint and run all tests.
    grunt.registerTask('default', [
        'clean',
        'lint',
        'inlineImages',
        'mochaTest',
    ]);
};
