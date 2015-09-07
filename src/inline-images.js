/**
 * grunt-inline-images
 * https://github.com/EE/grunt-inline-images
 *
 * Author Michał Gołębiowski <michal.golebiowski@laboratorium.ee>
 * Licensed under the MIT license.
 */

'use strict';

const request = require('request');
const urlRegex = require('url-regex');
const detectJsonIndent = require('detect-json-indent');

module.exports = grunt => {
    const getRegexFromPattern = pattern => new RegExp(`(?:http(?:s|):|)//(?:www\\.|)${ pattern }`);

    const isUrl = string => typeof string === 'string' && urlRegex({exact: true}).test(string);

    const getEncodedImage = url =>
        new Promise((resolve, reject) => {
            grunt.log.writeln('Downloading started...', url);
            request({
                url,
                encoding: null,
                timeout: 10000,
            }, (error, response, body) => {
                if (error) {
                    grunt.log.error(`Error when downloading ${ url }: ${ error.message }`);
                    grunt.log.writeln('The URL will be kept intact');
                    grunt.log.writeln(error.stack);
                    return reject(error);
                }
                grunt.log.writeln('File downloaded!', url);
                resolve(`data:${ response.headers['content-type'] || 'image/jpeg' };base64,${
                    new Buffer(body).toString('base64') }`);
            });
        });

    // TODO switch to destructuring when Node 5 arrives.
//    const transformObject = ({object, toInline, toDiscard, jobs}) => {
    const transformObject = params => {
        const object = params.object;
        const toInline = params.toInline;
        const toDiscard = params.toDiscard;
        const jobs = params.jobs;

        const transform = obj => transformObject({
            object: obj,
            toInline, toDiscard, jobs,
        });

        const newObject = {};
        for (const key in object) {
            const value = object[key];
            if (typeof value === 'object' && value != null) {
                newObject[key] = transform(value);
            } else if (isUrl(value)) {
                for (const pattern of toDiscard) {
                    if (getRegexFromPattern(pattern).test(value)) {
                        newObject[key] = 'about:blank';
                        break;
                    }
                }
                for (const pattern of toInline) {
                    if (getRegexFromPattern(pattern).test(value)) {
                        jobs.push(
                            getEncodedImage(value)
                                .then(encodedValue => {
                                    newObject[key] = encodedValue;
                                })
                        );
                        // Don't download the same file twice.
                        break;
                    }
                }
            } else {
                newObject[key] = value;
            }
        }
        return newObject;
    };

    grunt.registerMultiTask('inlineImages',
        'Change all URLs matching a pattern to inline base64 representations.',
        function () {
            const done = this.async();

            // TODO switch to destructuring when Node 5 arrives.
//            const {toInline = [], toDiscard = []} = this.options();
            const options = this.options();
            const toInline = options.toInline || [];
            const toDiscard = options.toDiscard || [];

            const globalJobs = [];

            this.files.forEach(mapping => {
                mapping.src.forEach(path => {
                    grunt.log.writeln(` ***** Processing file: ${ path } ***** `);

                    let dest;
                    const contents = grunt.file.read(path);
                    const indent = detectJsonIndent(contents);
                    const object = JSON.parse(contents);
                    const jobs = [];

                    if (mapping.dest) {
                        if (mapping.src.length !== 1) {
                            grunt.log.error('Only one source file per destination is supported!');
                            return false;
                        }
                        dest = mapping.dest;
                    } else {
                        // If destination file not provided, write back to the source file.
                        dest = path;
                    }

                    const newObject = transformObject({object, toInline, toDiscard, jobs});

                    globalJobs.push(
                        Promise.all(jobs)
                            .then(() => {
                                // Write transformed contents back into the file.
                                grunt.file.write(dest, JSON.stringify(newObject, null, indent));
                                grunt.log.writeln(` ***** File: ${
                                    path } processed; output written to: ${
                                    dest } ***** `);
                            })
                    );
                });
            });

            Promise.all(globalJobs)
                .then(() => {
                    done();
                })
                .catch(() => {
                    done(false);
                });
        }
    );
};
