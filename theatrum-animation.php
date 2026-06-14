<?php

/**
 * Plugin Name: Theatrum Animation
 * Description: Add animations to blocks from a dropdown in the block inspector
 * Version: 1.0.0
 * Author: Chance Theater
 * License: GPL-2.0-or-later
 * Text Domain: theatrum-animation
 *
 * @package theatrum-animation
 */

if (! defined('ABSPATH')) {
  exit;
}

/**
 * Enqueue plugin scripts and styles
 */
function theatrum_animation_enqueue_scripts()
{
  $script_path = plugin_dir_path(__FILE__) . 'dist/main.js';
  $style_path  = plugin_dir_path(__FILE__) . 'dist/main.css';

  if (file_exists($script_path)) {
    wp_enqueue_script(
      'theatrum-animation',
      plugin_dir_url(__FILE__) . 'dist/main.js',
      array(),
      filemtime($script_path),
      true
    );
  }

  if (file_exists($style_path)) {
    wp_enqueue_style(
      'theatrum-animation',
      plugin_dir_url(__FILE__) . 'dist/main.css',
      array(),
      filemtime($style_path)
    );
  }
}
add_action('wp_enqueue_scripts', 'theatrum_animation_enqueue_scripts');
add_action('enqueue_block_editor_assets', 'theatrum_animation_enqueue_scripts');

/*
Plugin Sidebar Script Registration and Enqueueing
*/
register_post_meta( 'post', 'sidebar_plugin_meta_block_field', array(
    'show_in_rest' => true,
    'single' => true,
    'type' => 'string',
) );
function sidebar_plugin_register() {
    wp_register_script(
        'plugin-sidebar-js',
        plugins_url( 'inc/plugin-sidebar.js', __FILE__ ),
        array(
            'react',
            'wp-plugins',
            'wp-editor',
            'wp-components'
        )
    );
    wp_register_style(
        'plugin-sidebar-css',
        plugins_url( 'inc/plugin-sidebar.css', __FILE__ )
    );
}
add_action( 'init', 'sidebar_plugin_register' );

function sidebar_plugin_script_enqueue() {
    wp_enqueue_script( 'plugin-sidebar-js' );
    wp_enqueue_style( 'plugin-sidebar-css' );
}
add_action( 'enqueue_block_editor_assets', 'sidebar_plugin_script_enqueue' );