<?php
/*
Plugin Name: PhotoMosaic for WordPress
Plugin URI: http://codecanyon.net/item/photomosaic-for-wordpress/243422?ref=makfak
Description: Adds a new display template for your WordPress and NextGen galleries. See the settings page for examples and instructions.
Author: makfak
Author URI: http://www.codecanyon.net/user/makfak?ref=makfak
Version: 2.8.5
GitHub Plugin URI: daylifemike/photomosaic-for-wordpress
*/

if(preg_match('#' . basename(__FILE__) . '#', $_SERVER['PHP_SELF'])) { 
    die('Illegal Entry');
}

add_action( 'init', array( 'PhotoMosaic', 'init' ) );
add_action( 'plugins_loaded', array( 'PhotoMosaic', 'include_github_updater' ) );

class PhotoMosaic {

    // http://daringfireball.net/2010/07/improved_regex_for_matching_urls
    public static $URL_PATTERN = "(?i)\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))";

    public static function version () {
        return '2.8.5';
    }

    public static function init() {
        global $pagenow;

        $options = get_option('photomosaic_options');

        add_filter( 'widget_text', 'do_shortcode' ); // Widget
        // add_filter( 'the_posts', array( __CLASS__, 'the_posts' ) ); // :: conditionally enqueue JS & CSS
        add_filter( 'post_gallery', array( __CLASS__, 'post_gallery' ), 1337, 2 ); // [gallery photomosaic="true" theme="photomosaic"]
        add_filter( 'content_edit_pre', array( __CLASS__, 'scrub_post_shortcodes' ), 1337, 2 ); // template="pm" --> theme="pm"
        add_filter( 'plugin_action_links', array( __CLASS__, 'plugin_action_links' ), 10, 2);

        add_action( 'admin_menu', array( __CLASS__, 'setup_admin_page') );
        add_action( 'wp_ajax_photomosaic_whatsnew', array( __CLASS__, 'ajax_handler') );

        wp_register_script( 'react', '//cdnjs.cloudflare.com/ajax/libs/react/0.11.2/react.min.js', null, '0.11.2' );
        wp_register_script( 'photomosaic_js', plugins_url('/js/photomosaic.min.js', __FILE__ ), array('jquery','react'), PhotoMosaic::version());
        wp_enqueue_script('photomosaic_js');
        wp_enqueue_style( 'photomosaic_base_css', plugins_url('/css/photomosaic.css', __FILE__ ));

        if (!is_admin()) {
            if($options['lightbox']) {
                wp_enqueue_style( 'photomosaic_prettyphoto_css', plugins_url('/includes/vendor/prettyphoto/prettyphoto.css', __FILE__ ));
            }

            add_shortcode( 'photoMosaic', array( __CLASS__, 'shortcode' ) );
            add_shortcode( 'photomosaic', array( __CLASS__, 'shortcode' ) );

        } else {
            if ( isset($_GET['page']) ) {
                if ( $_GET['page'] == "photoMosaic.php" || $_GET['page'] == "photomosaic.php"  || $_GET['page'] == "photomosaic" ) {
                    wp_register_script( 'photomosaic_codemirror_js', plugins_url('/includes/vendor/codemirror/codemirror.js', __FILE__ ));
                    wp_enqueue_script( 'photomosaic_codemirror_jsmode_js', plugins_url('/includes/vendor/codemirror/javascript.js', __FILE__ ), array('photomosaic_codemirror_js'));
                    wp_enqueue_script( 'photomosaic_codemirror_cssmode_js', plugins_url('/includes/vendor/codemirror/css.js', __FILE__ ), array('photomosaic_codemirror_js'));
                    wp_enqueue_style( 'photomosaic_codemirror_css', plugins_url('/includes/vendor/codemirror/codemirror.css', __FILE__ ));

                    wp_enqueue_script( 'photomosaic_admin_js', plugins_url('/js/photomosaic.admin.js', __FILE__ ), array('photomosaic_js', 'photomosaic_codemirror_js'), PhotoMosaic::version());
                    wp_enqueue_style( 'photomosaic_admin_css', plugins_url('/css/photomosaic.admin.css', __FILE__ ));
                }
            }

            if ( isset( $_GET['post'] ) || in_array( $pagenow, array( 'post-new.php' ) ) ) {
                wp_enqueue_script( 'photomosaic_editor_js', plugins_url('/js/photomosaic.editor.js', __FILE__ ), array('photomosaic_js'));
            }
        }
    }

