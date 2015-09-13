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

var semver = require('semver');

module.exports = function (grunt) {
    if (semver(process.version).major >= 4) {
        return require('../src/inline-images')(grunt);
    }
    return require('../dist/src/inline-images')(grunt);
};
