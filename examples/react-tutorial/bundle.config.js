module.exports = {
  bundle: {
    base: {
      scripts: './scripts/example.js',
      styles: './css/base.css',
      options: {
        rev: false,
        uglify: false,
        result: {
          type: {
            scripts: 'jsx',
            styles: 'html'
          }
        }
      }
    }
  }
};