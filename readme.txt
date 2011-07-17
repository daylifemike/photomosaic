=== PhotoMosaic WP Gallery Shortcode === 
Plugin Name: PhotoMosaic
Plugin URI: http://codecanyon.net/item/photomosaic-for-wordpress/243422
Description: A image gallery plugin for WordPress. 
Author: makfak
Author URI: http://www.codecanyon.net/user/makfak
Version: 1.3

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