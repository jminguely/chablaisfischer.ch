<?php
add_action('pre_option_blog_public', '__return_zero');
add_action('admin_init', function () {
  if (!apply_filters('roots/bedrock/disallow_indexing_admin_notice', true)) {
    return;
  }
  add_action('admin_notices', function () {
    $message = sprintf(
      __('%1$s Search engine indexing has been discouraged because the current environment is %2$s.', 'roots'),
      '<strong>Bedrock:</strong>',
      '<code>' . WP_ENV . '</code>'
    );
    echo "<div class='notice notice-warning'><p>{$message}</p></div>";
  });
});
