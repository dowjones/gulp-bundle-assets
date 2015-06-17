module.exports = {
  bundle: {
    'custom/path/structure/bundle-name': { // this allows us to nest a bundle within a custom folder structure
      scripts: './content/*.js'
    },
    'other/custom/path/my-bundle-name': {
      styles: './content/*.css'
    }
  }
};