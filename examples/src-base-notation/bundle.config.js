module.exports = {
  bundle: {
    main: {
      js: {
        src: './hide_this_folder_path/content/my.js',
        base: './hide_this_folder_path'
      },
      css: [
        {
          src: './hide_this_folder_path/content/main.css',
          base: './hide_this_folder_path/content'
        },
        {
          src: './hide_this_folder_path/content/t.css',
          base: './hide_this_folder_path'
        }
      ],
      resources: {
        src: [
          './hide_this_folder_path/content/bomb_icon.png',
          './hide_this_folder_path/content/rebel_icon.png'
        ],
        base: './hide_this_folder_path'
      }
    }
  }
};