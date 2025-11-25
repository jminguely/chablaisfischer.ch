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
    'rewrite' => array('slug' => 'projets', 'with_front' => false),
  );
  register_post_type('project', $args);
}
add_action('init', 'wp_headless_register_project_type');

add_filter('manage_project_posts_columns', function ($columns) {
  $new_columns = [];
  foreach ($columns as $key => $value) {
    if ($key === 'title') {
      $new_columns['thumbnail'] = __('Image');
    }
    $new_columns[$key] = $value;

    if ($key === 'title') {
      $new_columns['annee'] = __('Année');
      $new_columns['lieu'] = __('Lieu');
    }
  }
  return $new_columns;
});

add_action('manage_project_posts_custom_column', function ($column, $post_id) {
  if ($column === 'thumbnail') {
    echo get_the_post_thumbnail($post_id, [50, 50]);
  }
  if ($column === 'annee') {
    echo get_field('annee', $post_id);
  }
  if ($column === 'lieu') {
    echo get_field('lieu', $post_id);
  }
}, 10, 2);
