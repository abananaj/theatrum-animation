<?php

if ( ! defined('ABSPATH')) {
  exit;
}

/**
 * Site-wide animation switch (Settings → Animations).
 *
 * Off = only the effects ticked as "keep" play; every other animated block renders in its final state (GSAP from-tweens pre-hide nothing).
 * The effect list comes from dist/effects.json, written from the live REGISTRY at build time (scripts/export-effects.mjs).
 */

const THEATRUM_ANIMATION_OPTION = 'theatrum_animation_settings';

/**
 * Saved settings, with defaults: on, nothing on the keep list.
 *
 * @return array{enabled: bool, allow: string[]}
 */
function theatrum_animation_settings() {
  $saved = get_option(THEATRUM_ANIMATION_OPTION, []);
  return [
    'enabled' => ! isset($saved['enabled']) || (bool) $saved['enabled'],
    'allow'   => array_values(array_filter((array) ($saved['allow'] ?? []), 'is_string')),
  ];
}

/**
 * Effects from dist/effects.json: [ ['id', 'label', 'category', 'categoryId', 'classes' => [...]], ... ].
 *
 * @return array<int, array<string, mixed>>
 */
function theatrum_animation_effects() {
  static $effects = null;
  if (null === $effects) {
    $path    = plugin_dir_path(__DIR__) . 'dist/effects.json';
    $decoded = file_exists($path) ? json_decode((string) file_get_contents($path), true) : null;
    $effects = is_array($decoded) ? $decoded : [];
  }
  return $effects;
}

/**
 * Classes the front end may still play while the switch is off — the kept effects, expanded to every variant class.
 *
 * @param string[] $allow Kept effect ids.
 * @return string[]
 */
function theatrum_animation_allowed_classes($allow) {
  $classes = [];
  foreach (theatrum_animation_effects() as $effect) {
    if (in_array($effect['id'], $allow, true)) {
      $classes = array_merge($classes, $effect['classes']);
    }
  }
  return $classes;
}

/**
 * Prints the switch for src/engine.ts ahead of dist/main.js, and flags <html> so the tma-* CSS entrances stand down too.
 */
function theatrum_animation_print_settings() {
  $settings = theatrum_animation_settings();
  $payload  = [
    'enabled' => $settings['enabled'],
    'allow'   => $settings['enabled'] ? [] : theatrum_animation_allowed_classes($settings['allow']),
  ];
  $script = 'window.theatrumAnimation=' . wp_json_encode($payload) . ';';
  if ( ! $settings['enabled']) {
    $script .= 'document.documentElement.classList.add("tma-off");';
  }
  wp_add_inline_script('theatrum-animation', $script, 'before');
}
add_action('wp_enqueue_scripts', 'theatrum_animation_print_settings', 20);

/**
 * Which effects are actually used, from published content (pages, posts, CPTs, synced patterns, DB templates/parts). Cached 12h; the settings page can force a rescan.
 *
 * @param bool $refresh Ignore the cache.
 * @return array<string, array{count: int, titles: string[]}> Keyed by effect id.
 */
function theatrum_animation_usage($refresh = false) {
  $cached = get_transient('theatrum_animation_usage');
  if ( ! $refresh && is_array($cached)) {
    return $cached;
  }

  $class_to_effect = [];
  foreach (theatrum_animation_effects() as $effect) {
    foreach ($effect['classes'] as $class) {
      $class_to_effect[$class] = $effect['id'];
    }
  }

  global $wpdb;
  $rows  = $wpdb->get_results("SELECT ID, post_title, post_content FROM {$wpdb->posts} WHERE post_status = 'publish' AND post_type NOT IN ('revision', 'nav_menu_item', 'attachment') AND post_content <> ''");
  $usage = [];
  foreach ($rows as $row) {
    // Saved markup carries the classes in class="…"; className covers blocks whose saved HTML is empty (dynamic).
    preg_match_all('/(?:class="|"className":")([^"]*)"/', $row->post_content, $matches);
    $found = [];
    foreach ($matches[1] as $list) {
      foreach (preg_split('/\s+/', $list) as $token) {
        if (isset($class_to_effect[$token])) {
          $found[$class_to_effect[$token]] = true;
        }
      }
    }
    foreach (array_keys($found) as $effect_id) {
      $usage[$effect_id]['count'] = ($usage[$effect_id]['count'] ?? 0) + 1;
      if (count($usage[$effect_id]['titles'] ?? []) < 4) {
        $usage[$effect_id]['titles'][] = '' !== $row->post_title ? $row->post_title : "#{$row->ID}";
      }
    }
  }

  set_transient('theatrum_animation_usage', $usage, 12 * HOUR_IN_SECONDS);
  return $usage;
}

