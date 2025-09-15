<?php
// Custom REST URL
function custom_rest_url($url)
{
  return getenv('WP_HOME_ADMIN') . '/wp-json/';
}
add_filter('rest_url', 'custom_rest_url');
