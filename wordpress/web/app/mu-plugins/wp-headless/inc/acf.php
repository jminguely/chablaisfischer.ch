<?php
// Specify custom ACF JSON save and load paths

// Priority 10 ensures this runs early
add_filter('acf/settings/save_json', function ($path) {
  // Save ACF JSON files in the plugin root's acf-json directory
  $custom_path = dirname(__DIR__) . '/acf-json';
  
  // Ensure directory exists and is writable
  if (!file_exists($custom_path)) {
    mkdir($custom_path, 0775, true);
  }
  
  return $custom_path;
}, 10);

add_filter('acf/settings/load_json', function ($paths) {
  // Append the plugin root's acf-json directory to ACF JSON load paths
  $custom_path = dirname(__DIR__) . '/acf-json';
  
  // Remove the default path to avoid conflicts
  unset($paths[0]);
  
  // Add our custom path
  $paths[] = $custom_path;
  
  return $paths;
}, 10);
