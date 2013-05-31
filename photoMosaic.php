<?php
/*
Plugin Name: PhotoMosaic
Plugin URI: http://codecanyon.net/item/photomosaic-for-wordpress/243422
Description: A image gallery plugin for WordPress. See the options page for examples and instructions.
Author: makfak
Author URI: http://www.codecanyon.net/user/makfak
Version: 2.3.4
*/

if(preg_match('#' . basename(__FILE__) . '#', $_SERVER['PHP_SELF'])) { 
    die('Illegal Entry');
}

add_action('init', array('PhotoMosaic', 'init'));

class PhotoMosaic {

    // http://daringfireball.net/2010/07/improved_regex_for_matching_urls
    public static $URL_PATTERN = "(?i)\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))";

    function version () {
        return '2.3.4';
    }

    function init() {
        $options = get_option('photomosaic_options');

        add_filter( 'widget_text', 'do_shortcode' ); // Widget
        // add_filter( 'the_posts', array( __CLASS__, 'the_posts' ) ); // :: conditionally enqueue JS & CSS
        add_filter( 'post_gallery', array( __CLASS__, 'post_gallery' ), 1337, 2 ); // [gallery photomosaic="true"]

        add_action( 'admin_menu', array('PhotoMosaic', 'adminPage') );
        add_action( 'wp_ajax_photomosaic_whatsnew', array('PhotoMosaic', 'ajaxHandler') );

        wp_register_script( 'photomosaic', plugins_url('/js/jquery.photoMosaic.js', __FILE__ ));
        wp_enqueue_script('photomosaic');

        wp_enqueue_style( 'photomosaic_base_css', plugins_url('/css/photoMosaic.css', __FILE__ ));

        if (!is_admin()) {
            if($options['lightbox']) {
                wp_enqueue_style( 'photomosaic_prettyphoto_css', plugins_url('/includes/prettyPhoto/prettyPhoto.css', __FILE__ ));

                // for testing - comment out in jquery.photoMosaic.js
                // wp_enqueue_script( 'photomosaic_prettyphoto_js', plugins_url('/includes/prettyPhoto/jquery.prettyPhoto.js', __FILE__ ), array('photomosaic'));
            }

            // for testing - comment out in jquery.photoMosaic.js
            // wp_enqueue_script( 'photomosaic_jstween_js', plugins_url('/includes/jstween-1.1.js', __FILE__ ), array('photomosaic'));

            add_shortcode( 'photoMosaic', array('PhotoMosaic', 'shortcode') );
            add_shortcode( 'photomosaic', array('PhotoMosaic', 'shortcode') );

        } else if (isset($_GET['page'])) { 
            if ($_GET['page'] == "photoMosaic.php") {
                wp_enqueue_script( 'photomosaic_admin_js', plugins_url('/js/jquery.photoMosaic.wp.admin.js', __FILE__ ), array('photomosaic'));
            }
        }
    }

    function getOptions() {
        $defaults = array(
            'padding' => 2,
            'columns' => 0,
            'width' => 0,
            'height' => 0,
            'links' => true,
            'order' => 'rows',
            'link_to_url' => false,
            'external_links' => false,
            'center' => true,
            'prevent_crop' => false,
            'show_loading' => false,
            'loading_transition' => 'fade',
            'responsive_transition' => true,
            'lightbox' => true,
            'lightbox_rel' => 'pmlightbox',
            'lightbox_group' => true,
            'custom_lightbox' => false,
            'custom_lightbox_name' => '',
            'custom_lightbox_params' => '{}'
        );

        $options = get_option('photomosaic_options');

        if (!is_array($options)) {
            $options = $defaults;
            update_option('photomosaic_options', $options);
        } else {
            $options = $options + $defaults; // "+" means dup keys aren't overwritten
        }

        return $options;
    }

    function adjustDeprecatedOptions($options) {
        // 'random' & 'force_order' - v2.2
        if (array_key_exists('random', $options)) {
            if ($options['random']) {
                $options['order'] = 'random';
            }
            unset($options['random']);
        }
        if (array_key_exists('force_order', $options)) {
            if ($options['force_order']) {
                $options['order'] = 'columns';
            }
            unset($options['force_order']);
        }

        // 'columns' & 'auto_columns' merged - v2.2
        if (array_key_exists('auto_columns', $options)) {
            if ($options['auto_columns']) {
                $options['columns'] = 0;
            }
            unset($options['auto_columns']);
        }

        // 'has_taken_tour' has been removed - v2.3
        if (array_key_exists('has_taken_tour', $options)) {
            unset($options['has_taken_tour']);
        }

        update_option('photomosaic_options', $options);

        return $options;
    }

    function adminPage() {
        if(isset($_POST['photomosaic_save'])) {
            $options = PhotoMosaic::getOptions();

            foreach ($options as $k => $v) {
                if ( !array_key_exists($k, $_POST) ) {
                    if (intval($options[$k]) || empty($options[$k])) {
                        $_POST[$k] = 0;
                    } else {
                        $_POST[$k] = $options[$k];
                    }
                }
                if (is_string($_POST[$k])) {
                    $options[$k] = trim( stripslashes( $_POST[$k] ) );
                } else {
                    $options[$k] = $_POST[$k];
                }
            }

            update_option('photomosaic_options', $options);

            $_POST['message'] = "Settings Updated";
        }

        add_menu_page('PhotoMosaic', 'PhotoMosaic', 'update_plugins', basename(__FILE__), array('PhotoMosaic', 'renderAdminPage'));
    }

    function ajaxHandler () {
        // not currently being used
        $options = PhotoMosaic::getOptions();
        die(json_encode($options));
    }

