/**
 * grunt-inline-images
 * https://github.com/EE/grunt-inline-images
 *
 * Author Michał Gołębiowski <michal.golebiowski@laboratorium.ee>
 * Licensed under the MIT license.
 */

'use strict';

// Disable options that don't work in Node.js 0.12.
// Gruntfile.js & tasks/*.js are the only non-transpiled files.
/* eslint-disable no-var */

var assert = require('assert');

module.exports = function (grunt) {
    try {
        assert.strictEqual(eval('(() => 2)()'), 2); // eslint-disable-line no-eval
        return require('../src/inline-images')(grunt);
    } catch (e) {
        return require('../dist/src/inline-images')(grunt);
    }
};
