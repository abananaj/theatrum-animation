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
