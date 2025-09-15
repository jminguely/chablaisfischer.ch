<?php
// Register custom navigation menu
function custom_nav()
{
  register_nav_menu('PrimaryNav', __('Primary'));
  register_nav_menu('FooterNav', __('Footer'));
}
add_action('init', 'custom_nav');
