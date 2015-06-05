<?php

class Photomosaic_Public {

    protected $plugin_name;
    protected $version;
    protected $oldest_supported_wp = '3.5';
    protected $url_pattern = "(?i)\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))";
    protected $lightbox = null;
    protected $transient_key = "pm_";
    protected $transient_expiry = 3600; // 1 hour (in seconds) = 60*60*1

    public function __construct ( $plugin_name, $version ) {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }

    public function enqueue_styles () {
        global $photomosaic;

        wp_enqueue_style( $this->plugin_name, $this->relative_url('css/photomosaic.css'), array(), $this->version, 'all');

        wp_add_inline_style( $this->plugin_name, $photomosaic->get_option('custom_css') );

        if ( !is_admin() && $photomosaic->get_option('lightbox')) {
            wp_enqueue_style( $this->plugin_name . '-lightbox', $this->relative_url('vendor/prettyphoto/prettyphoto.css'), array(), $this->version, 'all' );
        }
    }

    public function enqueue_scripts () {
        global $photomosaic;

        wp_register_script( 'react', '//cdnjs.cloudflare.com/ajax/libs/react/0.12.2/react.min.js', null, '0.12.2', true );

        if ( $this->in_debug_mode() ) {
            wp_register_script( $this->plugin_name, $this->relative_url('js/photomosaic.js') , array('jquery','react'), $this->version, true );
        } else {
            wp_register_script( $this->plugin_name, $this->relative_url('js/photomosaic.min.js'), array('jquery','react'), $this->version, true );
        }

        wp_enqueue_script( $this->plugin_name . '-localize', $this->relative_url('js/localize.js'), array( $this->plugin_name ), $this->version, true );
        wp_enqueue_script( $this->plugin_name );

        if ( !is_admin() && $photomosaic->get_option('lightbox')) {
            // TODO : make prettyphoto an external include
            // wp_enqueue_script( $this->plugin_name . '-lightbox', $this->relative_url('vendor/prettyphoto/jquery.prettyPhoto.js'), array(), $this->version, true );
        }
    }

    public function shortcode ( $atts ) {
        global $post, $photomosaic;

        $error = $this->has_errors( $atts );

        if ( $error ) {
            return $error;
        }

        $post_id = intval($post->ID);
        $base = array(
            'id'        => $post_id,
            'include'   => '',
            'exclude'   => '',
            'ids'       => ''
        );

        $options = $photomosaic->get_options();
        $options = wp_parse_args($base, $options);
        $settings = wp_parse_args($atts, $options);
        $this->transient_key = 'pm_' . hash( 'md4', json_encode( $settings ) );

        if ( empty($atts['limit']) ) {
            $atts['limit'] = null;
        }

        $required_atts = array('id', 'include', 'exclude', 'ids');
        foreach ( $required_atts as $key ) {
            if( empty( $atts[$key] ) ){
                $atts[$key] = $settings[$key];
            }
        }

        $unique = $this->make_id();

        $target = 'photoMosaicTarget' . $unique;

        $this->localize_placeholder( $target, $unique );
        $gallery = $this->localize_gallery_data( $settings, $atts, $unique );
        $settings = $this->localize_settings( $settings, $atts, $unique );
        $fallback = $this->localize_fallback( $settings, $unique );

        $output_buffer = '';
        $gallery_div = '<div id="'. $target .'" class="photoMosaicTarget" data-version="'. $this->version .'">';

        // Jetpack :: Carousel hack - it needs an HTML string to append it's data
        if ( class_exists('Jetpack_Carousel') ) {
            $gallery_style = "<style type='text/css'></style>";
            $output_buffer .= apply_filters( 'gallery_style', $gallery_style . "\n\t\t" . $gallery_div );
        } else {
            $output_buffer .= $gallery_div;
        }

        $output_buffer .= "<noscript>" . $fallback . "</noscript>";
        $output_buffer .='</div>';

        return preg_replace('/\s+/', ' ', $output_buffer);
    }

