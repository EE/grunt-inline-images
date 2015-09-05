/**
 * grunt-inline-images
 * https://github.com/EE/grunt-inline-images
 *
 * Author Michał Gołębiowski <michal.golebiowski@laboratorium.ee>
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    expect = require('expect.js');

function readFile(path) {
    return fs.readFileSync(path, {encoding: 'utf8'});
}

function readTmp(filename) {
    return readFile('test/tmp/' + filename);
}

function readFix(filename) {
    return readFile('test/fixtures/' + filename);
}

describe('grunt-inline-images', function () {
    it('should inline images from toInline and change their URLs to about:blank from toDiscard',
            function () {
        expect(JSON.parse(readTmp('actual.json'))).to.eql(JSON.parse(readFix('expected.json')));
    });
});
