module.exports = {
  bundle: {
    main: {
      scripts: [
        './content/js/one.js',
        './content/js/two.js'
      ],
      styles: [
        './content/**/*.css'
      ],
      resources: './content/**/*.{png}'
    }
  },
  dest: './public'
};