    public function localize_placeholder ( $target, $id ) {
        $this->localize(
            $this->plugin_name . '-localize',
            'PhotoMosaic.WP["'. $id . '"]',
            array(
                'target' => $target,
                'gallery' => false,
                'settings' => false,
                'lightbox_callback' => false
            )
        );
    }

    public function localize_settings ( $settings, $atts, $id ) {
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

        if ( !empty( $atts['category'] ) && empty( $atts['link_behavior'] ) ) {
            $settings['lightbox'] = false;
            $settings['custom_lightbox'] = false;
        }

        if ( strpos($settings['columns'], '-') !== false ) {
            $range = explode('-', $settings['columns']);
            $settings['min_columns'] = $range[0];
            $settings['max_columns'] = $range[1];
            $settings['columns'] = 'auto';
        }

        $auto_settings = array(
            'height', 'width', 'columns', 'min_columns', 'max_columns'
        );
        foreach ( $auto_settings as $key ) {
            if( intval($settings[$key]) == 0 ){
                $settings[$key] = "auto";
            } elseif ( strpos($settings[$key], '%') !== false ) {
                $settings[$key] = $settings[$key];
            } else {
                $settings[$key] = intval($settings[$key]);
            }
        }

        $bool_settings = array(
            'center', 'prevent_crop', 'links', 'external_links', 'show_loading',
            'resize_transition', 'lightbox', 'custom_lightbox', 'lightbox_group'
        );
        foreach ( $bool_settings as $key ) {
            if ( array_key_exists($key, $settings) ) {
                if(intval($settings[$key])){
                    $settings[$key] = true;
                } else {
                    $settings[$key] = false;
                }
            }
        }

        $int_false_settings = array(
            'lazyload'
        );
        foreach ( $int_false_settings as $key ) {
            if ( trim($settings[$key]) == '' || $settings[$key] == 'false' ) {
                $settings[$key] = false;
            } else {
                $settings[$key] = intval($settings[$key]);
            }
        }

        $int_settings = array(
            'padding', 'min_column_width'
        );
        foreach ( $int_settings as $key ) {
            $settings[$key] = intval( $settings[$key] );
        }

        // convert 'link_behavior' to 'links'
        if ( $settings['link_behavior'] === 'none' ) {
            $settings['links'] = false;
        } else {
            $settings['links'] = true;
        }

        $rename_settings = array(
            array('lightbox_group', 'modal_group'),
            array('lightbox_rel', 'modal_name'),
        );
        foreach ( $rename_settings as $s ) {
            $settings[$s[1]] = $settings[$s[0]];
        }

        $settings['sizes'] = $this->get_size_object( $settings );

        $settings['modal_hash'] = hash( 'crc32', json_encode( $atts ) );

        $settings['id'] = $id;

        // before we trim the settings
        $this->localize_lightbox( $settings, $atts, $id );

        $settings = wp_array_slice_assoc( $settings, array(
            'center', 'columns', 'custom_lightbox', 'external_links', 'height', 'id',
            'lazyload', 'lightbox', 'lightbox_rendition', 'link_behavior', 'links', 'loading_transition',
            'max_columns', 'min_columns', 'min_column_width', 'modal_group', 'modal_hash',
            'modal_name', 'modal_ready_callback', 'onready_callback', 'order', 'padding',
            'prevent_crop', 'resize_transition', 'show_loading', 'sizes', 'width',
            // these need to be typed
            'align', 'allow_orphans', 'layout', 'max_row_height', 'orphans', 'rows', 'shape', 'sizing'
        ) );

        // TODO : vet all settings for type (make sure ints are ints, etc.)
        $this->localize(
            $this->plugin_name . '-localize',
            'PhotoMosaic.WP["'. $id . '"].settings',
            $settings
        );

        $this->localize(
            $this->plugin_name . '-localize',
            'PhotoMosaic.WP["'. $id . '"].settings.modal_ready_callback',
            $settings['onready_callback'],
            true
        );

        return $settings;
    }

