/**
 * grunt-inline-images
 * https://github.com/EE/grunt-inline-images
 *
 * Author Michał Gołębiowski <michal.golebiowski@laboratorium.ee>
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    var httpSync = require('http-sync');

    function getRegexFromPattern(pattern) {
        return new RegExp('(\\\\"|")((?:http(?:s|):|)//(?:www\\.|)' + pattern + '[a-zA-Z0-9._?&=/\\-\\\\]+)(?:\\\\"|")',
            'g');
    }

    function getEncodedImage(url) {
        var request, response,
            urlParts = /([a-zA-Z]+):\/\/([a-zA-Z0-9._\-]+)(\/.*)/g.exec(url);
        if (!urlParts) {
            console.error('urlParts null!', url);
            return url; // in case of URL mismatch return current URL
        }
        grunt.log.writeln('Downloading started...', url);
        request = httpSync.request({
            method: 'GET',
            headers: {},
            body: '',

            protocol: urlParts[1] || 'http',
            host: urlParts[2],
            port: 80,
            path: urlParts[3],
        });
        request.setTimeout(10000, function () {
            console.error('Request timed out!');
            return url; // in case of network error return current URL
        });
        response = request.end();
        grunt.log.writeln('File downloaded!', url);
        return 'data:image/jpeg;base64,' + new Buffer(response.body).toString('base64');
    }

    function replaceMatchWithBase64(match, delimiter, url) {
        return delimiter + getEncodedImage(url) + delimiter;
    }

    function replaceMatchWithAboutBlank(match, delimiter) {
        return delimiter + 'about:blank' + delimiter;
    }

    grunt.registerMultiTask('inlineImages',
        'Change all URLs matching a pattern to inline base64 representations.',
        function () {
            var i, regex,
                options = this.options(),
                toInline = options.toInline || [],
                toDiscard = options.toDiscard || [];

            this.files.forEach(function (mapping) {
                mapping.src.forEach(function (path) {
                    grunt.log.writeln(' ***** Processing file: ' + path + ' ***** ');

                    var dest,
                        contents = grunt.file.read(path);

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

                    // Images are downloaded and inlined in base64 format.
                    for (i = 0; i < toInline.length; i++) {
                        regex = getRegexFromPattern(toInline[i]);
                        contents = contents.replace(regex, replaceMatchWithBase64);
                    }

                    // Write transformed contents back into the file.
                    grunt.file.write(dest, contents);
                    grunt.log.writeln(' ***** File: ' + path + ' processed; output written to: ' + dest + ' ***** ');
                });
            });
        }
    );
};
