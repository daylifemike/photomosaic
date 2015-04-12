<?php

class Photomosaic_Loader {

    protected $actions;
    protected $filters;
    protected $shortcodes;

    public function __construct() {
        $this->actions = array();
        $this->filters = array();
        $this->shortcodes = array();
    }

    /**
     * Add a new action to the collection to be registered with WordPress.
     *
     * @since    1.0.0
     * @param    string               $hook             The name of the WordPress action that is being registered.
     * @param    object               $component        A reference to the instance of the object on which the action is defined.
     * @param    string               $callback         The name of the function definition on the $component.
     * @param    int      Optional    $priority         The priority at which the function should be fired.
     * @param    int      Optional    $accepted_args    The number of arguments that should be passed to the $callback.
     */
    public function add_action( $hook, $component, $callback, $priority = 10, $accepted_args = 1 ) {
        $this->actions = $this->add( $this->actions, $hook, $component, $callback, $priority, $accepted_args );
    }

    public function add_filter( $hook, $component, $callback, $priority = 10, $accepted_args = 1 ) {
        $this->filters = $this->add( $this->filters, $hook, $component, $callback, $priority, $accepted_args );
    }

    public function add_shortcode( $hook, $component, $callback ) {
        $this->shortcodes = $this->add( $this->shortcodes, $hook, $component, $callback );
    }

    /**
     * A utility function that is used to register the actions and hooks into a single
     * collection.
     *
     * @since    1.0.0
     * @access   private
     * @param    array                $hooks            The collection of hooks that is being registered (that is, actions or filters).
     * @param    string               $hook             The name of the WordPress filter that is being registered.
     * @param    object               $component        A reference to the instance of the object on which the filter is defined.
     * @param    string               $callback         The name of the function definition on the $component.
     * @param    int      Optional    $priority         The priority at which the function should be fired.
     * @param    int      Optional    $accepted_args    The number of arguments that should be passed to the $callback.
     * @return   type                                   The collection of actions and filters registered with WordPress.
     */
    private function add( $hooks, $hook, $component, $callback, $priority = null, $accepted_args = null ) {
        $hooks[] = array(
            'hook'          => $hook,
            'component'     => $component,
            'callback'      => $callback,
            'priority'      => $priority,
            'accepted_args' => $accepted_args
        );

        return $hooks;
    }

    public function run() {
        foreach ( $this->filters as $hook ) {
            if ( $hook['component'] ) {
                add_filter( $hook['hook'], array( $hook['component'], $hook['callback'] ), $hook['priority'], $hook['accepted_args'] );
            } else {
                add_filter( $hook['hook'], $hook['callback'], $hook['priority'], $hook['accepted_args'] );
            }
        }

        foreach ( $this->actions as $hook ) {
            add_action( $hook['hook'], array( $hook['component'], $hook['callback'] ), $hook['priority'], $hook['accepted_args'] );
        }

        foreach ( $this->shortcodes as $hook ) {
            add_shortcode( $hook['hook'], array( $hook['component'], $hook['callback'] ) );
        }
    }
}
