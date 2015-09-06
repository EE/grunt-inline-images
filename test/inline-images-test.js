/**
 * grunt-inline-images
 * https://github.com/EE/grunt-inline-images
 *
 * Author Michał Gołębiowski <michal.golebiowski@laboratorium.ee>
 * Licensed under the MIT license.
 */

'use strict';

const fs = require('fs');
const expect = require('expect.js');

const readFile = path => fs.readFileSync(`${ __dirname }/${ path }`, {encoding: 'utf8'});
const readTmp = filename => readFile(`tmp/${ filename }`);
const readFix = filename => readFile(`fixtures/${ filename }`);

describe('grunt-inline-images', () => {
    it('should inline images from toInline & change URLs to about:blank from toDiscard', () => {
        expect(JSON.parse(readTmp('actual.json'))).to.eql(JSON.parse(readFix('expected.json')));
    });
});
