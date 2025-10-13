<?php
// Specify custom ACF JSON save and load paths for this plugin

// Store ACF JSON at the plugin root in `acf-json/` (one level above this `inc/` folder).
// This keeps ACF exported field groups with the plugin, making them portable when the
// mu-plugin is deployed or versioned.

add_filter('acf/settings/save_json', function ($path) {
  // Save ACF JSON files in the plugin root's acf-json directory
  return dirname(__DIR__) . '/acf-json';
});

add_filter('acf/settings/load_json', function ($paths) {
  // Append the plugin root's acf-json directory to ACF JSON load paths
  $paths[] = dirname(__DIR__) . '/acf-json';
  return $paths;
});
