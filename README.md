# grunt-inline-images

> Change all URLs matching a pattern to inline base64 representations or about:blank.

[![Travis build Status](https://travis-ci.org/EE/grunt-inline-images.svg?branch=master)](https://travis-ci.org/EE/grunt-inline-images)
[![AppVeyor build status](https://ci.appveyor.com/api/projects/status/yirkyol8q8ikqlft/branch/master?svg=true)](https://ci.appveyor.com/project/mzgol/grunt-inline-images/branch/master)
[![Version](https://img.shields.io/npm/v/grunt-inline-images.svg?style=flat-square)](http://npm.im/grunt-inline-images)
[![Downloads](https://img.shields.io/npm/dm/grunt-inline-images.svg?style=flat-square)](http://npm-stat.com/charts.html?package=grunt-inline-images)
[![MIT License](https://img.shields.io/npm/l/grunt-inline-images.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-inline-images --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-inline-images');
```

## The "inlineImages" task

### Overview
The `inlineImages` task job is to:
* download and inline (base64-encoded) images from URLs matching one of `toInline` patterns
* change URLs matching one of `toDiscard` patterns to `about:blank`

In this way, if one has an example JSON file with mock data, after such a transformation it no longer refers to
external files which can help in unit testing since tests won't trigger HTTP requests, making them faster and
not rely on active internet connection.

In your project's Gruntfile, add a section named `inlineImages` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    inlineImages: {
        options: {
            // Task-specific options go here.
        },
        your_target: {
            // Target-specific file lists and/or options go here.
        },
    },
})
```

#### Options

The `inlineImages` task accepts a couple of options:

```js
{
    toInline: [], // beginnings of URLs to images to be inlined in a base64 representation
    toDiscard: [], // beginnings of URLs to be changed to "about:blank"
}
```

### Usage Examples

```js
'use strict';

grunt.initConfig({
    inlineImages: {
        all: {
            options: {
                toInline: [ // beginnings of URLs to images to be inlined in a base64 representation
                    'example.com/',
                    'raw\\.githubusercontent\\.com/',
                ],
                toDiscard: [ // beginnings of URLs to be changed to "about:blank"
                    '(player\\.|)vimeo\\.com/',
                    'youtube\\.com/',
                    'facebook\\.com/',
                ],
            },
            files: {
                'test/tmp/actual.json': ['test/fixtures/input.json'],
            },
        },
    },
});

grunt.loadNpmTasks('grunt-inline-images');
```

You can see an example input file in [test/fixtures/input.json](test/fixtures/input.json) and the transformed output file in [test/fixtures/expected.json](test/fixtures/expected.json).

## Supported Node.js versions
This project aims to support all Node.js LTS versions in the "active" phase (see [LTS README](https://github.com/nodejs/LTS/blob/master/README.md) for more details) as well as the latest stable Node.js. Today that means Node.js 0.12 & 4.x.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2013 Laboratorium EE. Licensed under the MIT license.
