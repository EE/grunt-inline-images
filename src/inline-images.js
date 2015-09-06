/**
 * grunt-inline-images
 * https://github.com/EE/grunt-inline-images
 *
 * Author Michał Gołębiowski <michal.golebiowski@laboratorium.ee>
 * Licensed under the MIT license.
 */

'use strict';

const request = require('request');

module.exports = grunt => {
    const getRegexFromPattern = pattern =>
        new RegExp(
            `(\\\\"|")((?:http(?:s|):|)//(?:www\\.|)${
                pattern }[a-zA-Z0-9._?&=/\\-\\\\]+)(?:\\\\"|")`,
            'g');

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

    const getBase64WrappedImage = (match, delimiter, url) =>
        getEncodedImage(url)
            .then(encodedImage => `${ delimiter }${ encodedImage }${ delimiter }`)
            // Fall back to the URL in case of an error.
            .catch(() => match);

    const replaceMatchWithAboutBlank = (_match, delimiter) =>
        `${ delimiter }about:blank${ delimiter }`;

    grunt.registerMultiTask('inlineImages',
        'Change all URLs matching a pattern to inline base64 representations.',
        function () {
            let regex, match;
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
                    let contents = grunt.file.read(path);
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

                    // Some URLs are changed to "about:blank".
                    for (const pattern of toDiscard) {
                        regex = getRegexFromPattern(pattern);
                        contents = contents.replace(regex, replaceMatchWithAboutBlank);
                    }

                    // TODO switch to destructuring when Node 5 arrives.
//                    const replaceMatchWithBase64 = ([match, delimiter, url]) => {
                    const replaceMatchWithBase64 = params => {
                        const match = params[0];
                        const delimiter = params[1];
                        const url = params[2];
                        jobs.push(
                            getBase64WrappedImage(match, delimiter, url)
                                .then(base64Image => {
                                    contents = contents.replace(match, base64Image);
                                })
                        );
                    };

                    // Images are downloaded and inlined in base64 format.
                    for (const pattern of toInline) {
                        regex = getRegexFromPattern(pattern);
                        match = regex.exec(contents);
                        while (match) {
                            replaceMatchWithBase64(match);
                            match = regex.exec(contents);
                        }
                    }

                    globalJobs.push(
                        Promise.all(jobs)
                            .then(() => {
                                // Write transformed contents back into the file.
                                grunt.file.write(dest, contents);
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
