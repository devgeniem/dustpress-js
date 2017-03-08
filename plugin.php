<?php
/**
 * Plugin Name: DustPress.JS
 * Plugin URI: https://github.com/devgeniem/dustpress-js
 * Description: DustPress JavaScript library. Provides a front-end interface for interacting with the backend functions.
 * Version: 1.1.1
 * Author: Geniem Oy / Miika Arponen & Ville Siltala
 * Author URI: http://www.geniem.com
 */

class DustPressJs {

    /**
     * Initalizes the plugin
     *
     * @type    function
     * @date    24/05/2016
     * @since   0.1.0
     *
     * @return  void
     */
    public function __construct() {
        add_action( 'init', array( $this, 'enqueue_scripts' ) );
    }

    /**
    *  This function enqueues front end scripts.
    *
    *  @type    function
    *  @date    17/12/2015
    *  @since   0.1.0
    *
    *  @return  boolean
    */
    public function enqueue_scripts() {
        wp_enqueue_script( 'jquery' );
        wp_enqueue_script( 'dustpress', trailingslashit( plugin_dir_url( __FILE__ ) ) . 'js/dustpress-min.js', array('jquery'), '1.1.1', false );
    }
}

new DustPressJs();
