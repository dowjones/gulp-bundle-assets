module.exports = {
  copy: [
    './include_path/content/car_icon.png',
    {
      src: './include_path/content/lifering_icon.png'
    },
    {
      src: [
        './hide_this_folder_path/content/empire_icon.png',
        './hide_this_folder_path/content/rebel_icon.png'
      ],
      base: './hide_this_folder_path'
    },
    {
      src: './hide_this_folder_path/content/bomb_icon.png',
      base: 'hide_this_folder_path/content'
    },
    {
      src: './hide_this_folder_path/content/extinguisher_icon.png',
      base: './hide_this_folder_path/'
    }
  ]
};