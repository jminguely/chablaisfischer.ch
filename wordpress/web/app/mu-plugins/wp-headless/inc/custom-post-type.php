<?php

/**
 * Project Type registration for WP Headless
 */

add_theme_support('post-thumbnails');

function wp_headless_register_project_type()
{
  $labels = array(
    'name'            => __('Projects'),
    'singular_name'   => __('Project'),
    'add_new'         => __('Ajouter', 'textdomain'),
    'add_new_item'    => __('Nouveau projet', 'textdomain'),
  );
  $args = array(
    'labels' => $labels,
    'public' => true,
    'has_archive' => true,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-portfolio',
    'supports' => array('title', 'editor', 'thumbnail'),
  );
  register_post_type('project', $args);
}
add_action('init', 'wp_headless_register_project_type');
