<?php
/*
Plugin Name: PhotoMosaic
Plugin URI: http://codecanyon.net/item/photomosaic-for-wordpress/243422?ref=makfak
Description: Adds a new display template for your WordPress and NextGen galleries. See the <a href="/wp-admin/admin.php?page=photomosaic">options page</a> for examples and instructions.
Author: makfak
Author URI: http://www.codecanyon.net/user/makfak?ref=makfak
Version: 2.4.8
*/

if(preg_match('#' . basename(__FILE__) . '#', $_SERVER['PHP_SELF'])) { 
    die('Illegal Entry');
}

add_action('init', array('PhotoMosaic', 'init'));

class PhotoMosaic {

    // http://daringfireball.net/2010/07/improved_regex_for_matching_urls
    public static $URL_PATTERN = "(?i)\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))";

    public static function version () {
        return '2.4.8';
    }

    public static function comparable_version ($version) {
        $v = explode('.', $version);
        if ( !isset( $v[2] ) ) {
            $v[2] = 0;
        }
        return ($v[0] * 10000 + $v[1] * 100 + $v[2]);
    }

    public static function init() {
        ob_start(); // prevents the `echo` below from throwing an error when deleting a post
        global $pagenow;
        $options = get_option('photomosaic_options');

        add_filter( 'widget_text', 'do_shortcode' ); // Widget
        // add_filter( 'the_posts', array( __CLASS__, 'the_posts' ) ); // :: conditionally enqueue JS & CSS
        add_filter( 'post_gallery', array( __CLASS__, 'post_gallery' ), 10, 2 ); // [gallery photomosaic="true" theme="photomosaic"]
        add_filter( 'content_edit_pre', array( __CLASS__, 'scrub_post_shortcodes' ), 10, 2 ); // template="pm" --> theme="pm"
        add_filter( 'plugin_action_links', array( __CLASS__, 'plugin_action_links' ), 10, 2);

        add_action( 'admin_menu', array('PhotoMosaic', 'setupAdminPage') );
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

            add_shortcode( 'photoMosaic', array( __CLASS__, 'shortcode' ) );
            add_shortcode( 'photomosaic', array( __CLASS__, 'shortcode' ) );

        } else {
            if ( isset($_GET['page']) ) {
                if ( $_GET['page'] == "photoMosaic.php" || $_GET['page'] == "photomosaic" ) {
                    wp_enqueue_script( 'photomosaic_admin_js', plugins_url('/js/jquery.photoMosaic.wp.admin.js', __FILE__ ), array('photomosaic'));
                    wp_enqueue_style( 'photomosaic_admin_css', plugins_url('/css/photoMosaic.admin.css', __FILE__ ));
                }
            }

            if (
                    isset( $_GET['post'] ) ||
                    in_array( $pagenow, array( 'post-new.php' ) )
            ) {
                wp_enqueue_script( 'photomosaic_editor_js', plugins_url('/js/jquery.photoMosaic.editor.js', __FILE__ ), array('photomosaic'));
                echo('
                    <script>
                        if (!window.PhotoMosaic) {
                            window.PhotoMosaic = {};
                        }
                        window.PhotoMosaic.l10n = {
                            theme : "'. _('Theme') .'"
                        }
                    </script>
                ');
            }

            wp_enqueue_style( 'menu', plugins_url('/css/photoMosaic.menu.css', __FILE__ ));
        }
    }

