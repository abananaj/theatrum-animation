<?php

if ( ! defined('ABSPATH')) {
  exit;
}

/**
 * Re-applies animation/stagger override attributes onto dynamic block output.
 * The JS `blocks.getSaveContent.extraProps` filter (src/block-editor/inspector.tsx) writes data-animation-* / data-stagger-* into saved HTML, but dynamic/server-rendered blocks (render.php, e.g. theatrum/production-quotes, core/query) regenerate markup and never pass through it — the animation class survives (hardcoded/block supports) but Duration/Delay/Ease/Trigger/Stagger overrides were silently dropped.
 * Re-applies the same data-* attributes onto the dynamic block's rendered wrapper, sourced from the block's own attributes (preserved, just never written into render.php's output).
 */
add_filter('render_block', 'theatrum_animation_render_block', 10, 2);

/**
 * `render_block` filter callback — see the docblock above for context.
 *
 * @param string $block_content Rendered block HTML.
 * @param array  $block         Parsed block, including 'blockName' and 'attrs'.
 * @return string Block HTML with data-animation-* and data-stagger-* attributes
 *                added to its outer wrapper element when applicable.
 */
function theatrum_animation_render_block($block_content, $block) {
  if (empty($block_content) || empty($block['blockName'])) {
    return $block_content;
  }

  if (str_starts_with($block['blockName'], 'wpforms/')) {
    return $block_content;
  }

  // Static blocks already got their data-* attrs at save time via blocks.getSaveContent.extraProps — skip here (this filter fires for every block, including inside query loops with many repeats).
  $block_type = WP_Block_Type_Registry::get_instance()->get_registered($block['blockName']);
  if ( ! $block_type || ! $block_type->is_dynamic()) {
    return $block_content;
  }

  $data_attrs = theatrum_animation_data_attrs_for($block['attrs'] ?? []);
  if (empty($data_attrs)) {
    return $block_content;
  }

  // Assumes a single top-level wrapper in $block_content (same assumption blocks.getSaveContent.extraProps makes for static blocks) — a render.php emitting multiple sibling roots only gets attributes on the first.
  $processor = new WP_HTML_Tag_Processor($block_content);
  if ( ! $processor->next_tag()) {
    return $block_content;
  }
  foreach ($data_attrs as $name => $value) {
    $processor->set_attribute($name, $value);
  }
  return $processor->get_updated_html();
}

/**
 * Builds the data-animation-* / data-stagger-* attribute map for a block's attributes, matching inspector.tsx's addAnimationSaveProps()/addStaggerSaveProps() value formats byte-for-byte so engine.ts/stagger.ts parse them identically whether saved statically or rendered dynamically.
 * Gated on attribute presence rather than replicating the JS-side CLASS_INDEX/className check: these attribute names are exclusive to this plugin's inspector, so a non-null value only exists because the user applied an animation (which always sets className too) — no server-side class list needed.
 *
 * @param array $attrs Block attributes.
 * @return array<string, string> data-* attribute name/value pairs.
 */
function theatrum_animation_data_attrs_for($attrs) {
  $out = [];

  $duration = $attrs['animationDuration'] ?? null;
  $delay    = $attrs['animationDelay'] ?? null;
  $power    = $attrs['animationEasePower'] ?? null;
  $dir      = $attrs['animationEaseDir'] ?? null;
  $trigger  = $attrs['animationTrigger'] ?? null;
  $point    = $attrs['animationTriggerPoint'] ?? null;
  $each     = $attrs['staggerEach'] ?? null;
  $from     = $attrs['staggerFrom'] ?? null;

  if (is_numeric($duration)) {
    $out['data-animation-duration'] = (string) (int) $duration;
  }
  if (is_numeric($delay)) {
    $out['data-animation-delay'] = (string) (int) $delay;
  }
  if (is_string($power) && '' !== $power && is_string($dir) && '' !== $dir) {
    $out['data-animation-ease'] = $power . '.' . $dir;
  }
  if (is_string($trigger) && '' !== $trigger) {
    $out['data-animation-trigger'] = $trigger;
  }
  if (is_numeric($point)) {
    $out['data-animation-trigger-point'] = (string) max(0, min(100, (int) $point));
  }
  if (is_numeric($each)) {
    $out['data-stagger-each'] = (string) (int) $each;
    $out['data-stagger-from'] = (is_string($from) && '' !== $from) ? $from : 'start';
  }

  return $out;
}
