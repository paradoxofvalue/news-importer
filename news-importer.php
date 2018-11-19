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
	add_menu_page('News Importer Settings', 'NI Settings', 'administrator', __FILE__, 'ni_settings_page',plugins_url('/ni.svg', __FILE__));

	//call register settings function
	add_action( 'admin_init', 'register_mysettings' );
}


function register_mysettings() {
	//register our settings
	register_setting( 'ni-settings-group', 'ni-status' );

	register_setting( 'ni-settings-group', 'ni-site-url-1' );
	register_setting( 'ni-settings-group', 'ni-site-title-1' );
	register_setting( 'ni-settings-group', 'ni-site-pagination-1' );
	register_setting( 'ni-settings-group', 'ni-site-news-title-1' );
	register_setting( 'ni-settings-group', 'ni-site-news-text-1' );
	register_setting( 'ni-settings-group', 'ni-site-news-img-1' );

	register_setting( 'ni-settings-group', 'ni-site-url-2' );
	register_setting( 'ni-settings-group', 'ni-site-title-2' );
	register_setting( 'ni-settings-group', 'ni-site-pagination-2' );
	register_setting( 'ni-settings-group', 'ni-site-news-title-2' );
	register_setting( 'ni-settings-group', 'ni-site-news-text-2' );
	register_setting( 'ni-settings-group', 'ni-site-news-img-2' );

	register_setting( 'ni-settings-group', 'ni-site-url-3' );
	register_setting( 'ni-settings-group', 'ni-site-title-3' );
	register_setting( 'ni-settings-group', 'ni-site-pagination-3' );
	register_setting( 'ni-settings-group', 'ni-site-news-title-3' );
	register_setting( 'ni-settings-group', 'ni-site-news-text-3' );
	register_setting( 'ni-settings-group', 'ni-site-news-img-3' );

	register_setting( 'ni-settings-group', 'ni-site-url-4' );
	register_setting( 'ni-settings-group', 'ni-site-title-4' );
	register_setting( 'ni-settings-group', 'ni-site-pagination-4' );
	register_setting( 'ni-settings-group', 'ni-site-news-title-4' );
	register_setting( 'ni-settings-group', 'ni-site-news-text-4' );
	register_setting( 'ni-settings-group', 'ni-site-news-img-4' );

}

function ni_settings_page() {
?>
<div class="wrap">
  <h2>News Importer Settings</h2>
  <form method="post" action="options.php">
      <span>Статус: <?= get_option('ni-status');?></span>
      <?php settings_fields( 'ni-settings-group' ); ?>
      <table class="form-table">
         <thead>
            <th>Website</th>
            <th>Link tag to news</th>
            <th>Tag to pagination</th>
            <th>News title tag</th>
            <th>News content tag</th>
         </thead>
         <tr>
            <td>
               <input type="text" name="ni-site-url-1" value="<?php echo get_option('ni-site-url-1'); ?>" />
            </td>
            <td>
              <input type="text" name="ni-site-title-1" value="<?php echo get_option('ni-site-title-1'); ?>" />
            </td>
            <td>
              <input type="text" name="ni-site-pagination-1" value="<?php echo get_option('ni-site-pagination-1'); ?>" />
            </td>
            <td>
              <input type="text" name="ni-site-news-title-1" value="<?php echo get_option('ni-site-news-title-1'); ?>" />
            </td>
            <td>
              <input type="text" name="ni-site-news-text-1" value="<?php echo get_option('ni-site-news-text-1'); ?>" />
            </td>
         </tr>
         <tr >
            <td>
              <input type="text" name="ni-site-url-2" value="<?php echo get_option('ni-site-url-2'); ?>" />
            </td>
            <td>
              <input type="text" name="ni-site-title-2" value="<?php echo get_option('ni-site-title-2'); ?>" />
            </td>
            <td>
              <input type="text" name="ni-site-pagination-2" value="<?php echo get_option('ni-site-pagination-2'); ?>" />
            </td>
            <td>
              <input type="text" name="ni-site-news-title-2" value="<?php echo get_option('ni-site-news-title-2'); ?>" />
            </td>
            <td>
              <input type="text" name="ni-site-news-text-2" value="<?php echo get_option('ni-site-news-text-2'); ?>" />
            </td>
         </tr>
         <tr >
            <td>
              <input type="text" name="ni-site-url-3" value="<?php echo get_option('ni-site-url-3'); ?>" />
            </td>
            <td>
              <input type="text" name="ni-site-title-3" value="<?php echo get_option('ni-site-title-3'); ?>" />
            </td>
            <td>
              <input type="text" name="ni-site-pagination-3" value="<?php echo get_option('ni-site-pagination-3'); ?>" />
            </td>
            <td>
              <input type="text" name="ni-site-news-title-3" value="<?php echo get_option('ni-site-news-title-3'); ?>" />
            </td>
            <td>
              <input type="text" name="ni-site-news-text-3" value="<?php echo get_option('ni-site-news-text-3'); ?>" />
            </td>
         </tr>
         <tr >
            <td>
              <input type="text" name="ni-site-url-4" value="<?php echo get_option('ni-site-url-4'); ?>" />
            </td>
            <td>
              <input type="text" name="ni-site-title-4" value="<?php echo get_option('ni-site-title-4'); ?>" />
            </td>
            <td>
              <input type="text" name="ni-site-pagination-4" value="<?php echo get_option('ni-site-pagination-4'); ?>" />
            </td>
            <td>
              <input type="text" name="ni-site-news-title-4" value="<?php echo get_option('ni-site-news-title-4'); ?>" />
            </td>
            <td>
              <input type="text" name="ni-site-news-text-4" value="<?php echo get_option('ni-site-news-text-4'); ?>" />
            </td>
         </tr>
      </table>

      <p class="submit">
        <input type="submit" class="button-primary" value="<?php _e('Save Changes') ?>" />
      </p>
  </form>
</div>
<?php } ?>

