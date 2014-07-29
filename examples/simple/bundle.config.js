module.exports = {
  bundle: {
    main: {
      scripts: [
        './content/js/foo.js',
        './content/js/baz.js'
      ],
      styles: [
        './content/**/*.css'
      ],
      options: {
        rev: false
      }
    }
  },
  copy: './content/**/*.{png,svg}'
};