    function shortcode( $atts ) {
        global $post;
        $post_id = intval($post->ID);
        $base = array(
            'id'        => $post_id,
            'include'   => '',
            'exclude'   => '',
            'ids'       => ''
        );
        $options = PhotoMosaic::getOptions();
        $options = wp_parse_args($base, $options);
        $settings = shortcode_atts($options, $atts);

        $auto_settings = array(
            'height', 'width', 'columns'
        );
        $bool_settings = array(
            'center', 'prevent_crop', 'links', 'external_links', 'show_loading',
            'responsive_transition', 'lightbox', 'custom_lightbox', 'lightbox_group'
        );

        foreach ( $auto_settings as $key ) {
            if(intval($settings[$key]) == 0){
                $settings[$key] = "'auto'";
            } else {
                $settings[$key] = intval($settings[$key]);
            }
        }

        foreach ( $bool_settings as $key ) {
            if(intval($settings[$key])){
                $settings[$key] = "true";
            } else {
                $settings[$key] = "false";
            }
        }

        $unique = floor(((time() + rand(21,40)) * rand(1,5)) / rand(1,5));

        $output_buffer = '
            <script type="text/javascript" data-photomosaic-gallery="true">
                var PMalbum'.$unique.' = [';

        if ( !empty($atts['nggid']) ) {
            $output_buffer .= PhotoMosaic::galleryFromNextGen($atts['nggid'], $settings['link_to_url'], 'gallery');
        } else if ( !empty($atts['ngaid']) ) {
            $output_buffer .= PhotoMosaic::galleryFromNextGen($atts['ngaid'], $settings['link_to_url'], 'album');
        } else {
            $output_buffer .= PhotoMosaic::galleryFromWP($settings['id'], $settings['link_to_url'], $settings['include'], $settings['exclude'], $settings['ids']);
        }

        $output_buffer .='];
            </script>
            <script type="text/javascript" data-photomosaic-call="true">';

        $output_buffer .='
                JQPM(document).ready(function($) {
                    $("#photoMosaicTarget'.$unique.'").photoMosaic({
                        gallery: PMalbum'.$unique.',
                        padding: '. intval($settings['padding']) .',
                        columns: '. $settings['columns'] .',
                        width: '. $settings['width'] .',
                        height: '. $settings['height'] .',
                        center: '. $settings['center'] .',
                        prevent_crop: '. $settings['prevent_crop'] .',
                        links: '. $settings['links'] .',
                        external_links: '. $settings['external_links'] .',
                        show_loading: '. $settings['show_loading'] .',
                        loading_transition: "'. $settings['loading_transition'] .'",
                        responsive_transition: '. $settings['responsive_transition'] .',
                        modal_name: "' . $settings['lightbox_rel'] . '",
                        modal_group: ' . $settings['lightbox_group'] . ',
            ';

        $output_buffer .='
                        sizes: {
                            thumbnail: '. get_option("thumbnail_size_w") .',
                            medium: '. get_option("medium_size_w") .',
                            large: '. get_option("large_size_w") .'
                        },
        ';

        if( $settings['lightbox'] == 'true' || $settings['custom_lightbox'] == 'true' ) {
            if( $settings['lightbox'] == 'true' ) {
                $output_buffer .='
                        modal_ready_callback : function($photomosaic){
                            $("a[rel^=\''.$settings['lightbox_rel'].'\']", $photomosaic).prettyPhoto({
                                overlay_gallery: false,
                                slideshow: false,
                                theme: "pp_default",
                                deeplinking: false,
                                show_title: false,
                                social_tools: ""
                            });
                        },
                ';
            } elseif ( $settings['custom_lightbox'] == 'true' ) {
                $output_buffer .='
                        modal_ready_callback : function($photomosaic){
                            jQuery("a[rel^=\''.$settings['lightbox_rel'].'\']", $photomosaic).'.$settings['custom_lightbox_name'].'('.$settings['custom_lightbox_params'].');
                        },
                ';
            }
        }

        $output_buffer .='
                        order: "'. $settings['order'] .'"
                    });
                });
            </script>
            <div id="photoMosaicTarget'.$unique.'"></div>';

        return preg_replace('/\s+/', ' ', $output_buffer);
    }

    function galleryFromWP($id, $link_to_url, $include, $exclude, $ids) {
        global $wp_version;

        $output_buffer = '';
        $common_params = array(
            'post_status' => 'inherit',
            'post_type' => 'attachment',
            'post_mime_type' => 'image',
            'order' => 'asc',
            'orderby' => 'menu_order'
        );
        $_attachments = array();
        $attachments = array();

        // IDs are an explicit list -- ignore all the other things
        if ( !empty($ids) ) {
            $params = array_merge($common_params, array(
                'include' => preg_replace( '/[^0-9,]+/', '', $ids ),
                'orderby' => 'post__in'
            ));
            $_attachments = get_posts( array_merge($common_params, $params) );

            foreach ( $_attachments as $key => $val ) {
                $attachments[$val->ID] = $_attachments[$key];
            }
        // we want all the children (+) any includes (-) any excludes
        } else {
            $params = array_merge($common_params, array(
                'post_parent' => $id
            ));

            $attachments = get_children( array_merge($params, $common_params) );

            if ( !empty($include) ) {
                $params = array_merge($common_params, array(
                    'include' => preg_replace( '/[^0-9,]+/', '', $include )
                ));

                $_attachments = get_posts( array_merge($params, $common_params) );

                foreach ( $_attachments as $key => $val ) {
                    $attachments[$val->ID] = $_attachments[$key];
                }
            }

            if ( !empty($exclude) ) {
                $exclude = preg_replace( '/[^0-9,]+/', '', $exclude );
                $exclude = explode(",", $exclude);
                foreach ( $attachments as $_a ) {
                    if ( in_array($_a->ID, $exclude) ) {
                        unset($attachments[$_a->ID]);
                    }
                }
            }
        }

        if ( !empty($attachments) ) {
            $pattern = PhotoMosaic::$URL_PATTERN;

            $i = 0;
            $len = count($attachments);

            foreach ( $attachments as $_post ) {
                $image_full = wp_get_attachment_image_src($_post->ID , 'full');
                $image_large = wp_get_attachment_image_src($_post->ID , 'large');
                $image_medium = wp_get_attachment_image_src($_post->ID , 'medium');
                $image_title = esc_attr($_post->post_title);
                $image_alttext = esc_attr(get_post_meta($_post->ID, '_wp_attachment_image_alt', true));
                $image_caption = esc_attr($_post->post_excerpt);
                $image_description = $_post->post_content; // this is where we hide a link_url

                // is the description a URL
                if ( intval($link_to_url) && preg_match("#$pattern#i", $image_description) ) {
                    $url_data = ',"url": "' . $image_description . '"';
                } else {
                    $url_data = '';
                }

                $output_buffer .='{
                    "src": "' . $image_full[0] . '",
                    "thumb": "' . $image_medium[0] . '",
                    "sizes": {
                        "medium" : "' . $image_medium[0] . '",
                        "large" : "' . $image_large[0] . '",
                        "full" : "' . $image_full[0] . '"
                    },
                    "caption": "' . $image_caption . '",
                    "alt": "' . $image_alttext . '",
                    "width": "' . $image_full[1] . '",
                    "height": "' . $image_full[2] . '"
                    ' . $url_data . '
                }';

                if($i != $len - 1) {
                    $output_buffer .=',';
                }

                $i++;
            }
        }

        return $output_buffer;
    }

