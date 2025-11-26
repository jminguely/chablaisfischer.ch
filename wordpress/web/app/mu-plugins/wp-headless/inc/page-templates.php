<?php

/**
 * Register custom page templates
 * These templates are used for ACF field groups and WPGraphQL queries
 */

add_filter('theme_page_templates', function ($templates) {
  $templates['template-accueil'] = 'Accueil';
  $templates['template-projets'] = 'Projets';
  $templates['template-atelier'] = 'Atelier';

  return $templates;
});

// Make the templates available in WPGraphQL
add_filter('page_template', function ($template) {
  global $post;

  if (!$post) {
    return $template;
  }

  $page_template = get_post_meta($post->ID, '_wp_page_template', true);

  // For headless setup, we don't need actual template files
  // The template selection is just for ACF field group assignment
  if (in_array($page_template, ['template-accueil', 'template-projets', 'template-atelier'])) {
    return $template;
  }

  return $template;
});
