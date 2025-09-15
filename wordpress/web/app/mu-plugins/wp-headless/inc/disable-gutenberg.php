<?php

/**
 * Plugin Name: Disable Gutenberg Editor
 * Description: Disables the Gutenberg block editor for posts and pages.
 * Author: GitHub Copilot
 * Version: 1.0.0
 */

// Disable Gutenberg for posts and pages
add_filter('use_block_editor_for_post', '__return_false', 10);
add_filter('gutenberg_can_edit_post_type', '__return_false', 10);
add_filter('use_block_editor_for_post_type', '__return_false', 10);
