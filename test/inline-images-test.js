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
const detectJsonIndent = require('detect-json-indent');

const readFile = path => fs.readFileSync(`${ __dirname }/${ path }`, {encoding: 'utf8'});
const readTmp = filename => readFile(`tmp/${ filename }`);
const readFix = filename => readFile(`fixtures/${ filename }`);

describe('grunt-inline-images', () => {
    it('should inline images from toInline & change URLs to about:blank from toDiscard', () => {
        expect(JSON.parse(readTmp('actual1.json'))).to.eql(JSON.parse(readFix('expected1.json')));
        expect(JSON.parse(readTmp('actual2.json'))).to.eql(JSON.parse(readFix('expected1.json')));
    });
    it('should respect the indent style', () => {
        expect(detectJsonIndent(readTmp('actual1.json'))).to.be('   ');
        expect(detectJsonIndent(readTmp('actual2.json'))).to.be('\t');
    });
});
