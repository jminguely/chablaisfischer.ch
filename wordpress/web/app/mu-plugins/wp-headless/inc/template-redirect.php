<?php

// Redirect all non-admin, non-login frontend requests to WP_HOME
add_action('template_redirect', function () {
  if (!is_admin() && !defined('DOING_AJAX') && !in_array($GLOBALS['pagenow'], ['wp-login.php', 'wp-register.php'])) {
    $wp_home = getenv('WP_HOME');
    if ($wp_home) {
      wp_redirect($wp_home, 301);
      exit;
    }
  }
});
