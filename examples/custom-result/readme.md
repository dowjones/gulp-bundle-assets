# Custom Results

You can define, down to each bundle file line, how your `bundle.result.json` is created. Either use the built in 
result type functions or use a custom one to change or add attributes.

### Built-in

Options: `jsx | html | plain`

Default: `html`

```js
bundle: {
  base: {
    scripts: './scripts/base.js',
    styles: './styles/base.css',
    options: {
      rev: false,
      uglify: false, // this has to be false, otherwise uglify will blow up when trying to parse a .jsx file
      result: {
        type: {
          scripts: 'jsx',
          styles: 'plain'
        }
      }
    }
  }
}
```

### External

Your function can do whatever you want, just make sure it has the following api

Param: `{string} path - url path to the bundle`

Returns: `{string} result line for this bundle`

```js
bundle: {
  custom: {
    scripts: './scripts/custom.js',
    styles: './styles/custom.css',
    options: {
      rev: false,
      result: {
        type: {
          scripts: function xJavascript(path) {
            return "<script async src='" + path + "' type='application/javascript'></script>";
          },
          styles: function html(path) {
            return "<link href='" + path + "' type='text/html'/>";
          }
        }
      }
    }
  }
}
```
