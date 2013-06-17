## Shortcodes {.subhead .first}

A PhotoMosaic shortcode can be used on any post or page to display images in the Wordpress Media Library.

- `[gallery template="photomosaic"]`
- `[gallery photomosaic="true"]`
- `[photomosaic]`

There are three ways to specify the images a shortcode should use:

1. `[photomosaic ids="1,2,3,4,5"]` : a list of images to be used (the result of the Create Gallery flow) *(requires WP v3.5+)*
2. `[photomosaic id="1"]` : the ID of a post/page that has attached images that should be used
3. `[photomosaic]` : when no ID or IDs attributes are present PhotoMosaic assumes there are images attached to the current post/page *(eg: on page ID = 5 --> `[photomosaic]` === `[photomosaic id="5"]`)*

More information can be found in the [FAQs](#tab-faq){.combo-link}.


## Template Tag {.subhead}

PhotoMosaic offers a Template Tag (`wp_photomosaic()`).  This can be added to your theme's template files to automatically add a gallery to every page.

The PhotoMosaic template tag accepts an array of the attributes (listed below).  An Example:

    $atts = array(
        'id' => 1,
        'columns' => 3
    );
    wp_photomosaic($atts);


## Sidebar Widget {.subhead}

A PhotoMosaic shortcode can be placed in a standard Text Widget.  Because Widgets aren't posts or pages they can't have attached images.  This means that you'll need to specify an ID for a post/page with attached images to be used, or a list of image IDs to be used.

While the Create Gallery flow is unavailable on the Widgets page, you can create a gallery on any post/page and then simply copy/paste the resulting shortcode into your Text Widget.
