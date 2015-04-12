<?php

class Photomosaic {

    protected $loader;
    protected $plugin_name;
    protected $version;
    protected $options_key = 'photomosaic_options';

    public function __construct () {
        $this->plugin_name = 'photomosaic';
        $this->version = '2.11';

        $this->load_dependencies();
        // $this->set_locale();
        $this->define_admin_hooks();
        $this->define_public_hooks();
    }

    private function load_dependencies () {
        require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-photomosaic-loader.php';
        // require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-photomosaic-i18n.php';
        require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-photomosaic-admin.php';
        require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-photomosaic-public.php';

        $this->loader = new Photomosaic_Loader();
    }

    // private function set_locale() {
    //     $plugin_i18n = new Photomosaic_i18n();
    //     $plugin_i18n->set_domain( $this->get_plugin_name() );

    //     $this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );
    // }

    private function define_admin_hooks () {
        $plugin_admin = new Photomosaic_Admin( $this->plugin_name, $this->version );

        $this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
        $this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
        $this->loader->add_action( 'admin_menu',            $plugin_admin, 'setup_admin_page' );
        $this->loader->add_action( 'plugins_loaded',        $plugin_admin, 'include_github_updater' );

        $this->loader->add_filter( 'plugin_action_links', $plugin_admin, 'action_links',          10,   2 );
        $this->loader->add_filter( 'content_edit_pre',    $plugin_admin, 'scrub_post_shortcodes', 1337, 2 );
    }

    private function define_public_hooks () {
        $plugin_public = new Photomosaic_Public( $this->plugin_name, $this->version );

        $this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
        $this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );

        $this->loader->add_filter( 'post_gallery', $plugin_public, 'post_gallery', 1337, 2 );
        $this->loader->add_filter( 'widget_text', null, 'do_shortcode' );

        $this->loader->add_shortcode( 'photoMosaic', $plugin_public, 'shortcode' );
        $this->loader->add_shortcode( 'photomosaic', $plugin_public, 'shortcode' );
    }

    public function run () {
        $this->loader->run();
    }

    public function get_option ( $option ) {
        $options = $this->get_options();
        return $options[ $option ];
    }

    public function get_options ( $adjust_deprecated_options = false ) {
        $defaults = array(
            'padding' => 2,
            'columns' => 0,
            'min_columns' => 0,
            'max_columns' => 0,
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
            'lightbox_rendition' => 'full',
            'custom_lightbox' => false,
            'custom_lightbox_name' => '',
            'custom_lightbox_params' => '{}',
            'custom_css' => '/* your custom css here */',
            // this is repeated in pm.admin.js as a null-check
            'onready_callback' => "function(".'$mosaic'.", ".'$items'."){\n\t/* your code here */\n}"
        );

        $options = get_option( $this->options_key );

        if ( !is_array( $options ) ) {
            $options = $defaults;
            update_option( $this->options_key, $options );
        } else {
            $options = $options + $defaults; // "+" means dup keys aren't overwritten
        }

        if ( $adjust_deprecated_options ) {
            $options = $this->adjust_deprecated_options( $options );
        }

        return $options;
    }

    public function set_options ( $options ) {
        update_option( $this->options_key, $options);
    }

    public function adjust_deprecated_options ( $options ) {
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
}
