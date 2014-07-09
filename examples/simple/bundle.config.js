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
      resources: './content/**/*.{png,svg}'
    }
  },
  dest: './public'
};