    public static function get_options() {
        $defaults = array(
            'padding' => 2,
            'columns' => 0,
            'width' => 0,
            'height' => 0,
            'order' => 'rows',
            'link_behavior' => 'image',
            // deprecated v2.5
            // 'links' => true,
            // 'link_to_url' => false,
            'external_links' => false,
            'center' => true,
            'prevent_crop' => false,
            'show_loading' => false,
            'loading_transition' => 'fade',
            'resize_transition' => true,
            'lazyload' => 200,
            'lightbox' => true,
            'lightbox_rel' => 'pmlightbox',
            'lightbox_group' => true,
            'custom_lightbox' => false,
            'custom_lightbox_name' => '',
            'custom_lightbox_params' => '{}',
            'custom_css' => '/* your custom css here */',
            // this is repeated in pm.admin.js as a null-check
            'onready_callback' => "function(".'$mosaic'.", ".'$items'."){\n\t/* your code here */\n}"
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

    public static function adjust_deprecated_options($options) {
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

        // 'link_behavior' replaces 'links' & link_to_url' - v2.5
        if (array_key_exists('links', $options)) {
            if ( intval($options['links']) ) {
                if ( intval($options['link_to_url']) ) {
                    $options['link_behavior'] = 'custom';
                } else {
                    $options['link_behavior'] = 'image';
                }
            }
            unset($options['links']);
            unset($options['link_to_url']);
        }

        // 'resposive_transition' renamed to 'resize_transitiion' - v2.8
        if (array_key_exists('responsive_transition', $options)) {
            $options['resize_transitiion'] = $options['responsive_transition'];
            unset($options['responsive_transition']);
        }

        update_option('photomosaic_options', $options);

        return $options;
    }

    public static function shortcode( $atts ) {
        global $post;
        $post_id = intval($post->ID);
        $base = array(
            'id'        => $post_id,
            'include'   => '',
            'exclude'   => '',
            'ids'       => ''
        );
        $options = PhotoMosaic::get_options();
        $options = wp_parse_args($base, $options);
        $settings = wp_parse_args($atts, $options);

        // backwards compatibility
        // 'links' & 'link_to_url' might exist on the shortcode
        // convert them to 'link_behavior'
        if ( array_key_exists('links', $settings) ) {
            if ( intval($settings['links']) ) {
                $settings['link_behavior'] = 'image';

                if ( array_key_exists('link_to_url', $settings) && intval($settings['link_to_url']) ) {
                    $settings['link_behavior'] = 'custom';
                }
            } else {
                $settings['link_behavior'] = 'none';
            }
        }

        $auto_settings = array(
            'height', 'width', 'columns'
        );
        $bool_settings = array(
            'center', 'prevent_crop', 'links', 'external_links', 'show_loading',
            'resize_transition', 'lightbox', 'custom_lightbox', 'lightbox_group'
        );
        $int_false_settings = array('lazyload');

        foreach ( $auto_settings as $key ) {
            if(intval($settings[$key]) == 0){
                $settings[$key] = "'auto'";
            } else {
                $settings[$key] = intval($settings[$key]);
            }
        }

        foreach ( $bool_settings as $key ) {
            if ( array_key_exists($key, $settings) ) {
                if(intval($settings[$key])){
                    $settings[$key] = "true";
                } else {
                    $settings[$key] = "false";
                }
            }
        }

       foreach ( $int_false_settings as $key ) {
            if ( trim($settings[$key]) == '' || $settings[$key] == 'false' ) {
                $settings[$key] = "false";
            } else {
                $settings[$key] = intval($settings[$key]);
            }
        }

        $unique = PhotoMosaic::makeID();

        $output_buffer = '
            <!-- PhotoMosaic v'. PhotoMosaic::version() .' -->
            <style type="text/css">
                '. $settings['custom_css'] .'
            </style>
            <script type="text/javascript" data-photomosaic-gallery="true">
                var PMalbum'.$unique.' = [';

        if ( !empty($atts['nggid']) ) {
            $output_buffer .= PhotoMosaic::gallery_from_nextgen($atts['nggid'], $settings['link_behavior'], 'gallery');
        } else if ( !empty($atts['ngaid']) ) {
            $output_buffer .= PhotoMosaic::gallery_from_nextgen($atts['ngaid'], $settings['link_behavior'], 'album');
        } else if ( !empty($atts['category']) ) {
            if ( $atts['category'] == 'recent' ) {
                $recent_images = PhotoMosaic::recent_posts_images($atts['limit']);
            } else {
                $recent_images = PhotoMosaic::recent_posts_images($atts['limit'], $atts['category']);
            }

            if ( !empty($atts['link_behavior']) ) {
                $link_behavior = $atts['link_behavior'];
            } else {
                $link_behavior = $recent_images;
                $settings['lightbox'] = false;
                $settings['custom_lightbox'] = false;
            }

            $ids = array_keys( $recent_images );
            $output_buffer .= PhotoMosaic::gallery_from_wordpress($settings['id'], $link_behavior, $settings['include'], $settings['exclude'], $ids);
        } else {
            $output_buffer .= PhotoMosaic::gallery_from_wordpress($settings['id'], $settings['link_behavior'], $settings['include'], $settings['exclude'], $settings['ids']);
        }

        // convert 'link_behavior' to 'links'
        if ( $settings['link_behavior'] === 'none' ) {
            $settings['links'] = "false";
        } else {
            $settings['links'] = "true";
        }

        $output_buffer .='];
            </script>
            <script type="text/javascript" data-photomosaic-call="true">';

        $output_buffer .='
                JQPM(document).ready(function() {
                    JQPM("#photoMosaicTarget'.$unique.'").photoMosaic({
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
                        resize_transition: '. $settings['resize_transition'] .',
                        lazyload: '. $settings['lazyload'] .',
                        modal_name: "' . $settings['lightbox_rel'] . '",
                        modal_group: ' . $settings['lightbox_group'] . ',
                        modal_hash: "' . hash('adler32', json_encode($atts)) . '",
            ';

        $required_atts = array('id', 'link_behavior', 'include', 'exclude', 'ids');
        foreach ( $required_atts as $key ) {
            if( empty( $atts[$key] ) ){
                $atts[$key] = $settings[$key];
            }
        }
        $output_buffer .= PhotoMosaic::get_size_object($atts);

        $output_buffer .= '
                        modal_ready_callback : function(mosaic){
                            var $mosaic = JQPM(mosaic);
                            var $items = $mosaic.children();
                            var $ = jQuery;
                            ('. $settings['onready_callback'] .').apply(this, [$mosaic, $items]);
        ';

        if( $settings['lightbox'] == 'true' || $settings['custom_lightbox'] == 'true' ) {
            if( $settings['lightbox'] == 'true' ) {
                $output_buffer .='
                            $mosaic.find("a[rel^=\''.$settings['lightbox_rel'].'\']").prettyPhoto({
                                overlay_gallery: false,
                                slideshow: false,
                                theme: "pp_default",
                                deeplinking: false,
                                show_title: false,
                                social_tools: ""
                            });
                ';
            } elseif ( $settings['custom_lightbox'] == 'true' ) {
                $output_buffer .='
                            jQuery("a[rel^=\''.$settings['lightbox_rel'].'\']", mosaic).'.$settings['custom_lightbox_name'].'('.$settings['custom_lightbox_params'].');
                ';
            }
        } else if ( class_exists('Jetpack_Carousel') ) {
            // Jetpack :: Carousel support
            $output_buffer .='
                            var data;
                            var id;
                            var $fragment;
                            var $img;
                            var $a;
                            var self = this;

                            jQuery("a", mosaic).each(function () {
                                $a = jQuery(this);
                                $img = $a.find("img");
                                id = $img.attr("id");
                                data = PhotoMosaic.Utils.deepSearch( self.images, "id", id );

                                $img.attr( data.jetpack );

                                $a.addClass("gallery-item");
                            });

                            jQuery(mosaic).parent().addClass("gallery");
            ';
        }

        $output_buffer .='
                        },
                        order: "'. $settings['order'] .'"
                    });
                });
            </script>';

        $gallery_div = '<div id="photoMosaicTarget'. $unique .'" class="photoMosaicTarget" data-version="'. PhotoMosaic::version() .'">';

        /* Jetpack :: Carousel hack - it needs an HTML string to append it's data */
        if ( class_exists('Jetpack_Carousel') ) {
            $gallery_style = "<style type='text/css'></style>";
            $output_buffer .= apply_filters( 'gallery_style', $gallery_style . "\n\t\t" . $gallery_div );
        } else {
            $output_buffer .= $gallery_div;
            $output_buffer .= PhotoMosaic::wordpress_gallery_shortcode($atts);
        }

        $output_buffer .='</div>';

        return preg_replace('/\s+/', ' ', $output_buffer);
    }

    public static function recent_posts_images($limit = null, $category = null) {
        if ( empty($limit) ) {
            return '';
        }

        $response = array();
        $args = array(
            'numberposts' => $limit,
            'post_status' => 'publish',
            'post_type' => '*'
        );

        if ( empty($category) ) {
            $posts = wp_get_recent_posts( $args );
        } else {
            $posts = array();
            $cat_map = explode( ',', $category );
            $cat_args = array_fill(0, count($cat_map), $args);

            $cat_map = array_map(function($slug, $args){
                $slug = trim($slug);
                $taxonomies = explode(':', $slug);
                $taxonomy = (count($taxonomies) > 1 ? $taxonomies[0] : 'category');
                $slug = (count($taxonomies) > 1 ? $taxonomies[1] : $slug);
                $taxonomy_args = array(
                    'tax_query' => array(
                        array(
                            'taxonomy' => $taxonomy,
                            'field' => 'slug',
                            'terms' => $slug
                        )
                    )
                );
                return wp_get_recent_posts( $args + $taxonomy_args );
            }, $cat_map, $cat_args);

            // flatten one level
            foreach ($cat_map as $cat_arr) {
                foreach ($cat_arr as $arr) {
                    array_push($posts, $arr);
                }
            }
        }

        foreach ($posts as $post) {
            $id = get_post_thumbnail_id( $post['ID'] );
            if ( !empty( $id ) ) {
                $response[ $id ] = get_permalink( $post['ID'] );
            }
        }

        return $response;
    }

    public static function gallery_from_wordpress($id, $link_behavior, $include, $exclude, $ids, $return_img_obj = false) {
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

        if ( $return_img_obj ) {
            return $attachments;
        }

        if ( !empty($attachments) ) {
            $pattern = PhotoMosaic::$URL_PATTERN;

            $i = 0;
            $len = count($attachments);

            foreach ( $attachments as $_post ) {
                $image_full = wp_get_attachment_image_src($_post->ID , 'full');
                $image_large = wp_get_attachment_image_src($_post->ID , 'large');
                $image_medium = wp_get_attachment_image_src($_post->ID , 'medium');
                $image_thumbnail = wp_get_attachment_image_src($_post->ID , 'thumbnail');
                $image_title = PhotoMosaic::esc_attr($_post->post_title);
                $image_alttext = PhotoMosaic::esc_attr(get_post_meta($_post->ID, '_wp_attachment_image_alt', true));
                $image_caption = PhotoMosaic::esc_attr($_post->post_excerpt);
                $image_description = $_post->post_content; // this is where we hide a link_url
                $image_attachment_page = get_attachment_link($_post->ID); // url for attachment page

                if ( $link_behavior === 'custom' && preg_match("#$pattern#i", $image_description) ) {
                    $url_data = ',"url": "' . $image_description . '"';
                } else if ( $link_behavior === 'attachment' ) {
                    $url_data = ',"url": "' . $image_attachment_page . '"';
                } else if ( is_array( $link_behavior ) ) {
                    $url_data = ',"url": "' . $link_behavior[ $_post->ID ] . '"';
                } else {
                    $url_data = '';
                }

                // Jetpack_Carousel hacks
                if ( class_exists('Jetpack_Carousel') ) {
                    $html = wp_get_attachment_link($_post->ID, 'full', false, false);
                    $dom = new DOMDocument();
                    $dom->loadHTML($html);
                    $node = $dom->getElementsByTagName('img')->item(0);
                    $attrs = array();
                    foreach ( $node->attributes as $attribute ) {
                        if ( strstr($attribute->name, 'data-') ) {
                            $attrs[$attribute->name] = $attribute->value;
                        }
                    }
                    $jetpack_data = ',"jetpack" : '. json_encode($attrs);
                } else {
                    $jetpack_data = ',"jetpack" : false';
                }

                $output_buffer .='{
                    "src": "' . $image_full[0] . '",
                    "thumb": "' . $image_medium[0] . '",
                    "sizes": {
                        "thumbnail" : "' . $image_thumbnail[0] . '",
                        "medium" : "' . $image_medium[0] . '",
                        "large" : "' . $image_large[0] . '",
                        "full" : "' . $image_full[0] . '"
                    },
                    "caption": "' . $image_caption . '",
                    "alt": "' . $image_alttext . '",
                    "width": "' . $image_full[1] . '",
                    "height": "' . $image_full[2] . '"
                    ' . $url_data . '
                    ' . $jetpack_data . '
                }';

                if($i != $len - 1) {
                    $output_buffer .=',';
                }

                $i++;
            }
        }

        return $output_buffer;
    }

    public static function gallery_from_nextgen($id, $link_behavior, $type) {
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

            // NextGen doesn't have attachment pages (that i can find)
            if ($link_behavior === 'attachment') {
                $link_behavior = 'image';
            }

            // is the description a URL
            if ( $link_behavior === 'custom' && preg_match("#$pattern#i", $image_description) ) {
                $url_data = ',"url": "' . $image_description . '"';
                $image_description = PhotoMosaic::esc_attr($image_alttext);
                $image_alttext = $image_description;

            } elseif ( $link_behavior === 'custom' && preg_match("#$pattern#i", $image_alttext) ) {
                $url_data = ',"url": "' . $image_alttext . '"';
                $image_description = PhotoMosaic::esc_attr($image_description);
                $image_alttext = $image_description;

            } else {
                $url_data = '';
                $image_description = PhotoMosaic::esc_attr($image_description);
                $image_alttext = PhotoMosaic::esc_attr($image_alttext);
            }

            $output_buffer .='{
                "src": "' . $picture->imageURL . '",
                "thumb": "' . $picture->thumbURL . '",
                "sizes": {
                    "thumbnail" : "' . $picture->thumbURL . '",
                    "full" : "' . $picture->imageURL . '"
                },
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

    public static function get_size_object($atts) {
        // we want to ignore thumbnails if they all have the same aspect ratio
        $images = array();
        $widths = array();
        $heights = array();
        $width_count = 0;
        $height_count = 0;
        $width_val = 0;
        $height_val = 0;
        $output = '';

        if ( empty($atts['nggid']) && empty($atts['ngaid']) ) {
            // it's a WP gallery
            $images = PhotoMosaic::gallery_from_wordpress($atts['id'], $atts['link_behavior'], $atts['include'], $atts['exclude'], $atts['ids'], true);

            foreach ( $images as $_post ) {
                $image_thumbnail = wp_get_attachment_image_src($_post->ID , 'thumbnail');
                array_push( $widths, $image_thumbnail[1] );
                array_push( $heights, $image_thumbnail[2] );
            }

        } else {
            // it's a NextGen gallery
            if ( !empty($atts['nggid']) ) {
                $images = array_merge( $images, nggdb::get_gallery($atts['nggid']) );

            } else if ( !empty($atts['ngaid']) ) {
                $album = nggdb::find_album( $atts['ngaid'] );
                $galleryIDs = $album->gallery_ids;
                foreach ($galleryIDs as $key => $galleryID) {
                    $images = array_merge( $images, nggdb::get_gallery($galleryID) );
                }

            }

            foreach ($images as $key => $image) {
                array_push( $widths, $image->meta_data['thumbnail']['width'] );
                array_push( $heights, $image->meta_data['thumbnail']['height'] );
            }
        }

        if ( !empty($images) ) {
            $width_count = array_count_values($widths);
            $width_val = array_search( max($width_count), $width_count );

            $height_count = array_count_values($heights);
            $height_val = array_search( max($height_count), $height_count );

            if ( count($width_count) === 1 && count($height_count) === 1 ) {
                // fixed dimensions
                $val = '1';
            } else {
                // proportional
                $val = (count($width_count) === 1 ? $width_val : $height_val);
            }

            if ( empty($atts['nggid']) && empty($atts['ngaid']) ) {
                $output ='
                    sizes: {
                        thumbnail: '. ($val === '1' ? $val : get_option("thumbnail_size_w") ) .',
                        medium: '. get_option("medium_size_w") .',
                        large: '. get_option("large_size_w") .'
                    },
                ';
            } else {
                $output .='
                    sizes: {
                        thumbnail: '. $val .'
                    },
                ';
            }
        }

        return $output;
    }

    public static function post_gallery( $empty = '', $atts = array() ) {
        global $post;

        $isPhotoMosaic = false;

        if ( isset($atts['photomosaic']) ) {
            if ( $atts['photomosaic'] === 'true' ) {
                $isPhotoMosaic = true;
            }
        } else if ( isset($atts['template']) ) {
            // deprecated in 2.4.1
            if ( $atts['template'] === 'photomosaic' ) {
                $isPhotoMosaic = true;
            }
        } else if ( isset($atts['theme']) ) {
            if ( $atts['theme'] === 'photomosaic' ) {
                $isPhotoMosaic = true;
            }
        }

        if ( !$isPhotoMosaic ) {
            return $empty;
        } else {
            $output = PhotoMosaic::shortcode($atts);
            return $output;
        }
    }

    public static function scrub_post_shortcodes ( $content, $post_id ) {
        // if we happen across any [gallery template="pm"]
        // change it to [gallery theme="pm"]
        if ( preg_match_all( '/\[gallery.*\]/', $content, $matches ) ) {
            foreach ( $matches[0] as $match ) {
                if (
                    strpos( $match, 'template="photomosaic"' ) !== false ||
                    strpos( $match, "template='photomosaic'" ) !== false
                ) {
                    $correct = str_replace( 'template=', 'theme=', $match );
                    $content = str_replace( $match, $correct, $content );
                }
            }
        }
        return $content;
    }

    public static function setup_admin_page() {
        if(isset($_POST['photomosaic_save'])) {
            $options = PhotoMosaic::get_options();

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

        add_menu_page(
            'PhotoMosaic v' . PhotoMosaic::version(), // page tite
            'PhotoMosaic', // menu title
            'update_plugins', // capability
            'photomosaic', // menu slug
            array('PhotoMosaic', 'render_admin_page'), // function
            plugins_url('/images/admin-page-icon.gif', __FILE__ ) // icon url
            // position
        );
    }

    public static function render_admin_page() {
        if ( !class_exists('MarkdownExtra_Parser') ) {
            require_once( 'includes/markdown.php' );
        }
        $options = PhotoMosaic::get_options();
        $options = PhotoMosaic::adjust_deprecated_options($options);
        ?>
        <script>
            if (!window.PhotoMosaic) {
                window.PhotoMosaic = {};
            }
        </script>
        <div class="wrap photomosaic">
            <h1>PhotoMosaic v<?php echo PhotoMosaic::version(); ?></h1>
            <?php
                $tabs = array(
                    // display name, id, file
                    array('Global Settings',   'form',        'global-settings.php'),
                    array('Usage',             'usage',       'usage.txt'),
                    array('Inline Attributes', 'inlineattrs', 'inline-attributes.txt'),
                    array('FAQ',               'faq',         'faq.php'),
                    array("What's New",        'whatsnew',    'whatsnew.txt')
                );
            ?>
            <h2 class="nav-tab-wrapper">
                <?php foreach ($tabs as $tab) : ?>
                    <a class="nav-tab" href="#tab-<?php echo $tab[1]; ?>"><?php echo $tab[0]; ?></a>
                <?php endforeach; ?>
            </h2>

            <?php foreach ($tabs as $tab) : ?>
                <div class="tab" id="tab-<?php echo $tab[1]; ?>">
                    <?php
                        $url = 'includes/admin-markup/' . $tab[2];

                        if ( strpos($tab[2], '.txt') === false) {
                            include( $url );
                        } else {
                            $text = file_get_contents( dirname(__file__) . '/' . $url );
                            echo Markdown($text);
                        }
                    ?>
                </div>
            <?php endforeach; ?>

        </div>
        <?php
    }

    public static function plugin_action_links($links, $file) {
        // http://wp.smashingmagazine.com/2011/03/08/ten-things-every-wordpress-plugin-developer-should-know/
        static $this_plugin;

        if (!$this_plugin) {
            $this_plugin = plugin_basename(__FILE__);
        }

        if ($file == $this_plugin) {
            $settings_link = '<a href="' . get_bloginfo('wpurl') . '/wp-admin/admin.php?page=photomosaic">Settings</a>';
            array_unshift($links, $settings_link);
        }

        return $links;
    }

    public static function include_github_updater () {
        if ( !(isset($_GET['action']) && $_GET['action'] == 'activate') ) {
            if ( !class_exists('GitHub_Plugin_Updater') ) {
                require_once( 'includes/vendor/github-updater/github-updater.php' );
            }
        }
    }

    public static function wordpress_gallery_shortcode($attr) {
        // this function is taken directly from the WP (3.8.1) core (wp-includes/media.php#gallery_shortcode)
        // with 2 exceptions:
        // - the post_gallery filter call has been commented-out
        // - the entire output is wrapped in a noscript
        $post = get_post();

        static $instance = 0;
        $instance++;

        if ( ! empty( $attr['ids'] ) ) {
            // 'ids' is explicitly ordered, unless you specify otherwise.
            if ( empty( $attr['orderby'] ) )
                $attr['orderby'] = 'post__in';
            $attr['include'] = $attr['ids'];
        }

        // !!! EDIT - COMMENTED OUT !!!
        // Allow plugins/themes to override the default gallery template.
        // $output = apply_filters('post_gallery', '', $attr);
        // if ( $output != '' )
        //     return $output;

        // We're trusting author input, so let's at least make sure it looks like a valid orderby statement
        if ( isset( $attr['orderby'] ) ) {
            $attr['orderby'] = sanitize_sql_orderby( $attr['orderby'] );
            if ( !$attr['orderby'] )
                unset( $attr['orderby'] );
        }

        extract(shortcode_atts(array(
            'order'      => 'ASC',
            'orderby'    => 'menu_order ID',
            'id'         => $post ? $post->ID : 0,
            'itemtag'    => 'dl',
            'icontag'    => 'dt',
            'captiontag' => 'dd',
            'columns'    => 3,
            'size'       => 'thumbnail',
            'include'    => '',
            'exclude'    => '',
            'link'       => ''
        ), $attr, 'gallery'));

        $id = intval($id);
        if ( 'RAND' == $order )
            $orderby = 'none';

        if ( !empty($include) ) {
            $_attachments = get_posts( array('include' => $include, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );

            $attachments = array();
            foreach ( $_attachments as $key => $val ) {
                $attachments[$val->ID] = $_attachments[$key];
            }
        } elseif ( !empty($exclude) ) {
            $attachments = get_children( array('post_parent' => $id, 'exclude' => $exclude, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );
        } else {
            $attachments = get_children( array('post_parent' => $id, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );
        }

        if ( empty($attachments) )
            return '';

        if ( is_feed() ) {
            $output = "\n";
            foreach ( $attachments as $att_id => $attachment )
                $output .= wp_get_attachment_link($att_id, $size, true) . "\n";
            return $output;
        }

        $itemtag = tag_escape($itemtag);
        $captiontag = tag_escape($captiontag);
        $icontag = tag_escape($icontag);
        $valid_tags = wp_kses_allowed_html( 'post' );
        if ( ! isset( $valid_tags[ $itemtag ] ) )
            $itemtag = 'dl';
        if ( ! isset( $valid_tags[ $captiontag ] ) )
            $captiontag = 'dd';
        if ( ! isset( $valid_tags[ $icontag ] ) )
            $icontag = 'dt';

        $columns = intval($columns);
        $itemwidth = $columns > 0 ? floor(100/$columns) : 100;
        $float = is_rtl() ? 'right' : 'left';

        $selector = "gallery-{$instance}";

        $gallery_style = $gallery_div = '';
        if ( apply_filters( 'use_default_gallery_style', true ) )
            $gallery_style = "
            <style type='text/css'>
                #{$selector} {
                    margin: auto;
                }
                #{$selector} .gallery-item {
                    float: {$float};
                    margin-top: 10px;
                    text-align: center;
                    width: {$itemwidth}%;
                }
                #{$selector} img {
                    border: 2px solid #cfcfcf;
                }
                #{$selector} .gallery-caption {
                    margin-left: 0;
                }
                /* see gallery_shortcode() in wp-includes/media.php */
            </style>";
        $size_class = sanitize_html_class( $size );
        $gallery_div = "<div id='$selector' class='gallery galleryid-{$id} gallery-columns-{$columns} gallery-size-{$size_class}'>";
        $output = apply_filters( 'gallery_style', $gallery_style . "\n\t\t" . $gallery_div );

        $i = 0;
        foreach ( $attachments as $id => $attachment ) {
            if ( ! empty( $link ) && 'file' === $link )
                $image_output = wp_get_attachment_link( $id, $size, false, false );
            elseif ( ! empty( $link ) && 'none' === $link )
                $image_output = wp_get_attachment_image( $id, $size, false );
            else
                $image_output = wp_get_attachment_link( $id, $size, true, false );

            $image_meta  = wp_get_attachment_metadata( $id );

            $orientation = '';
            if ( isset( $image_meta['height'], $image_meta['width'] ) )
                $orientation = ( $image_meta['height'] > $image_meta['width'] ) ? 'portrait' : 'landscape';

            $output .= "<{$itemtag} class='gallery-item'>";
            $output .= "
                <{$icontag} class='gallery-icon {$orientation}'>
                    $image_output
                </{$icontag}>";
            if ( $captiontag && trim($attachment->post_excerpt) ) {
                $output .= "
                    <{$captiontag} class='wp-caption-text gallery-caption'>
                    " . wptexturize($attachment->post_excerpt) . "
                    </{$captiontag}>";
            }
            $output .= "</{$itemtag}>";
            if ( $columns > 0 && ++$i % $columns == 0 )
                $output .= '<br style="clear: both" />';
        }

        $output .= "
                <br style='clear: both;' />
            </div>\n";

        // !!! EDIT - the following line has been added !!!
        $output = "<noscript>" . $output . "</noscript>";

        return $output;
    }

    public static function the_posts( $posts ) {
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

    public static function ajax_handler () {
        // not currently being used
        $options = PhotoMosaic::get_options();
        die(json_encode($options));
    }

    public static function comparable_version ($version) {
        $v = explode('.', $version);
        if ( !isset( $v[2] ) ) {
            $v[2] = 0;
        }
        return ($v[0] * 10000 + $v[1] * 100 + $v[2]);
    }

    private static function esc_attr( $text ) {
        $text = trim($text);
        // lifted from wp-includes/formatting.php # esc_attr
        $safe_text = wp_check_invalid_utf8( $text );
        $safe_text = _wp_specialchars( $safe_text, "double" );
        return apply_filters( 'attribute_escape', $safe_text, $text );
    }

    private static function makeID() {
        // a modification of the GUID function in the Phunction framework
        // http://sourceforge.net/projects/phunction/
        return sprintf('%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
    }

} // end PhotoMosaic


// Template Tag
function wp_photomosaic( $atts ){
    if (!is_admin()) {
        echo PhotoMosaic::shortcode( $atts );
    }
}
?>