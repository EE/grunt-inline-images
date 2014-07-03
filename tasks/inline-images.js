/**
 * grunt-inline-images
 * https://github.com/EE/grunt-inline-images
 *
 * Author Michał Gołębiowski <michal.golebiowski@laboratorium.ee>
 * Licensed under the MIT license.
 */

'use strict';

var request = require('request'),
    Promise = require('bluebird');

module.exports = function (grunt) {
    function getRegexFromPattern(pattern) {
        return new RegExp('(\\\\"|")((?:http(?:s|):|)//(?:www\\.|)' + pattern + '[a-zA-Z0-9._?&=/\\-\\\\]+)(?:\\\\"|")',
            'g');
    }

    function getEncodedImage(url) {
        return new Promise(function (resolve, reject) {
            grunt.log.writeln('Downloading started...', url);
            request({
                url: url,
                encoding: null,
                timeout: 10000,
            }, function (error, response, body) {
                if (error) {
                    grunt.log.error('Error when downloading ' + url + ': ', error.message);
                    grunt.log.writeln('The URL will be kept intact');
                    grunt.log.writeln(error.stack);
                    return reject(error);
                }
                grunt.log.writeln('File downloaded!', url);
                resolve('data:' + (response.headers['content-type'] || 'image/jpeg') + ';base64,' +
                    new Buffer(body).toString('base64'));
            });
        });
    }

    function getBase64WrappedImage(match, delimiter, url) {
        return getEncodedImage(url)
            .then(function (encodedImage) {
                return delimiter + encodedImage + delimiter;
            })
            .catch(function () {
                // Fall back to the URL in case of an error.
                return match;
            });
    }

    function replaceMatchWithAboutBlank(match, delimiter) {
        return delimiter + 'about:blank' + delimiter;
    }

    grunt.registerMultiTask('inlineImages',
        'Change all URLs matching a pattern to inline base64 representations.',
        function () {
            var i, regex, match,
                done = this.async(),
                options = this.options(),
                toInline = options.toInline || [],
                toDiscard = options.toDiscard || [],
                globalJobs = [];

            this.files.forEach(function (mapping) {
                mapping.src.forEach(function (path) {
                    grunt.log.writeln(' ***** Processing file: ' + path + ' ***** ');

                    var dest,
                        contents = grunt.file.read(path),
                        jobs = [];

                    if (mapping.dest) {
                        // If destination file not provided, write back to the source file.
                        // NOTE: only one source file per destination is supported.
                        if (mapping.src.length !== 1) {
                            grunt.log.error('Only one source file per destination is supported!');
                            return false;
                        }
                        dest = mapping.dest;
                    } else {
                        dest = path;
                    }

                    // Some URLs are changed to "about:blank".
                    for (i = 0; i < toDiscard.length; i++) {
                        regex = getRegexFromPattern(toDiscard[i]);
                        contents = contents.replace(regex, replaceMatchWithAboutBlank);
                    }

                    function replaceMatchWithBase64(match) {
                        jobs.push(
                            getBase64WrappedImage(match[0], match[1], match[2])
                                .then(function (base64Image) {
                                    contents = contents.replace(match[0], base64Image);
                                })
                                .catch(function (err) {
                                    throw err;
                                })
                        );
                    }

                    // Images are downloaded and inlined in base64 format.
                    for (i = 0; i < toInline.length; i++) {
                        regex = getRegexFromPattern(toInline[i]);
                        match = regex.exec(contents);
                        while (match) {
                            replaceMatchWithBase64(match);
                            match = regex.exec(contents);
                        }
                    }

                    globalJobs.push(
                        Promise.all(jobs)
                            .then(function () {
                                // Write transformed contents back into the file.
                                grunt.file.write(dest, contents);
                                grunt.log.writeln(' ***** File: ' + path + ' processed; output written to: '
                                    + dest + ' ***** ');
                            })
                            .catch(function (err) {
                                throw err;
                            })
                    );
                });
            });

            Promise.all(globalJobs)
                .then(function () {
                    done();
                })
                .catch(function () {
                    done(false);
                });
        }
    );
};
