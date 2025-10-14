<?php

/**
 * Project Type registration for WP Headless
 */

add_theme_support('post-thumbnails', array('post', 'project'));


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
    'show_in_graphql' => true,
    'graphql_single_name' => 'Project',
    'graphql_plural_name' => 'Projects',
    'menu_icon' => 'dashicons-portfolio',
    'supports' => array('title', 'editor', 'thumbnail'),
    'rewrite' => array('slug' => 'projets', 'with_front' => true),
  );
  register_post_type('project', $args);
}
add_action('init', 'wp_headless_register_project_type');
