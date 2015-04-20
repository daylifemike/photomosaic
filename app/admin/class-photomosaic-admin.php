<?php

class Photomosaic_Admin {

    private $plugin_name;
    private $version;

    public function __construct ( $plugin_name, $version ) {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }

    public function enqueue_styles () {
        wp_enqueue_style( $this->plugin_name . 'codemirror', $this->relative_url('vendor/codemirror/codemirror.css'), array(), $this->version, 'all' );
        wp_enqueue_style( $this->plugin_name . 'admin',      $this->relative_url('css/photomosaic.admin.css'),                 array(), $this->version, 'all' );
    }

    public function enqueue_scripts () {
        global $pagenow;

        if ( isset($_GET['page']) ) {
            if ( $_GET['page'] == "photoMosaic.php" || $_GET['page'] == "photomosaic.php"  || $_GET['page'] == "photomosaic" ) {
                wp_register_script( $this->plugin_name . '-codemirror',         $this->relative_url('vendor/codemirror/codemirror.js'), array(),                                             $this->version, false );
                wp_enqueue_script(  $this->plugin_name . '-codemirror-jsmode',  $this->relative_url('vendor/codemirror/javascript.js'), array($this->plugin_name . '-codemirror'),           $this->version, false );
                wp_enqueue_script(  $this->plugin_name . '-codemirror-cssmode', $this->relative_url('vendor/codemirror/css.js' ),       array($this->plugin_name . '-codemirror'),           $this->version, false );
                wp_enqueue_script(  $this->plugin_name . '-admin',              $this->relative_url('js/photomosaic.admin.js'),         array('jquery', $this->plugin_name . '-codemirror'), $this->version, false );
                wp_enqueue_script( 'plugin-install' );
            }
        }

        if ( isset( $_GET['post'] ) || in_array( $pagenow, array( 'post-new.php' ) ) ) {
            wp_enqueue_script(  $this->plugin_name . '-editor', $this->relative_url('js/photomosaic.editor.js'), array('jquery'), $this->version, false );
        }
    }

    public function action_links ( $links, $file ) {
        if ( dirname( $file ) == dirname( dirname( plugin_basename( __FILE__ ) ) ) ) {
            $settings_link = '<a href="' . get_bloginfo('wpurl') . '/wp-admin/admin.php?page=photomosaic">Settings</a>';
            array_push($links, $settings_link);
        }

        return $links;
    }

    public function setup_admin_page() {
        global $photomosaic;

        if(isset($_POST['photomosaic_save'])) {
            $options = $photomosaic->get_options();

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

            $photomosaic->set_options( $options );

            $_POST['message'] = "Settings Updated";
        }

        add_menu_page(
            'PhotoMosaic v' . $this->version, // page tite
            'PhotoMosaic', // menu title
            'update_plugins', // capability
            'photomosaic', // menu slug
            array( $this, 'render_admin_page' ), // callback
            $this->relative_url( 'images/admin-page-icon.gif' ) // icon url
            // position
        );
    }

    public function render_admin_page() {
        global $photomosaic;

        $options = $photomosaic->get_options( true );

        if ( !class_exists('MarkdownExtra_Parser') ) {
            require_once( $this->relative_path( 'vendor/markdown.php' ) );
        }

        require_once( $this->relative_path( 'partials/admin.php' ) );
    }

    public function scrub_post_shortcodes ( $content, $post_id ) {
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

    public function include_github_updater () {
        if ( !(isset($_GET['action']) && $_GET['action'] == 'activate') ) {
            if ( !class_exists('GitHub_Plugin_Updater') ) {
                require_once( $this->relative_path( 'vendor/github-updater/github-updater.php' ) );
            }
        }
    }

    private function relative_url ($file) {
        return plugin_dir_url( __FILE__ ) . $file;
    }

    private function relative_path ($file) {
        return plugin_dir_path( __FILE__ ) . $file;
    }
}