    function galleryFromNextGen($id, $link_to_url, $type) {
        global $wpdb, $post;
        $pattern = PhotoMosaic::$URL_PATTERN;
        $picturelist = array();
        $output_buffer ='';

        if ( $type === 'gallery' ) {
            $picturelist = array_merge( $picturelist, nggdb::get_gallery($id) );
        } else {
            $album = nggdb::find_album( $id );
            $galleryIDs = $album->gallery_ids;
            foreach ($galleryIDs as $key => $galleryID) {
                $picturelist = array_merge( $picturelist, nggdb::get_gallery($galleryID) );
            }
        }

        $i = 0;
        $len = count($picturelist);
        foreach ($picturelist as $key => $picture) {
            $image_description = $picture->description;
            $image_alttext = $picture->alttext;

            // is the description a URL
            if ( intval($link_to_url) && preg_match("#$pattern#i", $image_description) ) {
                $url_data = ',"url": "' . $image_description . '"';
                $image_description = esc_attr($image_alttext);
                $image_alttext = $image_description;

            } else if ( intval($link_to_url) && preg_match("#$pattern#i", $image_alttext) ) {
                $url_data = ',"url": "' . $image_alttext . '"';
                $image_description = esc_attr($image_description);
                $image_alttext = $image_description;

            } else {
                $url_data = '';
                $image_description = esc_attr($image_description);
                $image_alttext = esc_attr($image_alttext);
            }

            $output_buffer .='{
                "src": "' . $picture->imageURL . '",
                "thumb": "' . $picture->imageURL . '",
                "caption": "' . $image_description . '",
                "alt": "' . $image_alttext . '",
                "width": "' . $picture->meta_data['width'] . '",
                "height": "' . $picture->meta_data['height'] . '"
                ' . $url_data . '
            }';

            if($i != $len - 1) {
                $output_buffer .=',';
            }

            $i++;
        }
        return $output_buffer;
    }

    function the_posts( $posts ) {
        // ok...
        // currently we load the JS and CSS on every non-admin page regardless if there is a mosaic
        // checks here could be used to only enqueue PM when needed
        // that's probably a good thing
        foreach( $posts as $post ) {
            if ( preg_match_all( '/\[gallery.*\]/', $post->post_content, $matches ) ) {
                foreach ( $matches[0] as $match ) {
                    // print_r($match);
                    // print_r('<br>');
                    if ( strpos( $match, 'photomosaic="true"' ) !== false || strpos( $match, "photomosaic='true'" ) !== false) {
                        // print_r('YUP!!! <br>');
                    }
                }
            }
        }
        return $posts;
    }

    function post_gallery( $empty = '', $atts = array() ) {
        global $post;
        if ( !isset( $atts['photomosaic'] ) ) {
            return;
        } else {
            $output = PhotoMosaic::shortcode($atts);
            return $output;
        }
    }

    function renderAdminPage() {
        $options = PhotoMosaic::getOptions();
        $options = PhotoMosaic::adjustDeprecatedOptions($options);
        ?>
        <script>
            if (!window.PhotoMosaic) {
                window.PhotoMosaic = {};
            }
        </script>
        <style>
            h1 {
                margin: 0.5em 200px 0 0;
                line-height: 1.2em;
                font-size: 2.8em;
                font-weight: 200;
            }
            .wrap h2.nav-tab-wrapper { padding:0.5em 0.5em 0; }
            h3 { padding-top:1em; }
            .tab { margin-top:2em; padding:0 2em; }
            .tab form label { font-weight:bold; }

            form h3,
            h3.subhead { clear:both; padding-bottom:5px; margin-bottom:0; border-bottom:solid 1px #e6e6e6; }

            .photomosaic ul { list-style:disc; margin-left:2em; }

            #photomosaic-error-list { display:none; }
                #photomosaic-error-list ul { list-style:none; margin-left:0; }
                #photomosaic-error-list ul li { list-style:disc; margin-left:2em; }
                    #photomosaic-error-list ul li.header { list-style:none; margin-left:0; font-size:16px; color:#cc0000; }

            #photomosaic-notes { display:none; margin-top:30px; }
                #photomosaic-notes .header { font-size:16px; color:#9f6000; }

            .message-info {
                background:#d1e4f3; /*color:#00529b;*/ border: 1px solid #4d8fcb; padding:0 0.6em; margin:5px 15px 15px 0;
                -webkit-border-radius:3px;
                -moz-border-radius:3px;
                border-radius:3px;
            }

            form .set { overflow:hidden; }
            form .margin { margin-top:2em; }
            form .field { float:left; width:25%; }
            form .info{ font-size:11px; color:#666666; padding:0 30px 0 3px; display:block; }

            .question { max-width:650px; margin-bottom:3em; }
            .question p { margin-left:2em; }
            .question li p { margin-left:0; }
            .question ol li { margin-left:2em; }
            .question ul { margin-left:4em; }
            .question ol ul { margin-top:0.3em; margin-left:0; }
            .question h4 { margin:2em 0 0 2em; }
            .question blockquote { margin-left:4em; font-style:italic; color:#929292; }
            .jumplinks {
                background:#f1f1f1; border:1px solid #dadada; float:right; margin:0 0 1em 1em; padding:1em; max-width:30%;
                -webkit-border-radius:3px; -moz-border-radius:3px; border-radius:3px;
            }
            .jumplinks h3 { padding:0.2em 0 0.2em 0; margin-top:0; }
            .jumplinks ul { margin:0 0 0 1.5em; }
            .jumplinks a { text-decoration:none; }

            .updated h3 { padding:0; }

            pre code { display:block; }

            .wp-pointer-4 .wp-pointer-arrow,
            .wp-pointer-5 .wp-pointer-arrow { left:145px; }
        </style>
        <div class="wrap photomosaic">
            <h1>PhotoMosaic</h1>

            <h2 class="nav-tab-wrapper">
                <a class="nav-tab" href="#tab-form">Global Settings</a>
                <a class="nav-tab" href="#tab-shortcode">Shortcode</a>
                <a class="nav-tab" href="#tab-templatetag">Template Tag</a>
                <a class="nav-tab" href="#tab-widget">Sidebar Widget</a>
                <a class="nav-tab" href="#tab-about">About</a>
                <a class="nav-tab" href="#tab-faq">FAQ</a>
                <a class="nav-tab" href="#tab-whatsnew">What's New</a>
            </h2>

            <div class="tab" id="tab-form">
                <p>
                    These settings will be applied to all of your <code>[photomosaic]</code> galleries.
                    You can override any of these settings on a per-instance basis (see the details for each type, shortcode, template tag, and sidebar widget).
                    Any options not specified on a shortcode will default the settings chosen here.
                </p>

                <div id="photomosaic-error-list" class="error below-h2">
                    <ul></ul>
                </div>

                <?php if (isset($_POST['message'])) { ?>
                    <div class="updated below-h2">
                        <p><?php echo($_POST['message']); ?></p>
                    </div>
                <?php } ?>

                <form method="post" enctype="multipart/form-data" id="photomosaic-options">
                    <h3>Layout</h3>
                    <div class="set">
                        <div class="field">
                            <p><label>Width <i>(in pixels)</i></label></p>
                            <p><input type="text" name="width" value="<?php echo($options['width']); ?>" /></p>
                            <span class="info">set to <b>0</b> for auto-sizing</span>
                        </div>
                        <div class="field">
                            <p><label>Height <i>(in pixels)</label></i></p>
                            <p><input type="text" name="height" value="<?php echo($options['height']); ?>" /></p>
                            <span class="info">set to <b>0</b> for auto-sizing</span>
                        </div>
                        <div class="field">
                            <p><label>Padding <i>(in pixels)</i></label></p>
                            <p><input type="text" name="padding" value="<?php echo($options['padding']); ?>" /></p>
                        </div>
                        <div class="field">
                            <p>
                                <label><input name="center" type="checkbox" value="1" <?php if($options['center']) echo "checked='checked'"; ?> /> Center Galleries</label>
                            </p>
                            <span class="info">
                                causes the Mosaic to center itself to its container
                            </span>
                        </div>
                    </div>
                    <div class="set margin">
                        <div class="field">
                            <p><label>Columns</label></p>
                            <p><input type="text" name="columns" value="<?php echo($options['columns']); ?>" /></p>
                            <span class="info">
                                set to <b>0</b> for auto-columns
                                    <br/><br/>
                                auto-columns has PhotoMosaic calculate the optimal number of columns given the number of images in the gallery and the size of its container
                                    <br/><br/>
                                auto-columns is fully responsive
                            </span>
                        </div>
                    </div>


                    <h3>Behavior</h3>
                    <div class="set">
                        <div class="field">
                            <p>
                                <label><input name="links" type="checkbox" value="1" <?php if($options['links']) echo "checked='checked'"; ?> /> Image Links</label>
                            </p>
                            <span class="info">wraps images in links that point to the unresized version of the image</span>
                        </div>
                        <div class="field">
                            <p>
                                <label><input name="link_to_url" type="checkbox" value="1" <?php if($options['link_to_url']) echo "checked='checked'"; ?> /> Link to URL</label>
                            </p>
                            <span class="info">
                                causes PhotoMosaic to look for a URL to use instead of linking to the unresized image
                                    <br/><br/>
                                if no URLs are found, PhotoMosaic links to the unresized image
                                    <br/><br/>
                                WP: define the caption in the "Caption" field and the link URL in the "Description" field
                                    <br/><br/>
                                NextGen: it doesn't matter which field ("Alt &amp; Title Text" or "Description") gets used for which.
                                PhotoMosaic checks both fields for the URL and, if it finds one, uses the other field for the caption
                                    <br/><br/>
                                requires that <b>image links</b> be checked
                            </span>
                        </div>
                        <div class="field">
                            <p>
                                <label><input name="external_links" type="checkbox" value="1" <?php if($options['external_links']) echo "checked='checked'"; ?> /> Open Links in New Window</label>
                            </p>
                            <span class="info">
                                causes links to open in a new window/tab
                                    <br/><br/>
                                requires that <b>image links</b> be checked
                            </span>
                        </div>
                        <div class="field">
                            <p><label>Order</label></p>
                            <p>
                                <select name="order">
                                  <option value="rows" <?php if($options['order'] == 'rows') echo "selected"; ?> >Rows</option>
                                  <option value="columns" <?php if($options['order'] == 'columns') echo "selected"; ?> >Columns</option>
                                  <option value="masonry" <?php if($options['order'] == 'masonry') echo "selected"; ?> >Masonry</option>
                                  <option value="random" <?php if($options['order'] == 'random') echo "selected"; ?> >Random</option>
                                </select>
                            </p>
                            <span class="info">
                                only applies to image sequence direction, not layout (format will still be in columns)
                                    <br/><br/>
                                Masonry places the 'next' image in the first empty position moving down the page
                                    <br/><br/>
<pre>
rows   |  columns |  masonry
1 2 3  |  1 4 7   |  1 2 3
4 5 6  |  2 5 8   |  6 4 5
7 8 9  |  3 6 9   |  7 9 8
</pre>
                            </span>
                        </div>
                    </div>
                    <div class="set margin">
                        <div class="field">
                            <p>
                                <label><input name="show_loading" type="checkbox" value="1" <?php if($options['show_loading']) echo "checked='checked'"; ?> /> Show Loading Spinner</label>
                            </p>
                            <span class="info">displays a "loading gallery..." spinner until the mosaic is ready</span>
                        </div>
                        <div class="field">
                            <p><label>Image Loading Transition</label></p>
                            <p>
                                <select name="loading_transition">
                                  <option value="none" <?php if($options['loading_transition'] == 'none') echo "selected"; ?> >None</option>
                                  <option value="fade" <?php if($options['loading_transition'] == 'fade') echo "selected"; ?> > Fade</option>
                                  <option value="scale-up" <?php if($options['loading_transition'] == 'scale-up') echo "selected"; ?> >Scale Up</option>
                                  <option value="scale-down" <?php if($options['loading_transition'] == 'scale-down') echo "selected"; ?> >Scale Down</option>
                                  <option value="slide-up" <?php if($options['loading_transition'] == 'slide-up') echo "selected"; ?> >Slide Up</option>
                                  <option value="slide-down" <?php if($options['loading_transition'] == 'slide-down') echo "selected"; ?> >Slide Down</option>
                                  <option value="slide-left" <?php if($options['loading_transition'] == 'slide-left') echo "selected"; ?> >Slide Left</option>
                                  <option value="slide-right" <?php if($options['loading_transition'] == 'slide-right') echo "selected"; ?> >Slide Right</option>
                                  <option value="custom" <?php if($options['loading_transition'] == 'custom') echo "selected"; ?> >Custom</option>
                                </select>
                            </p>
                            <span class="info">
                                a subtle 'arrival' effect on an image after it has been loaded
                                    <br/><br/>
                                uses CSS transforms/transitions (CSS3) - non-modern browser behave normally but don't see the effect
                                    <br/><br/>
                                "custom" adds "transition-custom" class to use as a hook in your own CSS
                            </span>
                        </div>
                        <div class="field">
                            <p>
                                <label><input name="responsive_transition" type="checkbox" value="1" <?php if($options['responsive_transition']) echo "checked='checked'"; ?> /> Show Responsive Transition</label>
                            </p>
                            <span class="info">animates image positions during browser resize</span>
                        </div>
                        <div class="field">
                            <p>
                                <label><input name="prevent_crop" type="checkbox" value="1" <?php if($options['prevent_crop']) echo "checked='checked'"; ?> /> Prevent Image Cropping</label>
                            </p>
                            <span class="info">
                                prevents images from being cropped
                                    <br><br>
                                causes the bottom of the mosaic to be uneven / jagged
                            </span>
                        </div>
                    </div>

                    <h3>Lightbox</h3>
                    <div class="set">
                        <div class="field">
                            <p>
                                <label><input name="lightbox" type="checkbox" value="1" <?php if($options['lightbox']) echo "checked='checked'"; ?> /> Use Default Lightbox</label>
                            </p>
                            <span class="info">
                                displays your photos in a prettyPhoto lightbox when clicked.
                                    <br/><br/>
                                requires that <b>image links</b> be checked
                            </span>
                        </div>
                        <div class="field">
                            <p><label>Lightbox REL</label></p>
                            <p><input type="text" name="lightbox_rel" value="<?php echo($options['lightbox_rel']); ?>" /></p>
                            <span class="info">
                                the string used in the image/link REL attribute (rel="pmlightbox")
                                    </br></br>
                                alphanumerics only (a-z, A-Z, 0-9)
                                    </br></br>
                                applies to <strong>Default</strong> and <strong>Custom</strong> lightboxes
                            </span>
                        </div>
                        <div class="field">
                            <p>
                                <label><input name="lightbox_group" type="checkbox" value="1" <?php if($options['lightbox_group']) echo "checked='checked'"; ?> /> Group Images</label>
                            </p>
                            <span class="info">
                                allows the lightbox to step through the images in the gallery without having to close between each image
                                    </br></br>
                                appends a bracketed string to the <strong>Lightbox REL</strong> (rel="pmlightbox[group1]")
                                    </br></br>
                                applies to <strong>Default</strong> and <strong>Custom</strong> lightboxes
                            </span>
                        </div>
                    </div>

                    <div class="set margin message-info">
                        <p>Please read the <a class="combo-link" href="#tab-faq?customlightbox">FAQ ("How do I use a Custom Lightbox")</a> for help integrating PhotoMosaic with your existing lightbox plugin</p>
                    </div>

                    <div class="set margin">
                        <div class="field">
                            <p>
                                <label><input name="custom_lightbox" type="checkbox" value="1" <?php if($options['custom_lightbox']) echo "checked='checked'"; ?> /> Use Custom Lightbox</label>
                            </p>
                            <span class="info">allows you to specify your own lightbox and params</span>
                        </div>
                        <div class="field">
                            <p><label>Custom Lightbox Function Name</label></p>
                            <p><input type="text" name="custom_lightbox_name" value="<?php echo($options['custom_lightbox_name']); ?>" /></p>
                            <span class="info">
                                this is the name of the JS function called to activate your lightbox <br><i>(ie: prettyPhoto, fancybox, fancyZoom, facebox)</i>
                                    <br><br>
                                capitalization matters
                                    <br><br>
                                if you aren't familiar with JavaScript and jQuery, you may need to consult your lightbox 
                                plugin's documentation to find this function name
                            </span>
                        </div>
                        <div class="field">
                            <p><label>Custom Lightbox Params</label></p>
                            <p><textarea name="custom_lightbox_params"><?php echo($options['custom_lightbox_params']); ?></textarea></p>
                            <span class="info">
                                this is a JS object that gets passed into your lightbox function call <br><i>(eg: {theme:'darkness'})</i>
                                    <br><br>
                                if you aren't familiar with JavaScript and jQuery but have the lightbox enabled elsewhere on your site,
                                view your page's source and look for something similar to...
                                    <br>
                                <i>$().lightboxName({
                                        <br>&nbsp;&nbsp;&nbsp;
                                        option:value,
                                        <br>&nbsp;&nbsp;&nbsp;
                                        option2:value2
                                        <br>
                                    });
                                </i>
                            </span>
                        </div>
                    </div>

                    <div id="photomosaic-notes">
                        <div class="updated below-h2">
                            <p class="header">FYI</p>
                        </div>
                    </div>

                    <p>
                        <input class="button-primary" type="submit" name="photomosaic_save" value="Save Changes" />
                    </p>
                </form>
            </div>
            
            <div class="tab" id="tab-shortcode">
                <h2>Shortcode</h2>
                <h3 class="subhead">Inline Settings</h3>
                <p>
                    The PhotoMosaic shortcode has full support for inline attributes (eg. <code>[photomosaic width="600" height="400" random="1"]</code>). 
                    Any inline setting will override the default values set on the "Global Settings" page.  Available settings:
                </p>
                <ul>
                    <li><b>id</b> : the post/page id for the desired gallery</li>
                    <li><b>nggid</b> : the ID for the desired NextGen gallery</li>
                    <li><b>padding</b> : any number <i>(in pixels)</i></li>
                    <li><b>columns</b> : any number</li>
                    <li><b>width</b> : any number <i>(in pixels)</i></li>
                    <li><b>height</b> : any number <i>(in pixels)</i></li>
                    <li><b>center</b> : 1 = yes, 0 = no</li>
                    <li><b>prevent_crop</b> : 1 = yes, 0 = no</li>
                    <li><b>links</b> : 1 = yes, 0 = no</li>
                    <li><b>order</b> : rows, columns, masonry, random</li>
                    <li><b>link_to_url</b> : 1 = yes, 0 = no</li>
                    <li><b>external_links</b> : 1 = yes, 0 = no</li>
                    <li><b>show_loading</b> : 1 = yes, 0 = no</li>
                    <li><b>loading_transition</b> : none, fade, scale-up|down, slide-up|down|left|right, custom</li>
                    <li><b>responsive_transition</b> :  1 = yes, 0 = no</li>
                    <li><b>lightbox</b> : 1 = yes, 0 = no</li>
                    <li><b>lightbox_rel</b> : any alphanumeric string</li>
                    <li><b>lightbox_group</b> : 1 = yes, 0 = no</li>
                    <li><b>custom_lightbox</b> : 1 = yes, 0 = no</li>
                    <li><b>custom_lightbox_name</b> : js function name <i>(eg: prettyPhoto)</i></li>
                    <li><b>custom_lightbox_params</b> : js object passed to the above function <i>(eg: {theme:'darkness'})</i></li>
                </ul>
                <p>The PhotoMosaic shortcode also supports the standard WordPress shortcode <b>include</b>, <b>exclude</b>, and <b>ids</b> params.</p>
            </div>
            
            <div class="tab" id="tab-templatetag">
                <h2>Template Tag</h2>
                <p>
                    PhotoMosaic also supports Wordpress Template Tags (<code>wp_photomosaic()</code>).  This can be added to your theme's
                    template files to automatically add a gallery to every page.
                </p>
                <p>The PhotoMosaic template tag accepts an array of the attributes listed on the "Shortcode" tab.  For Example:</p>
<pre><code>    $atts = array(
        'id' => 1,
        'columns' => 3
    );
    wp_photomosaic($atts);
</code></pre>
            </div>

            <div class="tab" id="tab-widget">
                <h2>Sidebar Widget</h2>
                <p>
                    To use PhotoMosaic in your Widget-enabled sidebar simply add a standard text widget and 
                    add a <code>[photomosaic]</code> shortcode to the widget's text (exactly as you would in a page or post).
                </p>
            </div>

            <div class="tab" id="tab-about">
                <h2>About</h2>
                <h3>Current Version : <?php echo PhotoMosaic::version(); ?></h3>
                <p>
                    PhotoMosaic takes advantage of Wordpress' built-in gallery feature.  Simply add the <code>[photomosaic]</code> shortcode to your 
                    post/page content and any images attached to that post/page will be displayed as a PhotoMosaic gallery.
                </p>
                <p>Thank you for purchasing PhotoMosaic for Wordpress</p>
            </div>

            <div class="tab" id="tab-faq">
                <h2>FAQ</h2>

                <div class="jumplinks">
                    <h3>Contents</h3>
                    <ul></ul>
                </div>

                <div class="question">
                    <a name="makepm"></a>
                    <h3 class="title">How do I make a PhotoMosaic?</h3>
                    <p>
                        PhotoMosaic is an extention of the <code>[gallery]</code> shortcode.  Any place you would use a 
                        <code>[gallery]</code> shortcode you can use a <code>[photomosaic]</code> shortcode and your 
                        images will render in a mosaic instead of a grid.
                    </p>
                    <p>
                        See <a href="#createedit">Where do I create/edit my galleries?</a> for more detail.
                            <br>
                        See <a href="stepcreate">Where can I get step-by-step instructions for making a gallery</a> 
                        for step-by-step instructions.
                    </p>
                </div>

                <div class="question">
                    <a name="createedit"></a>
                    <h3 class="title">Where do I create/edit my galleries?</h3>
                    <p>
                        In Wordpress, "galleries" don't exist in a strict sense.  They don't need to be configured in a seperate 
                        workflow and then added to your post (a la the NextGen Galleries plugin).  Instead, any images uploaded 
                        to a post (via the "Add Media" button) are automatically attached to that post.  If an image has been 
                        uploaded via the Media Library, it can also manually attached to a post in the Media Library.  
                        A "gallery" is all of the images attached to a post.
                    </p>
                    <p>
                        Before WPv3.5, you could access a "gallery" in one of three ways:
                    </p>
                    <ol>
                        <li>
                            <p>the images attached to a post :</p>
                            <ul>
                                <li><code>[gallery]</code> = the current post</li>
                                <li><code>[gallery id="1"]</code> = the post with ID=1</li>
                            </ul>
                        </li>
                        <li>only the images listed on the shortcode : <code>[gallery includes="1,2,3,4,5"]</code></li>
                        <li>the images attached to a post with exceptions : <code>[gallery exclude="1,2,3"]</code> (assumes we are excluding from images attached to the current post)</li>
                    </ol>
                    <p>
                        In WPv3.5, the Wordpress Team changed the workflow for creating a "gallery".  While the 
                        <code>[gallery]</code> shortcode will still honor all of the pre-3.5 methods, using the new "Create Gallery" 
                        tool will generate a shortcode with a list of images to be used (<code>[gallery ids="1,2,3,4,5"]</code>).  This 
                        method is similar to the old "include" method in that it ignores any images attached to the post.
                    </p>
                    <p>
                        Any <code>[gallery]</code> shortcodes generated using the "Create Gallery" tool are managed by editing 
                        the shortcode itself.
                    </p>
                    <p>
                        You can read more about the <code>[gallery]</code> shortcode at the 
                        <a href="http://codex.wordpress.org/Gallery_Shortcode">Wordpress Codex :: Gallery Shortcode</a>.
                    </p>
                    <p>
                        See <a href="stepcreate">Where can I get step-by-step instructions for making a gallery</a> if you need explicit help
                    </p>
                </div>

                <div class="question">
                    <a name="globalshortcode"></a>
                    <h3 class="title">What's the difference between "Global Settings" and "Shortcode Settings"?</h3>
                    <p>
                        Any configurations made on the PhotoMosaic options page (PhotoMosaic > Global Settings) apply to all of your 
                        PhotoMosaics.  Any time you use the <code>[photomosaic]</code> shortcode, your "Global Settings" will be applied.
                    </p>
                    <p>
                        Your PhotoMosaics can also be configured on the shortcode itself. These "Shortcode Settings" override 
                        your "Global Settings" making it easy to have a certain mosaic behave differently than others.
                    </p>
                    <h4>A simple example:</h4>
                    <p>
                        You want all of your mosaics to display in 6 columns so you set "Columns" to "6" globally 
                        (PhotoMosaic > Global Settings > Columns = 6).  Now any <code>[photomosaic]</code> will have 
                        6 columns.
                    </p>
                    <p>
                        But there's one very specific mosaic that you'd like to display in 3 columns. Simply set "columns" 
                        on the shortcode (<code>[photomosaic columns="3"]</code>) and this mosaic (and only this mosaic) will 
                        display in 3 columns.
                    </p>
                    <h4>A complex example:</h4>
                    <p>
                        I receive a lot of support requests for the following:
                    </p>
                    <blockquote>
                        I have a Portfolio section.  On the homepage for that section I want to have a mosaic where clicking 
                        on the image takes the user to that portfolio item's page.  Then, on that item's page, I want another 
                        mosaic where clicking on the image opens a bigger version of the image in a lightbox.
                    </blockquote>
                    <p>
                        Since the mosaic on the Portfolio homepage will be the one-off, it's best to configure the "Global Settings" 
                        for the Portfolio Item mosaics.  In this case that means that we want to configure our "Global Settings" 
                        to open the image in a lightbox when clicked:
                    </p>
                    <ul>
                        <li>Behavior > Image Links = check</li>
                        <li>Behavior > Link to URL = uncheck</li>
                        <li>Lightbox > Use Default Lightbox = check</li>
                    </ul>
                    <p>
                        Now, on the Portfolio homepage mosaic, we simply override the specific settings we want to change:
                    </p>
                    <ul>
                        <li>turn on "Link to URL"</li>
                        <li>turn off "Use Default Lightbox"</li>
                    </ul>
                    <p>
                        Our shortcode should look like this: <code>[photomosaic link_to_url="1" lightbox="0"]</code>.
                    </p>
                    <p>
                        A full list of the shortcode settings can be found under the "Shortcode" tab.
                    </p>
                </div>

                <div class="question">
                    <a name="multiplemosaics"></a>
                    <h3 class="title">How do I put multiple mosaics on the same page?</h3>
                    <h4>WPv3.4 and lower:</h4>
                    <p>
                        Simply specify a post that has attached images (ID = the ID for the post where the images are attached).
                    </p>
                    <p>
                        <code>[photomosaic id="1"]</code>
                            <br>
                        <code>[photomosaic id="2"]</code>
                    </p>
                    <h4>WPv3.5 and newer</h4>
                    <p>
                        You can use the "Create Gallery" flow to generate as many <code>[gallery ids="1,2,3,4,5"]</code> shortcodes 
                        as you like.  For all of them, simply replace "gallery" with "photomosaic" 
                        (<code>[photomosaic ids="1,2,3,4,5"]</code>) and you'll be all set.
                    </p>
                </div>

                <div class="question">
                    <a name="stepbystep"></a>
                    <h3 class="title">Where can I get step-by-step instructions for making a gallery?</h3>
                    <h4>WPv3.4 and lower:</h4>
                    <ol>
                        <li>edit or create a post</li>
                        <li>click the "Add Media" icon (above the text editor)</li>
                        <li>upload the images that you want to appear in your gallery</li>
                        <li>if you edited any of the infoabout your images - click "Save All Changes"</li>
                        <li>close the "Add media" window</li>
                        <li>add <code>[photomosaic]</code> to your post and your gallery will appear in that spot</li>
                    </ol>

                    <h4>WPv3.5 and newer</h4>
                    <ol>
                        <li>edit or create a post</li>
                        <li>click the "Add Media" icon (above the text editor)</li>
                        <li>click "Create Gallery" in the left column</li>
                        <li>either "Upload Files" or use images in the "Media Library"</li>
                        <li>select the images you'd like to appear in your gallery</li>
                        <li>click "Create New Gallery" (in the bottom/right corner)</li>
                        <li>drag to place in the correct order (if necessary)</li>
                        <li>click "Insert Gallery" (in the bottom/right corner)</li>
                        <li>edit the shortcode, replacing "gallery" with "photomosaic"</li>
                    </ol>

                    <h4>NextGen Galleries:</h4>
                    <ol>
                        <li>go to Gallery > Add Gallery / Images</li>
                        <li>select the "Add new gallery" tab</li>
                        <li>create your gallery</li>
                        <li>select the "Upload Images" tab (if you weren't taken there automatically)</li>
                        <li>select the images you want to upload and the select the gallery you want them added to</li>
                        <li>go to Gallery > Manage Gallery and note the ID of your new gallery</li>
                        <li>go to the post where you want to insert your gallery and add <code>[photomosaic nggid="*"]</code> (replacing the * with your gallery's ID)</li>
                    </ol>
                </div>

                <div class="question">
                    <a name="customlightbox"></a>
                    <h3 class="title">How do I use a custom lightbox?</h3>
                    <p>Most lightbox plugins work in one of four ways.  The methods, explained below, are ordered starting with the easiest.  If you don't already know how your lightbox works please start with the first method, and try them in order.</p>
                    <ol>
                        <li>
                            <h3>Aggressive</h3>
                            <p>Some lightbox plugins are very aggressive about finding links/images.  These plugins make integration with PhotoMosaic easy because require no additional work.</p>
                            <p>In the PhotoMosaic settings:</p>
                            <ul>
                                <li>uncheck <strong>Use Default Lightbox</strong></li>
                                <li>uncheck <strong>Use Custom Lightbox</strong></li>
                            </ul>
                        </li>

                        <li>
                            <h3>Selector</h3>
                            <p>Some lightbox plugins allow you to specify a CSS selector the plugin will use to find your images.  Look through your plugin's settings to see if their is a field for specifying selectors.  Be sure to pay attention to whether your plugin accepts selectors that point to images or links.</p>
                            <p>In your lightbox plugin's settings:</p>
                            <ul>
                                <li>Image Selector = <code>.photoMosaic img</code></li>
                                <li>Link Selector = <code>.photoMosaic a</code></li>
                            </ul>
                            <p>In the PhotoMosaic settings:</p>
                            <ul>
                                <li>uncheck <strong>Use Default Lightbox</strong></li>
                                <li>uncheck <strong>Use Custom Lightbox</strong></li>
                            </ul>
                        </li>

                        <li>
                            <h3>REL</h3>
                            <p>Some lightbox plugins will automatically find images/links that have a REL attribute set to something specific.  You should be able to find this information in your lightbox plugin's documentation - it will always be a single, alphanumeric word (<code>lightbox</code> is the most common REL).</p>
                            <p>In the PhotoMosaic settings:</p>
                            <ul>
                                <li>uncheck <strong>Use Default Lightbox</strong></li>
                                <li>uncheck <strong>Use Custom Lightbox</strong></li>
                                <li>set "Lightbox REL" to your plugin's alphanumeric word (eg: <code>lightbox</code>)</li>
                            </ul>
                            <p>If you see, in your lightbox's documentation, examples of RELs with brackets (eg: <code>lightbox[group1]</code>) the brackets can be ignored - your <strong>Lightbox REL</strong> is <code>lightbox</code>.  The presence of the brackets tells you that your lightbox supports grouped images (check the <strong>Group Images</strong> PhotoMosaic setting).</p>
                        </li>

                        <li>
                            <h3>Manual</h3>
                            <p>If none of the previous methods worked, PhotoMosaic can manually try to integrate with your lightbox plugin provided your lightbox is build with jQuery.</p>
                            <p>If your plugin is well documented (or has developer documentation) the information needed for this method will likely be found there.  It is likely, however, that you will need to examine your page's source code to find everything.</p>
                            <p>We will be looking for two pieces of information:</p>
                            <ul>
                                <li>the method name your lightbox used to register itself with jQuery (<strong>Custom Lightbox Function Name</strong>)</li>
                                <li>the JS object that contains all of your lightbox's settings (<strong>Custom Lightbox Params</strong>)</li>
                            </ul>
                            <p>At the most basic level, all jQuery calls look the same:</p>
<pre><code>    $("selector").method();
        OR
    jQuery("selector").method();
</code></pre>
                            <p>Sometimes you'll see a JS object being passed to the method:</p>
<pre><code>    $("selector").method({
        option1: setting1,
        option2: setting2
    });
</code></pre>
                            <p>Looking at that last example, <strong>Custom Lightbox Function Name</strong> is <code>method</code> and <strong>Custom Lightbox Params</strong> is the JS object being passed into the method (including the <code>{}</code>).</p>
                            <p>If you view the source on a page with a PhotoMosaic with the default settings using the default lightbox you'll see:</p>
<pre><code>    $("a[rel^='pmlightbox']").prettyPhoto({
        overlay_gallery: false,
        slideshow: false,
        theme: "pp_default",
        deeplinking: false,
        social_tools: ""
    });
</code></pre>
                            <p>In this case:</p>
                            <ul>
                                <li><strong>Custom Lightbox Function Name</strong> = <code>prettyPhoto</code></li>
                                <li><strong>Custom Lightbox Params</strong> = <code>{
                                        overlay_gallery: false,
                                        slideshow: false,
                                        theme: "pp_default",
                                        deeplinking: false,
                                        social_tools: ""
                                    }</code>
                                </li>
                            </ul>
                            <p>The reason you should look at your page's source for the <strong>Custom Lightbox Params</strong> is that the JS object that appears in your page's source code will reflect the settings you've set in your lightbox plugin's settings.  Doing this insures that lightboxes opened from PhotoMosaic match lightboxes opened elsewhere on your site.  If you change your lightbox's settings you should also update PhotoMosaic's <strong>Custom Lightbox Params</strong>.</p>
                        </li>
                    </ol>
                </div><!-- end .question -->
            </div><!-- end FAQ tab -->

            <div class="tab" id="tab-whatsnew">
                <h2>What's New in v<?php echo PhotoMosaic::version(); ?></h2>
                <ul>
                    <li>New "Prevent Crop" Setting : prevents mosaic images from being cropped and leaves the bottom edge of the mosaic jagged</li>
                    <li>New "Lightbox REL" Setting : specify link REL attributes, for easier Custom Lightbox integration</li>
                    <li>New "Lightbox Groups" Setting : some lightboxes throw errors when link RELs contain brackets, turns off the group feature (the cause of the brackets)</li>
                    <li>Updates to latest jQuery v1.9.1</li>
                    <li>Updates PrettyPhoto to v3.1.5 : works with jQuery 1.9.*</li>
                    <li>Bug Fix : NextGen "Link to URL" urls no longer appear as captions</li>
                    <li>New FAQ : How do I use a custom lightbox?</li>
                </ul>
                <h3>v2.2.5</h3>
                <ul>
                    <li>Correct NextGen Gallery images size usage</li>
                </ul>
                <h3>v2.2</h3>
                <ul>
                    <li>New Layout : now uses a much more flexible Absolute Positioned layout (rather than the old fixed-markup layout).</li>
                    <li>Actively Responsive : used to only be Passively Responsive (required a reload to see changes)</li>
                    <li>New Auto-Columns Logic : now generates mosaics with larger images</li>
                    <li>New "Order" Setting : replaces the akward "Force Order" and "Randomize" settings</li>
                    <li>New "Responsive Transition" Setting : choose whether responsive reordering animates</li>
                    <li>Deleted "Force Order" Setting : replaced with new "Order" setting</li>
                    <li>Deleted "Randomize" Setting : replaced with new "Order" setting</li>
                    <li>Deleted "Auto-Columns" Setting : merged with "Columns" setting</li>
                    <li>Updated "Columns" Setting : folded in "Auto-Columns" setting</li>
                    <li>New "FAQ" Section</li>
                    <li>New "What's New" Section</li>
                </ul>
            </div>

        </div>
        <?php
    } // end display
} // end PhotoMosaic


// Template Tag
function wp_photomosaic( $atts ){
    if (!is_admin()) {
        echo PhotoMosaic::shortcode( $atts );
    }
}
?>