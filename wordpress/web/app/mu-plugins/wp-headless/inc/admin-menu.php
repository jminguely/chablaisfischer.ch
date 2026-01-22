<?php
// Removes unnecessary items from the admin menu
add_action('admin_menu', 'my_remove_admin_menus');
function my_remove_admin_menus()
{
    // Remove Comments
    remove_menu_page('edit-comments.php');
    
    // Remove default Posts (news/blog)
    remove_menu_page('edit.php');
}
