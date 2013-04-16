=== PhotoMosaic WP Gallery Shortcode === 
Plugin Name: PhotoMosaic
Plugin URI: http://codecanyon.net/item/photomosaic-for-wordpress/243422
Description: A image gallery plugin for WordPress. 
Author: makfak
Author URI: http://www.codecanyon.net/user/makfak
Version: 2.3

== Description ==

PhotoMosaic takes advantage of the built in gallery features of WordPress.
The plugin automatically adds any images attached to the post or page into the gallery.
Simply use the shortcode [photoMosaic] or [photomosaic] in the post or page content. 


== Installation == 

1. Upload '/photoMosaic/' to the '/wp-content/plugins/' directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Upload some photos to the post or page where you want the gallery
3. Place the shortcode [photomosaic] in your content
4. Additional information and configuration is on the PhotoMosaic Admin page 
    (/wp-admin/admin.php?page=photoMosaic.php)


== Changelog ==
= 2.3 =
* Enhancement: adds prevent_crop setting
* Enhancement: adds lightbox_rel setting
* Enhancement: adds lightbox_group setting
* Enhancement: updates jQuery to v1.9.1
* Enhancement: updates prettyPhoto to v3.1.5
* Deleted: new feature tour
* Bug Fix: NextGen link_to_url URLs no longer appear as captions
* Change: better form messages
* Change: form validation allows link_to_url and lightbox to coexist
* FAQ: adds Custom Lightbox question

= 2.2.5 =
* Bug Fix: corrects NextGen image size usage

= 2.2 =
* Refactor: major pattern overhaul
* Enhancement: new layout uses absolute positioning instead of fixed-markup
* Enhancement: actively responsive (resize your browser)
* Enhancement: new auto-columns logic is responsive and generates mosaics with larger images
* Enhancement: image-size selection is now actively responsive
* Enhancement: added "Order" setting
* Enhancement: added "Responsive Transition" setting
* Enhancement: "Columns" setting now accepts "0" and "auto" for auto-columns
* Deleted: removed "Force Order" setting (now part of "Order")
* Deleted: removed "Randomize" setting (now part of "Order")
* Deleted: removed "Auto-Columns" setting (now part of "Columns")
* Enhancement: added FAQ section
* Enhancement: added What's New section
* Enhancement: uses WP_Pointers to step through new features

= 2.1.3 =
* Bug Fix: blind attempt to fix reported console.log IE errors
* Bug Fix: transform-style:preserve-3d causes scaled images to be 'soft' in Safari
* Bug Fix: WP sometimes reports image dims as 0x0 - PM was failing to load these images
* Bug Fix: corrects regression that caused NextGen galleries not to load
* Enhancement: Improves column scaling logic; now much more forgiving of short mosaics.

= 2.1.2 =
* Bug Fix: corrects default shortcode behavior in WPv3.5
* Enhancement: updates to match new [gallery ids='...'] behavior (new in WPv3.5)
* Enhancement: detects best image size based on width of the columns

= 2.1.1 =
* Bug Fix: prevents loading spinner from disappearing early in Firefox
* Bug Fix: captions weren't properly escaped
* Bug Fix: corrects malformed JSON when is 'Link to URL' is used
* Bug Fix: auto-columns now accounts for galleries with less than 3 images (the default number of columns)
* Cleanup: whitespace
* Cleanup: valid JSON encoding of PHP-generated gallery JSON
* Cleanup: removes an unnecessary 'eval' for the JS
* Demo: corrects 'random' param
* Demo: Error messages print (better to show an error than nothing at all)
* Proofing: adds escaping to image descriptions

= 2.1 =
* Refactor: moved to WP 'init' event (should eliminate some Debug statements)
* Refactor: moved from "attribute_escape" (deprecated in 2.8) to "esc_attr"
* Refactor: made things much more object-y

= 2.0 =
* Enhancement: significant increase to loading performance
* Enhancement: significant decrease in page memory usage
* Enhancement: now uses WP/NextGen thumbnails for mosaic images
* Enhancement: adds option for a CSS transition to each images as it loads
* Enhancement: CSS bulletproofing - should prevent a number of inheritance issues
* Bug Fix: multiple galleries shoud no longer swap places or exchange images

= 1.9 =
* Refactor: merges PhotoMosaic (WP) and PhotoMosaic (JS)

= 1.8 =
* Enhancement: moves to PhotoMosaic (JS) v1.7.4

= 1.7 =
* Enhancement: updates jQuery requirements to 1.7+ (includes 1.8.2)
* Changed: custom jQuery namespace changed to "JQPM"

= 1.6 =
* Enhancement: adds option to Center gallery

= 1.5 =
* Enhancement: improved "auto_col" results
* Deleted: removed "ideal_width" option - the new "auto_col" logic produces better results w/o

= 1.4 =
* Enhancement: better adherence to WP Plugin best-practices
* Enhancement: redesigned Options / Doc - hopefully people will read them now

= 1.3 =
* Enhancement: adds "loading gallery" spinner option
* Enhancement: stronger CSS reset
* Bug Fix: corrects jQuery context bug that was effecting Custom Lightbox behavior
* Bug Fix: prevents conflicts with other jQuery instances by adding a super-specific namespace
* Bug Fix: corrects "Link as URL" for WP and NextGen galleries

= 1.2.5 =
* Bug Fix: corrects a bug that caused images to display that aren't in the specified gallery
* Bug Fix: corrects a bug that prevented the lightbox from being bound correctly

= 1.2 =
* Enhancement: adds NextGallery support
* Enhancement: adds Widget support
* Enhancement: adds Template Tag support
* Enhancement: adds the ability to use a custom lightbox
* Enhancement: adds ability to have the same gallery appear multiple times on the same page
* Enhancement: moves to PhotoMosaic (JS) v1.6 

= 1.1 =
* Bug Fix: corrects a bug that sometimes prevented the gallery from displaying (PHP 1.1)
* Enhancement: add "link_to_url" option
* Enhancement: add "external_links" option
* Enhancement: add "auto_columns" option
* Enhancement: add "ideal_column_width" option (used with 'auto_columns')
* Enhancement: moves to PhotoMosaic (JS) v1.5

= 1.0 =
* Initial Release