/**
 * Registers the option with a sanitizer that only keeps known effect ids.
 */
function theatrum_animation_register_setting() {
  register_setting(
      'theatrum_animation',
      THEATRUM_ANIMATION_OPTION,
      [
      'type'              => 'array',
      'sanitize_callback' => function ($input) {
        $known = wp_list_pluck(theatrum_animation_effects(), 'id');
        return [
          'enabled' => ! empty($input['enabled']),
          'allow'   => array_values(array_intersect((array) ($input['allow'] ?? []), $known)),
        ];
      },
      ]
  );
}
add_action('admin_init', 'theatrum_animation_register_setting');

/**
 * Adds Settings → Animations.
 */
function theatrum_animation_add_settings_page() {
  add_options_page(
      __('Animations', 'theatrum-animation'),
      __('Animations', 'theatrum-animation'),
      'manage_options',
      'theatrum-animation',
      'theatrum_animation_render_settings_page'
  );
}
add_action('admin_menu', 'theatrum_animation_add_settings_page');

/**
 * Settings page: the master switch, then every effect in use with a "keep" box (only consulted while the switch is off).
 */
function theatrum_animation_render_settings_page() {
  if ( ! current_user_can('manage_options')) {
    return;
  }
  $refresh  = isset($_GET['rescan']) && check_admin_referer('theatrum_animation_rescan');
  $settings = theatrum_animation_settings();
  $usage    = theatrum_animation_usage($refresh);
  $in_use   = array_filter(theatrum_animation_effects(), fn ($effect) => isset($usage[$effect['id']]));
  usort($in_use, fn ($a, $b) => $usage[$b['id']]['count'] <=> $usage[$a['id']]['count']);
  $name = THEATRUM_ANIMATION_OPTION;
  ?>
  <div class="wrap">
    <h1><?php esc_html_e('Animations', 'theatrum-animation'); ?></h1>
    <p><?php esc_html_e('Turn block animations off across the whole site, then tick any effect you want to keep. Blocks with a switched-off effect simply appear in place. Visitors who ask their device for reduced motion never see animations either way.', 'theatrum-animation'); ?></p>
    <form method="post" action="options.php">
      <?php settings_fields('theatrum_animation'); ?>
      <table class="form-table" role="presentation">
        <tr>
          <th scope="row"><?php esc_html_e('Block animations', 'theatrum-animation'); ?></th>
          <td>
            <label>
              <input type="checkbox" name="<?php echo esc_attr($name); ?>[enabled]" value="1" <?php checked($settings['enabled']); ?>>
              <?php esc_html_e('Play all block animations', 'theatrum-animation'); ?>
            </label>
            <p class="description"><?php esc_html_e('Untick to switch them all off. Only the effects kept below will still play.', 'theatrum-animation'); ?></p>
          </td>
        </tr>
      </table>

      <h2><?php esc_html_e('Effects used on the site', 'theatrum-animation'); ?></h2>
      <p class="description">
        <?php esc_html_e('Only used while block animations are switched off.', 'theatrum-animation'); ?>
        <a href="<?php echo esc_url(wp_nonce_url(add_query_arg('rescan', '1'), 'theatrum_animation_rescan')); ?>"><?php esc_html_e('Rescan content', 'theatrum-animation'); ?></a>
      </p>
      <table class="widefat striped" style="max-width: 60rem">
        <thead>
          <tr>
            <th scope="col"><?php esc_html_e('Keep', 'theatrum-animation'); ?></th>
            <th scope="col"><?php esc_html_e('Effect', 'theatrum-animation'); ?></th>
            <th scope="col"><?php esc_html_e('Used on', 'theatrum-animation'); ?></th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($in_use as $effect) : ?>
            <?php $id = 'tma-keep-' . $effect['id']; ?>
            <tr>
              <td><input type="checkbox" id="<?php echo esc_attr($id); ?>" name="<?php echo esc_attr($name); ?>[allow][]" value="<?php echo esc_attr($effect['id']); ?>" <?php checked(in_array($effect['id'], $settings['allow'], true)); ?>></td>
              <td><label for="<?php echo esc_attr($id); ?>"><strong><?php echo esc_html($effect['label']); ?></strong> <span class="description">(<?php echo esc_html($effect['category']); ?>)</span></label></td>
              <td>
                <?php
                $count = $usage[$effect['id']]['count'];
                /* translators: %d: number of pages, posts or patterns. */
                echo esc_html(sprintf(_n('%d item', '%d items', $count, 'theatrum-animation'), $count));
                ?>
                <br><span class="description"><?php echo esc_html(implode(', ', $usage[$effect['id']]['titles']) . ($count > 4 ? ', …' : '')); ?></span>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
      <?php submit_button(); ?>
    </form>
  </div>
  <?php
}
