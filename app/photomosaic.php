<?php

/**
 * Plugin Name:       PhotoMosaic for WordPress
 * Plugin URI:        http://codecanyon.net/item/photomosaic-for-wordpress/243422?ref=makfak
 * Description:       Adds a new display type for your WordPress and NextGen galleries. See the settings page for examples and instructions.
 * Version:           2.12.4
 * Author:            makfak
 * Author URI:        http://www.codecanyon.net/user/makfak?ref=makfak
 * Text Domain:       photomosaic
 * Domain Path:       /languages
 * GitHub Plugin URI: daylifemike/photomosaic-for-wordpress
 */

if ( ! defined( 'WPINC' ) ) { die; }

// function activate_plugin_name() {
//     require_once plugin_dir_path( __FILE__ ) . 'includes/class-photomosaic-activator.php';
//     Photomosaic_Activator::activate();
// }

// function deactivate_plugin_name() {
//     require_once plugin_dir_path( __FILE__ ) . 'includes/class-photomosaic-deactivator.php';
//     Photomosaic_Deactivator::deactivate();
// }

// register_activation_hook( __FILE__, 'activate_plugin_name' );
// register_deactivation_hook( __FILE__, 'deactivate_plugin_name' );

require plugin_dir_path( __FILE__ ) . 'includes/class-photomosaic.php';

function run_photomosaic_for_wordpress() {
    global $photomosaic;
    $photomosaic = new Photomosaic();
    $photomosaic->run();
}
run_photomosaic_for_wordpress();

// Template Tag
function wp_photomosaic( $atts ){
    global $photomosaic;

    if (!is_admin()) {
        echo $photomosaic->shortcode( $atts );
    }
}
