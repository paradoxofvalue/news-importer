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
	register_setting( 'ni-settings-group', 'ni-status' );
	register_setting( 'ni-settings-group', 'ni-site-1' );
	register_setting( 'ni-settings-group', 'ni-site-2' );
	register_setting( 'ni-settings-group', 'ni-site-3' );
	register_setting( 'ni-settings-group', 'ni-site-4' );
	register_setting( 'ni-settings-group', 'ni-site-5' );
}

function ni_settings_page() {
?>
<div class="wrap">
<h2>News Importer Settings</h2>

<form method="post" action="options.php">
    <span>Статус: <?= get_option('ni-status');?></span>
    <?php settings_fields( 'ni-settings-group' ); ?>
    <table class="form-table">
        <tr valign="top">
        <th scope="row">website #1</th>
        <td><input type="text" name="ni-site-1" value="<?php echo get_option('ni-site-1'); ?>" /></td>
        </tr>
         
        <tr valign="top">
        <th scope="row">website #2</th>
        <td><input type="text" name="ni-site-2" value="<?php echo get_option('ni-site-2'); ?>" /></td>
        </tr>
        
        <tr valign="top">
        <th scope="row">website #3</th>
        <td><input type="text" name="ni-site-3" value="<?php echo get_option('ni-site-3'); ?>" /></td>
        </tr>

        <tr valign="top">
        <th scope="row">website #4</th>
        <td><input type="text" name="ni-site-4" value="<?php echo get_option('ni-site-4'); ?>" /></td>
        </tr>
        <tr valign="top">
        <th scope="row">website #5</th>
        <td><input type="text" name="ni-site-5" value="<?php echo get_option('ni-site-5'); ?>" /></td>
        </tr>
    </table>
    
    <p class="submit">
    <input type="submit" class="button-primary" value="<?php _e('Save Changes') ?>" />
    </p>

</form>
</div>
<?php } ?>

