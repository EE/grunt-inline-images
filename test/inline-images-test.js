/**
 * grunt-inline-images
 * https://github.com/EE/grunt-inline-images
 *
 * Author Michał Gołębiowski <michal.golebiowski@laboratorium.ee>
 * Licensed under the MIT license.
 */

describe('grunt-inline-images', function () {
    'use strict';

    var grunt = require('grunt');

    it('should inline images from toInline and change their URLs to about:blank from toDiscard', function () {
        var expected = grunt.file.read('test/tmp/actual.json'),
            actual = grunt.file.read('test/fixtures/expected.json');
        expected.should.equal(actual);
    });
});