    public static function getOptions() {
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

    public static function adjustDeprecatedOptions($options) {
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

    public static function ajaxHandler () {
        // not currently being used
        $options = PhotoMosaic::getOptions();
        die(json_encode($options));
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
            <!-- PhotoMosaic v'. PhotoMosaic::version() .' -->
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

        $output_buffer .= PhotoMosaic::getSizeObj($atts);

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
        } else if ( class_exists('Jetpack_Carousel') ) {
            // Jetpack :: Carousel support
            $output_buffer .='
                    modal_ready_callback : function($photomosaic){
                        var data;
                        var id;
                        var $fragment;
                        var $img;
                        var $a;
                        var self = this;

                        $("a", $photomosaic).each(function () {
                            $a = $(this);
                            $img = $a.find("img");
                            id = $img.attr("id");
                            data = self.deepSearch( self.images, "id", id );

                            $img.attr( data.jetpack );

                            $a.addClass("gallery-item");
                        });

                        $($photomosaic).parent().addClass("gallery");
                    },
            ';
        }

        $output_buffer .='
                        order: "'. $settings['order'] .'"
                    });
                });
            </script>';

        $gallery_div = '<div id="photoMosaicTarget'. $unique .'" data-version="'. PhotoMosaic::version() .'">';

        /* Jetpack :: Carousel hack - it needs an HTML string to append it's data */
        if ( class_exists('Jetpack_Carousel') ) {
            $gallery_style = "<style type='text/css'></style>";
            $output_buffer .= apply_filters( 'gallery_style', $gallery_style . "\n\t\t" . $gallery_div );
        } else {
            $output_buffer .= $gallery_div;
        }

        $output_buffer .='</div>';

        return preg_replace('/\s+/', ' ', $output_buffer);
    }

    public static function galleryFromWP($id, $link_to_url, $include, $exclude, $ids) {
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
                $image_thumbnail = wp_get_attachment_image_src($_post->ID , 'thumbnail');
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

    public static function galleryFromNextGen($id, $link_to_url, $type) {
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

    public static function getSizeObj($atts) {
        $images = array();
        $output = '';

        if ( !empty($atts['nggid']) ) {
            $images = array_merge( $images, nggdb::get_gallery($atts['nggid']) );

        } else if ( !empty($atts['ngaid']) ) {
            $album = nggdb::find_album( $atts['ngaid'] );
            $galleryIDs = $album->gallery_ids;
            foreach ($galleryIDs as $key => $galleryID) {
                $images = array_merge( $images, nggdb::get_gallery($galleryID) );
            }

        } else {
            // we're dealing with Wordpress and this is easy
            $output ='
                sizes: {
                    thumbnail: '. get_option("thumbnail_size_w") .',
                    medium: '. get_option("medium_size_w") .',
                    large: '. get_option("large_size_w") .'
                },
            ';
        }

        if ( !empty($images) ) {
            // we're dealing with NextGen and life is horrible
            $width_mem = array();
            $width_count = 0;
            $width_val = 0;

            $height_mem = array();
            $height_count = 0;
            $height_val = 0;

            foreach ($images as $key => $image) {
                array_push( $width_mem, $image->meta_data['thumbnail']['width'] );
                array_push( $height_mem, $image->meta_data['thumbnail']['height'] );
            }

            $width_count = array_count_values($width_mem);
            $width_val = array_search( max($width_count), $width_count );

            $height_count = array_count_values($height_mem);
            $height_val = array_search( max($height_count), $height_count );

            if ( count($width_count) === 1 && count($height_count) === 1 ) {
                // fixed dimensions
                $val = '1';
            } else {
                // proportional
                $val = (count($width_count) === 1 ? $width_val : $height_val);
            }

            $output .='
                sizes: {
                    thumbnail: '. $val .'
                },
            ';
        }

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

    public static function post_gallery( $empty = '', $atts = array() ) {
        if ( !empty( $empty ) ) { // something else is overriding post_gallery, like a custom VIP shortcode
            return $empty;
        }
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

    public static function setupAdminPage() {
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

        add_menu_page(
            'PhotoMosaic v' . PhotoMosaic::version(),
            'PhotoMosaic',
            'update_plugins',
            'photomosaic', // basename(__FILE__) == 'photoMosaic.php'
            array('PhotoMosaic', 'renderAdminPage'),
            'div'
        );
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

    public static function renderAdminPage() {
        require_once( 'includes/Markdown.php' );
        $options = PhotoMosaic::getOptions();
        $options = PhotoMosaic::adjustDeprecatedOptions($options);
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

} // end PhotoMosaic


// Template Tag
function wp_photomosaic( $atts ){
    if (!is_admin()) {
        echo PhotoMosaic::shortcode( $atts );
    }
}
?>