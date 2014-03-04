<?php
/**
 * GitHub Updater
 *
 * @package   GitHub_Updater
 * @author    Andy Fragen
 * @license   GPL-2.0+
 * @link      https://github.com/afragen/github-updater
 */

/*
    Z-Plugin Name:       GitHub Updater
    Z-Plugin URI:        https://github.com/afragen/github-updater
    Z-Description:       A plugin to automatically update GitHub or Bitbucket hosted plugins and themes into WordPress. Plugin class based upon <a href="https://github.com/codepress/github-plugin-updater">codepress/github-plugin-updater</a>. Theme class based upon <a href="https://github.com/WordPress-Phoenix/whitelabel-framework">Whitelabel Framework</a> modifications.
    Z-Version:           2.5.0
    Z-Author:            Andy Fragen
    Z-License:           GNU General Public License v2
    Z-License URI:       http://www.gnu.org/licenses/gpl-2.0.html
    Z-Domain Path:       /languages
    Z-Text Domain:       github-updater
    Z-GitHub Plugin URI: https://github.com/afragen/github-updater
    Z-GitHub Branch:     master
*/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Load base classes and Launch
if ( is_admin() && ( ! defined( 'DOING_AJAX' ) || ! DOING_AJAX ) ) {
    require_once 'includes/class-github-updater.php';
	require_once 'includes/class-github-api.php';
	require_once 'includes/class-bitbucket-api.php';
	require_once 'includes/class-plugin-updater.php';
	require_once 'includes/class-theme-updater.php';
	new GitHub_Plugin_Updater;
	new GitHub_Theme_Updater;
}
