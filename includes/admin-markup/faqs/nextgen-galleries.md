### How does PhotoMosaic work with NextGen Galleries {.title}

PhotoMosaic is intended to be an extension of the built-in Wordpress Gallery system, but it has two attributes that allow it to display NextGen content.

- `nggid` - NextGen **Gallery** ID -- `[photomosaic nggid="1"]`
- `ngaid` - NextGen **Album** ID -- `[photomosaic ngaid="1"]`

Both display all of the images in the gallery/album in the order that NextGen specifies.  All of the images in all of the galleries in an Album are shown in a single PhotoMosaic.  If you have an album that consists of 2 galleries, each with 10 images - `ngaid` will show all 20 images sorted first by the order of the galleries in the album, and then by the order of the images in each gallery.

To change the order that your NextGen images appear in a PhotoMosaic is to sort the NextGen gallery (Manage Gallery > [select a gallery] > Sort Gallery).  The Options > Gallery > Sort* are not passed to PhotoMosaic and will not be honored.