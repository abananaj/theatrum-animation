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

if ( ! defined('ABSPATH')) {
  exit;
}

require_once __DIR__ . '/inc/render-block.php';

/**
 * Enqueue the frontend animation script.
 */
function theatrum_animation_enqueue_scripts() {
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

// Note: tma-* CSS utilities (src/scss/utilities.scss) are NOT enqueued separately — Vite has no HTML entry to extract CSS against here, so it bundles CSS into dist/main.js and injects it via a runtime <style> tag; dist/main.css never gets built (an earlier dist/main.css enqueue was removed as dead code for this reason).
// No PHP wiring needed — CSS ships with the existing theatrum-animation script enqueue.

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
        ['react', 'wp-hooks', 'wp-block-editor', 'wp-components', 'wp-compose', 'wp-data', 'wp-element', 'wp-i18n'],
        filemtime($editor_script_path),
        true
    );
    wp_set_script_translations('theatrum-animation-editor', 'theatrum-animation');
  }
}
add_action('enqueue_block_editor_assets', 'theatrum_animation_enqueue_editor_scripts');

/**
 * Mirrors the animation/stagger attributes src/block-editor/inspector.tsx adds client-side onto the server-side block type registration.
 * Without this, ServerSideRender blocks (which validate attributes against this schema with additionalProperties:false) fail with "Invalid parameter(s): attributes" once the client sends staggerFrom/animationDuration/etc — affects theatrum/production-quotes and theatrum/performances-list.
 * Excludes wpforms/* for the same reason as the JS filter: its widgets measure their own size on mount, so injecting attributes into a schema we don't control risks corrupting its ServerSideRender preview.
 */
function theatrum_animation_register_block_type_args($args, $name) {
  if (is_string($name) && str_starts_with($name, 'wpforms/')) {
    return $args;
  }

  // Typed [number, string]: JS-side default is null, but ServerSideRender's GET round-trip serializes null to "" (`attributes[animationDuration]=`) — no way to distinguish "null" from "" in a query string.
  // A strict `type: number` would reject that empty string before it ever reaches sanitize_callback.
$args['attributes'] = array_merge(
    $args['attributes'] ?? [],
    [
    'animationDuration'     => ['type' => ['number', 'string'], 'default' => null],
    'animationDelay'        => ['type' => ['number', 'string'], 'default' => null],
    'animationEasePower'    => ['type' => 'string', 'default' => null],
    'animationEaseDir'      => ['type' => 'string', 'default' => null],
    'animationTrigger'      => ['type' => 'string', 'default' => null],
    'animationTriggerPoint' => ['type' => ['number', 'string'], 'default' => null],
    'staggerEach'           => ['type' => ['number', 'string'], 'default' => null],
    'staggerFrom'           => ['type' => 'string', 'default' => null],
    ]
);

  return $args;
}
add_filter('register_block_type_args', 'theatrum_animation_register_block_type_args', 10, 2);
