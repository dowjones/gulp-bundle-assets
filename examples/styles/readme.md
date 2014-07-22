# Support for `styles`

Currently `gulp-bundle-assets` supports straight css files and/or [`.less`](http://lesscss.org/) compilation, e.g.

```js
// bundle.config.js
module.exports = {
  bundle: {
    main: {
      styles: [
        'a.css',
        'b.less'
      ]
    },
    second: {
      styles: 'c.less'
    },
    third: {
      styles: 'content/**/*.less'
    }
  }
}
```

[Sass](http://sass-lang.com/) compilation is currently not supported but could easily be added via a PR ;)