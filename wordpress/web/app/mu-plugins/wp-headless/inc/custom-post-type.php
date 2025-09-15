<?php

/**
 * Custom Post Type registration for WP Headless
 */
function wp_headless_register_custom_post_type()
{
  $labels = array(
    'name' => __('Custom Posts'),
    'singular_name' => __('Custom Post'),
  );
  $args = array(
    'labels' => $labels,
    'public' => true,
    'has_archive' => true,
    'show_in_rest' => true,
    'supports' => array('title', 'editor', 'thumbnail'),
  );
  register_post_type('custom_post', $args);
}
add_action('init', 'wp_headless_register_custom_post_type');
