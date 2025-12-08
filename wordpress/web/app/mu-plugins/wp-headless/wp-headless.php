
<?php
/**
 * Plugin Name: WP Headless
 * Description: Customizations for headless WordPress setup.
 */

// Load ACF configuration first to ensure JSON sync paths are set before ACF initializes
require __DIR__ . '/inc/acf.php';

// Load other modular includes
foreach (glob(__DIR__ . "/inc/*.php") as $file) {
  if (basename($file) !== 'acf.php') {
    require $file;
  }
}