    public function localize_lightbox ( $settings, $atts, $id ) {
        $is_default = !empty( $settings['lightbox'] );
        $is_custom  = !empty( $settings['custom_lightbox'] );
        $is_jetpack = class_exists( 'Jetpack_Carousel' );
        $has_bridge = !empty( $this->lightbox );
        $should_lightbox = (
            ( empty($atts['category']) && ($settings['link_behavior'] == 'image') ) ||
            ( !empty($atts['category']) && !empty($atts['link_behavior']) && $atts['link_behavior'] == 'image' )
        );

        if ( !$should_lightbox ) {
            $function = false;

        } elseif ( $has_bridge ) {
            $function = 'function ($, $mosaic, $items) {
                PhotoMosaic.LightboxBridge.' . $this->lightbox . '.apply(this, [$, $mosaic, $items])
            }';

        } elseif ( $is_jetpack ) { // TODO : test this
            $function = 'function ($, $mosaic, $items) {
                var data;
                var id;
                var $fragment;
                var $img;
                var $a;
                var self = this;

                $items.each(function () {
                    $a = $(this);
                    $img = $a.find("img");
                    id = $img.attr("id");
                    data = PhotoMosaic.Utils.deepSearch( self.opts.gallery, "id", id );

                    $img.attr( data.jetpack );

                    $a.addClass("gallery-item");
                });

                $mosaic.parent().addClass("gallery");
            }';

        } elseif ( $is_custom ) {
            $function = 'function ($, $mosaic, $items) {
                jQuery("a[rel^=\''.$settings['lightbox_rel'].'\']", $mosaic).'.$settings['custom_lightbox_name'].'('.$settings['custom_lightbox_params'].');
            }';

        } elseif ( $is_default ) {
            $function = 'function ($, $mosaic, $items) {
                var $fallback_items = $mosaic.find(".gallery-item a");
                $items.add( $fallback_items ).prettyPhoto({
                    overlay_gallery: false,
                    slideshow: false,
                    theme: "pp_default",
                    deeplinking: false,
                    show_title: false,
                    social_tools: ""
                });
            }';

        } else {
            $function = false;
        }

        if ( $function ) {
            $this->localize(
                $this->plugin_name . '-localize',
                'PhotoMosaic.WP["'. $id . '"].lightbox_callback',
                $function,
                true
            );
        }

        return $this->lightbox;
    }

    public function localize_gallery_data ( $settings, $atts, $id ) {
        if ( !empty( $atts['nggid'] ) ) {
            $gallery = $this->gallery_from_nextgen( $atts['nggid'], $settings['link_behavior'], 'gallery' );

        } else if ( !empty( $atts['ngaid'] ) ) {
            $gallery = $this->gallery_from_nextgen( $atts['ngaid'], $settings['link_behavior'], 'album' );

        } else if ( !empty( $atts['category'] ) ) {
            if ( $atts['category'] == 'recent' || $atts['category'] == 'latest' ) {
                $recent_images = $this->recent_posts_images( $atts['limit'] );
            } else {
                $recent_images = $this->recent_posts_images( $atts['limit'], $atts['category'] );
            }

            if ( !empty( $atts['link_behavior'] ) ) {
                $link_behavior = $atts['link_behavior'];
            } else {
                $link_behavior = $recent_images;
            }

            $ids = array_keys( $recent_images );
            $gallery = $this->gallery_from_wordpress( $settings['id'], $link_behavior, $settings['include'], $settings['exclude'], $ids );

        } else {
            $gallery = $this->gallery_from_wordpress( $settings['id'], $settings['link_behavior'], $settings['include'], $settings['exclude'], $settings['ids'] );
        }

        $this->localize(
            $this->plugin_name . '-localize',
            'PhotoMosaic.WP["'. $id . '"].gallery',
            $gallery
        );

        return $gallery;
    }

    public function localize_fallback ( $settings, $id ) {
        $fallback = $this->make_fallback( $settings );

        $this->localize(
            $this->plugin_name . '-localize',
            'PhotoMosaic.WP["'. $id .'"].fallback',
            $fallback
        );

        return $fallback;
    }

    public function gallery_from_wordpress ( $id, $link_behavior, $include, $exclude, $ids, $return_img_obj = false ) {
        global $wp_version;

        $transient_suffix = ( $return_img_obj ? '_a' : '_b' );
        $transient_key = $this->transient_key . $transient_suffix;
        $transient = get_transient( $transient_key );

        if ( $transient !== false ) {
            return $transient;
        }

        $gallery = array();
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
            set_transient( $transient_key, $attachments, $this->transient_expiry );
            return $attachments;
        }

        if ( !empty($attachments) ) {
            $pattern = $this->url_pattern;

            foreach ( $attachments as $_post ) {
                $image_full = wp_get_attachment_image_src($_post->ID , 'full');
                $image_large = wp_get_attachment_image_src($_post->ID , 'large');
                $image_medium = wp_get_attachment_image_src($_post->ID , 'medium');
                $image_thumbnail = wp_get_attachment_image_src($_post->ID , 'thumbnail');
                $image_title = $this->esc_attr( $_post->post_title );
                $image_alttext = $this->esc_attr( get_post_meta($_post->ID, '_wp_attachment_image_alt', true) );
                $image_caption = $this->esc_attr( $_post->post_excerpt );
                $image_description = $_post->post_content; // this is where we hide a link_url
                $image_attachment_page = get_attachment_link($_post->ID); // url for attachment page
                $url_data = false;
                $jetpack_data = false;

                if ( $link_behavior === 'custom' && preg_match("#$pattern#i", $image_description) ) {
                    $url_data = $image_description;
                } else if ( $link_behavior === 'attachment' ) {
                    $url_data = $image_attachment_page;
                } else if ( is_array( $link_behavior ) ) {
                    // this is a category gallery - link to the post and set the post_title as the caption
                    $url_data = $link_behavior[ $_post->ID ]['url'];
                    $image_caption = $link_behavior[ $_post->ID ]['title'];
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
                    $jetpack_data = $attrs;
                }

                $image = array(
                    'title' => $image_title,
                    'caption' => $image_caption,
                    'alt' => $image_alttext,
                    'description' => $image_description,
                    'sizes' => array(
                        'thumbnail' => $image_thumbnail[0],
                        'medium' => $image_medium[0],
                        'large' => $image_large[0],
                        'full' => $image_full[0]
                    ),
                    'thumb' => $image_medium[0],
                    'src' => $image_full[0],
                    'width' => $image_full[1],
                    'height' => $image_full[2]
                );

                if ( $url_data ) {
                    $image['url'] = $url_data;
                }

                if ( $jetpack_data ) {
                    $image['jetpack'] = $jetpack_data;
                }

                $gallery[] = $image;
            }
        }

        set_transient( $transient_key, $gallery, $this->transient_expiry );
        return $gallery;
    }

    public function gallery_from_nextgen ( $id, $link_behavior, $type ) {
        global $wpdb, $post;

        $transient_key = $this->transient_key . '_c';
        $transient = get_transient( $transient_key );

        if ( $transient !== false ) {
            return $transient;
        }

        $gallery = array();
        $pattern = $this->url_pattern;
        $picturelist = array();

        if ( $type === 'gallery' ) {
            $picturelist = array_merge( $picturelist, nggdb::get_gallery($id) );
        } else {
            $album = nggdb::find_album( $id );
            $galleryIDs = $album->gallery_ids;
            foreach ($galleryIDs as $key => $galleryID) {
                $picturelist = array_merge( $picturelist, nggdb::get_gallery($galleryID) );
            }
        }

        foreach ($picturelist as $key => $picture) {
            $image_description = $picture->description;
            $image_alttext = $picture->alttext;

            // NextGen doesn't have attachment pages (that i can find)
            if ($link_behavior === 'attachment') {
                $link_behavior = 'image';
            }

            // is the description a URL
            if ( $link_behavior === 'custom' && preg_match("#$pattern#i", $image_description) ) {
                $url_data = $image_description;
                $image_description = $this->esc_attr( $image_alttext );
                $image_alttext = $image_description;

            } elseif ( $link_behavior === 'custom' && preg_match("#$pattern#i", $image_alttext) ) {
                $url_data = $image_alttext;
                $image_description = $this->esc_attr( $image_description );
                $image_alttext = $image_description;

            } else {
                $url_data = false;
                $image_description = $this->esc_attr( $image_description );
                $image_alttext = $this->esc_attr( $image_alttext );
            }

            $image = array(
                'caption' => $image_description,
                'alt' => $image_alttext,
                'sizes' => array(
                    'thumbnail' => $picture->thumbURL,
                    'full' => $picture->imageURL
                ),
                'thumb' => $picture->thumbURL,
                'src' => $picture->imageURL,
                'width' => $picture->meta_data['width'],
                'height' => $picture->meta_data['height']
            );

            if ( $url_data ) {
                $image['url'] = $url_data;
            }

            $gallery[] = $image;
        }

        set_transient( $transient_key, $gallery, $this->transient_expiry );
        return $gallery;
    }

    public function recent_posts_images ( $limit = null, $category = null ) {
        if ( empty($limit) ) {
            $limit = 10;
        }

        $transient_key = $this->transient_key . '_d';
        $transient = get_transient( $transient_key );

        if ( $transient !== false ) {
            return $transient;
        }

        $response = array();

        if ( empty($category) ) {
            $args = array(
                'numberposts' => $limit,
                'post_status' => 'publish',
                'post_type' => 'any'
            );
            $posts = wp_get_recent_posts( $args );
        } else {
            $args = array(
                'numberposts' => $limit,
                'post_status' => array('publish', 'inherit'),
                'post_type' => 'any'
            );
            $posts = array();
            $cat_map = explode( ',', $category );
            $cat_args = array_fill(0, count($cat_map), $args);
            $cat_map = array_map( array($this, 'fetch_taxonomy_categories'), $cat_map, $cat_args );

            // flatten one level
            foreach ($cat_map as $cat_arr) {
                foreach ($cat_arr as $arr) {
                    array_push($posts, $arr);
                }
            }
        }
        foreach ($posts as $post) {
            if ( $post['post_type'] === 'attachment' ) {
                $id = $post['ID'];
            } else {
                $id = get_post_thumbnail_id( $post['ID'] );
            }
            $title = $post['post_title'];

            if ( !empty( $id ) ) {
                $response[ $id ] = array(
                    'url' => get_permalink( $post['ID'] ),
                    'title' => $title
                );
            } else {
                $response[ $id ] = "";
            }
        }

        set_transient( $transient_key, $response, 60*10 ); // 10 minutes
        return $response;
    }

    public function post_gallery ( $empty = '', $atts = array() ) {
        global $post;

        $is_pm = false;

        if ( isset( $atts['photomosaic'] ) ) {
            if ( $atts['photomosaic'] === 'true' ) {
                $is_pm = true;
            }
        } else if ( isset( $atts['template'] ) ) {
            // deprecated in 2.4.1
            if ( $atts['template'] === 'photomosaic' ) {
                $is_pm = true;
            }
        } else if ( isset( $atts['theme'] ) ) {
            if ( $atts['theme'] === 'photomosaic' ) {
                $is_pm = true;
            }
        }

        if ( !$is_pm ) {
            return $empty;
        } else {
            return $this->shortcode( $atts );
        }
    }

    private function make_fallback ( $settings ) {
        if ( !empty($settings['nggid']) || !empty($settings['nggaid']) ) {
            return $this->nextgen_gallery_fallback( $settings );
        } else {
            return $this->wordpress_gallery_fallback( $settings );
        }
    }

    private function wordpress_gallery_fallback ( $attr ) {
        $transient_key = $this->transient_key . '_e';
        $transient = get_transient( $transient_key );

        if ( $transient !== false ) {
            return $transient;
        }

        // this function is taken directly from the WP (4.1.1) core (wp-includes/media.php#gallery_shortcode)
        // the post_gallery filter has been commented-out
        if ( empty( $attr['link'] ) ) {
            if ( $attr['link_behavior'] == 'image' ) {
                $attr['link'] = 'file';
            } else if ( $attr['link_behavior'] == 'none' ) {
                $attr['link'] = 'none';
            } else if ( $attr['link_behavior'] == 'attachment' ) {
                // do nothing - attachment is the default
            }
        }

        // === BEGIN gallery_shortcode === //
            $post = get_post();

            static $instance = 0;
            $instance++;

            if ( ! empty( $attr['ids'] ) ) {
                // 'ids' is explicitly ordered, unless you specify otherwise.
                if ( empty( $attr['orderby'] ) ) {
                    $attr['orderby'] = 'post__in';
                }
                $attr['include'] = $attr['ids'];
            }

            // !!! EDIT - Commented-Out
            // $output = apply_filters( 'post_gallery', '', $attr );
            // if ( $output != '' ) {
            //     return $output;
            // }

            $html5 = current_theme_supports( 'html5', 'gallery' );
            $atts = shortcode_atts( array(
                'order'      => 'ASC',
                'orderby'    => 'menu_order ID',
                'id'         => $post ? $post->ID : 0,
                'itemtag'    => $html5 ? 'figure'     : 'dl',
                'icontag'    => $html5 ? 'div'        : 'dt',
                'captiontag' => $html5 ? 'figcaption' : 'dd',
                'columns'    => 3,
                'size'       => 'thumbnail',
                'include'    => '',
                'exclude'    => '',
                'link'       => ''
            ), $attr, 'gallery' );

            $id = intval( $atts['id'] );

            if ( ! empty( $atts['include'] ) ) {
                $_attachments = get_posts( array( 'include' => $atts['include'], 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $atts['order'], 'orderby' => $atts['orderby'] ) );

                $attachments = array();
                foreach ( $_attachments as $key => $val ) {
                    $attachments[$val->ID] = $_attachments[$key];
                }
            } elseif ( ! empty( $atts['exclude'] ) ) {
                $attachments = get_children( array( 'post_parent' => $id, 'exclude' => $atts['exclude'], 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $atts['order'], 'orderby' => $atts['orderby'] ) );
            } else {
                $attachments = get_children( array( 'post_parent' => $id, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $atts['order'], 'orderby' => $atts['orderby'] ) );
            }

            if ( empty( $attachments ) ) {
                return '';
            }

            if ( is_feed() ) {
                $output = "\n";
                foreach ( $attachments as $att_id => $attachment ) {
                    $output .= wp_get_attachment_link( $att_id, $atts['size'], true ) . "\n";
                }
                return $output;
            }

            $itemtag = tag_escape( $atts['itemtag'] );
            $captiontag = tag_escape( $atts['captiontag'] );
            $icontag = tag_escape( $atts['icontag'] );
            $valid_tags = wp_kses_allowed_html( 'post' );
            if ( ! isset( $valid_tags[ $itemtag ] ) ) {
                $itemtag = 'dl';
            }
            if ( ! isset( $valid_tags[ $captiontag ] ) ) {
                $captiontag = 'dd';
            }
            if ( ! isset( $valid_tags[ $icontag ] ) ) {
                $icontag = 'dt';
            }

            $columns = intval( $atts['columns'] );
            $itemwidth = $columns > 0 ? floor(100/$columns) : 100;
            $float = is_rtl() ? 'right' : 'left';

            $selector = "gallery-{$instance}";

            $gallery_style = '';

            if ( apply_filters( 'use_default_gallery_style', ! $html5 ) ) {
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
                </style>\n\t\t";
            }

            $size_class = sanitize_html_class( $atts['size'] );
            $gallery_div = "<div id='$selector' class='gallery galleryid-{$id} gallery-columns-{$columns} gallery-size-{$size_class}'>";

            $output = apply_filters( 'gallery_style', $gallery_style . $gallery_div );

            $i = 0;
            foreach ( $attachments as $id => $attachment ) {

                $attr = ( trim( $attachment->post_excerpt ) ) ? array( 'aria-describedby' => "$selector-$id" ) : '';
                if ( ! empty( $atts['link'] ) && 'file' === $atts['link'] ) {
                    $image_output = wp_get_attachment_link( $id, $atts['size'], false, false, false, $attr );
                } elseif ( ! empty( $atts['link'] ) && 'none' === $atts['link'] ) {
                    $image_output = wp_get_attachment_image( $id, $atts['size'], false, $attr );
                } else {
                    $image_output = wp_get_attachment_link( $id, $atts['size'], true, false, false, $attr );
                }
                $image_meta  = wp_get_attachment_metadata( $id );

                $orientation = '';
                if ( isset( $image_meta['height'], $image_meta['width'] ) ) {
                    $orientation = ( $image_meta['height'] > $image_meta['width'] ) ? 'portrait' : 'landscape';
                }
                $output .= "<{$itemtag} class='gallery-item'>";
                $output .= "
                    <{$icontag} class='gallery-icon {$orientation}'>
                        $image_output
                    </{$icontag}>";
                if ( $captiontag && trim($attachment->post_excerpt) ) {
                    $output .= "
                        <{$captiontag} class='wp-caption-text gallery-caption' id='$selector-$id'>
                        " . wptexturize($attachment->post_excerpt) . "
                        </{$captiontag}>";
                }
                $output .= "</{$itemtag}>";
                if ( ! $html5 && $columns > 0 && ++$i % $columns == 0 ) {
                    $output .= '<br style="clear: both" />';
                }
            }

            if ( ! $html5 && $columns > 0 && $i % $columns !== 0 ) {
                $output .= "
                    <br style='clear: both' />";
            }

            $output .= "
                </div>\n";
        // === END gallery_shortcode === //

        set_transient( $transient_key, $output, $this->transient_expiry );
        return $output;
    }

    private function nextgen_gallery_fallback ( $attr ) {
        $transient_key = $this->transient_key . '_e';
        $transient = get_transient( $transient_key );

        if ( $transient !== false ) {
            return $transient;
        }

        $args = array('display_type' => 'photocrati-nextgen_basic_thumbnails');

        if ( !empty($attr['nggid']) ) {
            $args = array_merge( $args, array(
                'gallery_ids' => $attr['nggid']
            ) );
        } else if ( !empty($attr['nggaid']) ) {
            $args = array_merge( $args, array(
                'album_ids' => $attr['nggaid']
            ) );
        }

        $output = M_Gallery_Display::display_images( $args );

        set_transient( $transient_key, $output, $this->transient_expiry );
        return $output;
    }

    public function set_lightbox ( $name ) {
        $this->lightbox = $name;
    }

    public function fetch_taxonomy_categories ( $slug, $args ) {
        $transient_key = $this->transient_key . '_f';
        $transient = get_transient( $transient_key );

        if ( $transient !== false ) {
            return $transient;
        }

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
        $posts = wp_get_recent_posts( $args + $taxonomy_args );

        set_transient( $transient_key, $posts, $this->transient_expiry );
        return $posts;
    }

    private function get_size_object ( $atts ) {
        $transient_key = $this->transient_key . '_g';
        $transient = get_transient( $transient_key );

        if ( $transient !== false ) {
            return $transient;
        }

        // we want to ignore thumbnails if they all have the same aspect ratio
        $images = array();
        $widths = array();
        $heights = array();
        $width_count = 0;
        $height_count = 0;
        $width_val = 0;
        $height_val = 0;
        $output = array();

        if ( empty($atts['nggid']) && empty($atts['ngaid']) ) {
            // it's a WP gallery
            if ( empty($atts['category']) ) {
                $images = $this->gallery_from_wordpress( $atts['id'], $atts['link_behavior'], $atts['include'], $atts['exclude'], $atts['ids'], true );
            } else {
                if ( $atts['category'] == 'recent' || $atts['category'] == 'latest' ) {
                    $recent_images = $this->recent_posts_images( $atts['limit'] );
                } else {
                    $recent_images = $this->recent_posts_images( $atts['limit'], $atts['category'] );
                }

                $ids = array_keys( $recent_images );
                $images = $this->gallery_from_wordpress( $atts['id'], $recent_images, $atts['include'], $atts['exclude'], $ids, true );
            }

            foreach ( $images as $_post ) {
                $image_thumbnail = wp_get_attachment_image_src($_post->ID , 'thumbnail');
                if ( !empty( $image_thumbnail[1] ) ) {
                    array_push( $widths, $image_thumbnail[1] );
                }
                if ( !empty( $image_thumbnail[2] ) ) {
                    array_push( $heights, $image_thumbnail[2] );
                }
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
            $val = '0';

            // People modify things to wp_get_attachment_image_src doesn't return width/height data.
            // There's nothing we can do to protect these people from themselves.
            if ( !empty($widths) && !empty($heights) ) {
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
            }

            if ( empty($atts['nggid']) && empty($atts['ngaid']) ) {
                $output = array(
                    'thumbnail' => ($val === '1' ? $val : get_option("thumbnail_size_w") ),
                    'medium'    => get_option("medium_size_w"),
                    'large'     => get_option("large_size_w")
                );
            } else {
                $output = array(
                    'thumbnail' => $val
                );
            }
        }

        set_transient( $transient_key, $output, $this->transient_expiry );
        return $output;
    }

    public function localize ( $handle, $object_name, $l10n, $dirty = false ) {
        global $photomosaic;
        return $photomosaic->localize( $handle, $object_name, $l10n, $dirty );
    }

    private function in_debug_mode () {
        $key = 'photomosaic_debug';
        parse_str( $_SERVER['QUERY_STRING'], $query );
        return (array_key_exists($key, $query) && ($query[$key] === 'true'));
    }

    private function has_errors () {
        $wp_version = get_bloginfo( 'version' );

        if ( $wp_version ) {
            $current_wp = $this->comparable_version( $wp_version );
            $oldest_supported_wp = $this->comparable_version( $this->oldest_supported_wp );

            if ( $current_wp < $oldest_supported_wp ) {
                return "<p><strong>PhotoMosaic Error:</strong>
                    This site is running WordPress v" . $wp_version . ".
                    As indicated on the <a href=\"http://codecanyon.net/item/photomosaic-for-wordpress/243422\">CodeCanyon Product Page</a>,
                    PhotoMosaic only supports WordPress v" . $this->oldest_supported_wp . " and newer.</p>";
            }
        }

        if ( ( !empty( $atts['nggid'] ) || !empty( $atts['ngaid'] ) ) && !class_exists( 'nggdb') ) {
            return "<p><strong>PhotoMosaic Error:</strong>
                The shortcode has specified a NextGen ID but NextGen could not be found.
                <br/>
                Please make sure NextGen Gallery has been installed and activated.</p>";
        }

        return false;
    }

    private function relative_url ($file) {
        return plugin_dir_url( __FILE__ ) . $file;
    }

    private function comparable_version ($version) {
        $v = explode('.', $version);
        if ( !isset( $v[2] ) ) {
            $v[2] = 0;
        }
        return ($v[0] * 10000 + $v[1] * 100 + $v[2]);
    }

    private function make_id () {
        // a modification of the GUID function in the Phunction framework
        // http://sourceforge.net/projects/phunction/
        return sprintf('%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
    }

    private function esc_attr ( $text ) {
        $text = trim($text);
        // lifted from wp-includes/formatting.php # esc_attr
        $safe_text = wp_check_invalid_utf8( $text );
        $safe_text = _wp_specialchars( $safe_text, "double" );
        return apply_filters( 'attribute_escape', $safe_text, $text );
    }
}
