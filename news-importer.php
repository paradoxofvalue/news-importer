<?php
/*
Plugin Name: News Importer Settings
Plugin URI: https://github.com/paradoxofvalue/news-importer
Description: Plugin for setup news importer with node.js
Version: 0.1
Author: Vadym Lavorchuk
Author URI:  https://github.com/paradoxofvalue
*/



/**
 * взять пагинацию
 * document.querySelectorAll('[class*=pagi] a') 
 * 
 * взять посты
 * document.querySelectorAll('[class*=titl] a') 
 * а вот сдесь может быть проблема не на всех сайтах есть титл...
 */
?>

<?php
// create custom plugin settings menu
add_action('admin_menu', 'news_importer_menu');

function news_importer_menu() {

	//create new top-level menu
	add_menu_page('News Importer Settings', 'NI Settings', 'administrator', __FILE__, 'ni_settings_page',plugins_url('/images/icon.png', __FILE__));

	//call register settings function
	add_action( 'admin_init', 'register_mysettings' );
}


function register_mysettings() {
	//register our settings
	register_setting( 'ni-settings-group', 'new_option_name' );
	register_setting( 'ni-settings-group', 'some_other_option' );
	register_setting( 'ni-settings-group', 'option_etc' );
}

function ni_settings_page() {
?>
<div class="wrap">
<h2>News Importer Settings</h2>

<form method="post" action="options.php">
    <?php settings_fields( 'ni-settings-group' ); ?>
    <table class="form-table">
        <tr valign="top">
        <th scope="row">website #1</th>
        <td><input type="text" name="new_option_name" value="<?php echo get_option('new_option_name'); ?>" /></td>
        </tr>
         
        <tr valign="top">
        <th scope="row">website #2</th>
        <td><input type="text" name="some_other_option" value="<?php echo get_option('some_other_option'); ?>" /></td>
        </tr>
        
        <tr valign="top">
        <th scope="row">website #3</th>
        <td><input type="text" name="option_etc" value="<?php echo get_option('option_etc'); ?>" /></td>
        </tr>
    </table>
    
    <p class="submit">
    <input type="submit" class="button-primary" value="<?php _e('Save Changes') ?>" />
    </p>

</form>
</div>
<?php } ?>

