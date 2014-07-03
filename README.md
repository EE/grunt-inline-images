# grunt-inline-images

> Change all URLs matching a pattern to inline base64 representations.

[![Build Status](https://travis-ci.org/EE/grunt-inline-images.svg?branch=master)](https://travis-ci.org/EE/grunt-inline-images)
[![Build status](https://ci.appveyor.com/api/projects/status/yirkyol8q8ikqlft/branch/master)](https://ci.appveyor.com/project/EE/grunt-inline-images)
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

TODO

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Laboratorium EE. Licensed under the MIT license.
