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
 * Enqueue the frontend animation script.
 */
function theatrum_animation_enqueue_scripts()
{
  $script_path = plugin_dir_path(__FILE__) . 'dist/main.js';

  if (file_exists($script_path)) {
    wp_enqueue_script(
      'theatrum-animation',
      plugin_dir_url(__FILE__) . 'dist/main.js',
      array(),
      filemtime($script_path),
      array(
        'in_footer' => true,
        'strategy'  => 'defer',
      )
    );
  }
}
add_action('wp_enqueue_scripts', 'theatrum_animation_enqueue_scripts');

/**
 * Enqueue the block editor inspector panel.
 */
function theatrum_animation_enqueue_editor_scripts() {
  $editor_script_path = plugin_dir_path(__FILE__) . 'dist/editor.js';

  if (file_exists($editor_script_path)) {
    wp_enqueue_script(
      'theatrum-animation-editor',
      plugin_dir_url(__FILE__) . 'dist/editor.js',
      // Must match the externals/globals in vite.config.editor.js.
      ['react', 'wp-hooks', 'wp-block-editor', 'wp-components', 'wp-compose', 'wp-element', 'wp-i18n'],
      filemtime($editor_script_path),
      true
    );
    wp_set_script_translations('theatrum-animation-editor', 'theatrum-animation');
  }
}
add_action('enqueue_block_editor_assets', 'theatrum_animation_enqueue_editor_scripts');
