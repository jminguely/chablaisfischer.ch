<?php
// Specify custom ACF JSON save and load paths

add_filter('acf/settings/save_json', function ($path) {
  // Save ACF JSON files in the plugin root's acf-json directory
  return dirname(__DIR__) . '/acf-json';
});

add_filter('acf/settings/load_json', function ($paths) {
  // Append the plugin root's acf-json directory to ACF JSON load paths
  $paths[] = dirname(__DIR__) . '/acf-json';
  return $paths;
});
