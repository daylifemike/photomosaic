### What's the difference between "Global Settings" and "Shortcode Settings"? {.title}

Any configurations made on the PhotoMosaic options page (PhotoMosaic > Global Settings) apply to all of your PhotoMosaics.  Any time you use the `[photomosaic]` shortcode, your "Global Settings" will be applied.

Your PhotoMosaics can also be configured on the shortcode itself. These "Shortcode Settings" override your "Global Settings" making it easy to have a certain mosaic behave differently than others.

#### A simple example:

You want all of your mosaics to display in 6 columns so you set "Columns" to "6" globally (PhotoMosaic > Global Settings > Columns = 6).  Now any `[photomosaic]` will have 6 columns.

But there's one very specific mosaic that you'd like to display in 3 columns. Simply set "columns" on the shortcode (`[photomosaic columns="3"]`) and this mosaic (and only this mosaic) will display in 3 columns.

#### A complex example:

I receive a lot of support requests for the following:

> I have a Portfolio section.  On the homepage for that section I want to have a mosaic where clicking on the image takes the user to that portfolio item's page.  Then, on that item's page, I want another mosaic where clicking on the image opens a bigger version of the image in a lightbox.

Since the mosaic on the Portfolio homepage will be the one-off, it's best to configure the "Global Settings" for the Portfolio Item mosaics.  In this case that means that we want to configure our "Global Settings" to open the image in a lightbox when clicked:

- Behavior > Image Links = check
- Behavior > Link to URL = uncheck
- Lightbox > Use Default Lightbox = check

Now, on the Portfolio homepage mosaic, we simply override the specific settings we want to change:

- turn on "Link to URL"
- turn off "Use Default Lightbox"

Our shortcode should look like this: `[photomosaic link_to_url="1" lightbox="0"]`.

A full list of the shortcode settings can be found under the ["Inline Attributes"](#tab-inlineattrs){.combo-link} tab.