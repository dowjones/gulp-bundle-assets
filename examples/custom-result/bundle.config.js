// default result type is "html"

module.exports = {
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
            styles: 'html'
          }
        }
      }
    },
    default: {
      scripts: './scripts/default.js',
      styles: './styles/default.css',
      options: {
        rev: false,
        result: {
          type: 'html' // applies to both scripts and styles
        }
      }
    },
    plain: {
      scripts: './scripts/plain.js',
      styles: './styles/plain.css',
      options: {
        rev: false,
        result: {
          type: 'plain'
        }
      }
    },
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
};