
<?php
/**
 * Plugin Name: WP Headless
 * Description: Customizations for headless WordPress setup.
 */

// Modular includes
foreach (glob(__DIR__ . "/inc/*.php") as $file) {
  require $file;
}
