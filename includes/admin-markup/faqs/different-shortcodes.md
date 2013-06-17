### Which shortcode should I use? {.title}

PhotoMosaic currently supports 3 shortcodes:

- `[gallery template="photomosaic"]`
- `[gallery photomosaic="true"]`
- `[photomosaic]`

#### What's the difference?

All three support all of the attributes (id, ids, exclude, include, width, columns, etc.).  
See the ["Inline Attributes"](#tab-inlineattrs){.combo-link} tab for more info.  

All three support attached images (no id specified), images attached to another page (id="2"), and the list of IDs (ids="1,2,3,4,5").  
See [Where can I get step-by-step instructions for making a gallery](#stepbystep) for more detail.

All three work in every version of Wordpress >3.0.

Both `[gallery template="photomosaic"]` and `[gallery photomosaic="true"]` appear in the "Visual" editor as the `[gallery]` placeholder image.

If you're using Wordpress >3.5, you can set `[gallery template="photomosaic"]` in the Create Gallery editor window (just look for the "Template" option).

#### Why have 3 shortcodes that do the same thing?

The short answer: Backwards compatibility.

PhotoMosaic has been around for 5 versions of Wordpress and is constantly being updated to use the newest features.  The original `[photomosaic]` shortcode was replaced with `[gallery photomosaic="true"]` once the "post_gallery" filter was found (it's never been properly documented in the WP Codex).  With the release of WP v3.5 and the new Create Gallery flow, `[gallery template="photomosaic"]` was added so that PhotoMosaic could be set without having to manually edit the shortcode.

Old mosaics that still use the `[photomosaic]` shortcode will continue to work.