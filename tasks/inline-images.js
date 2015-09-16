/**
 * grunt-inline-images
 * https://github.com/EE/grunt-inline-images
 *
 * Author Michał Gołębiowski <michal.golebiowski@laboratorium.ee>
 * Licensed under the MIT license.
 */

'use strict';

// Gruntfile.js & tasks/*.js are the only non-transpiled files.
/* eslint-disable no-var, no-eval */

var assert = require('assert');

module.exports = function (grunt) {
    try {
        assert.strictEqual(eval('(() => 2)()'), 2);
        return require('../src/inline-images')(grunt);
    } catch (e) {
        return require('../dist/src/inline-images')(grunt);
    }
};
