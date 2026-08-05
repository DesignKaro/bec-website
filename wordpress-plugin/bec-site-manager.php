<?php
/**
 * Plugin Name: BEC Site Manager (Headless CMS for The Black Lantern Clinic)
 * Description: Custom Headless CMS backend plugin for managing all content, images, team members, services, and text for The Black Lantern Clinic React website.
 * Version: 1.0.0
 * Author: DesignKaro
 * License: GPLv2 or later
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class BEC_Site_Manager {
    public function __construct() {
        add_action('init', array($this, 'register_custom_post_types'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    /**
     * Register Custom Post Types for Services and Team
     */
    public function register_custom_post_types() {
        // Services CPT
        register_post_type('bec_service', array(
            'labels' => array(
                'name' => __('Services', 'bec'),
                'singular_name' => __('Service', 'bec'),
                'add_new_item' => __('Add New Service', 'bec'),
                'edit_item' => __('Edit Service', 'bec'),
            ),
            'public' => true,
            'has_archive' => false,
            'show_in_rest' => true,
            'supports' => array('title', 'editor', 'thumbnail', 'page-attributes'),
            'menu_icon' => 'dashicons-welcome-learn-more',
        ));

        // Team CPT
        register_post_type('bec_team', array(
            'labels' => array(
                'name' => __('Team Members', 'bec'),
                'singular_name' => __('Team Member', 'bec'),
                'add_new_item' => __('Add New Team Member', 'bec'),
                'edit_item' => __('Edit Team Member', 'bec'),
            ),
            'public' => true,
            'has_archive' => false,
            'show_in_rest' => true,
            'supports' => array('title', 'excerpt', 'thumbnail', 'page-attributes'),
            'menu_icon' => 'dashicons-groups',
        ));
    }

    /**
     * Add WordPress Admin Options Menu
     */
    public function add_admin_menu() {
        add_menu_page(
            'BEC Site Content',
            'BEC Site Manager',
            'manage_options',
            'bec-site-settings',
            array($this, 'render_admin_page'),
            'dashicons-admin-generic',
            30
        );
    }

    /**
     * Register Settings & Fields
     */
    public function register_settings() {
        $settings = array(
            'bec_phone', 'bec_email', 'bec_hours', 'bec_crisis_text', 'bec_address',
            'bec_home_hero_title', 'bec_home_hero_subtitle', 'bec_home_hero_bg', 'bec_home_hero_emblem',
            'bec_subpage_hero_bg', 'bec_footer_bg'
        );

        foreach ($settings as $setting) {
            register_setting('bec_settings_group', $setting);
        }
    }

    /**
     * Render Admin Options Page
     */
    public function render_admin_page() {
        ?>
        <div class="wrap">
            <h1>The Black Lantern Clinic - Site Manager</h1>
            <p>Edit content, hero titles, background images, and contact details for the React website.</p>
            <form method="post" action="options.php">
                <?php settings_fields('bec_settings_group'); ?>
                <?php do_settings_sections('bec_settings_group'); ?>

                <h2>1. Contact & General Details</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row">Phone Number</th>
                        <td><input type="text" name="bec_phone" value="<?php echo esc_attr(get_option('bec_phone', '0418 542 638')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row">Admin Email</th>
                        <td><input type="email" name="bec_email" value="<?php echo esc_attr(get_option('bec_email', 'admin@theblacklanternclinic.com')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row">Opening Hours</th>
                        <td><input type="text" name="bec_hours" value="<?php echo esc_attr(get_option('bec_hours', 'Mon – Fri: 9am – 5pm')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row">Crisis Support Notice</th>
                        <td><textarea name="bec_crisis_text" rows="4" class="large-text"><?php echo esc_textarea(get_option('bec_crisis_text', 'The Black Lantern Clinic is not a crisis clinic, if you are experiencing a mental health crisis or emergency please contact 000 or lifeline 13 11 14 or 24/7 MH Call 1300 642 255')); ?></textarea></td>
                    </tr>
                </table>

                <h2>2. Hero Banners & Background Images</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row">Home Hero Headline</th>
                        <td><input type="text" name="bec_home_hero_title" value="<?php echo esc_attr(get_option('bec_home_hero_title', 'Light for the Path ahead')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row">Home Hero Subtitle</th>
                        <td><textarea name="bec_home_hero_subtitle" rows="3" class="large-text"><?php echo esc_textarea(get_option('bec_home_hero_subtitle', 'The Black Lantern Clinic is a private specialist youth mental health clinic in Brisbane, Queensland. We see young people aged 12 to 25 — and where it helps, their families and carers too.')); ?></textarea></td>
                    </tr>
                    <tr>
                        <th scope="row">Home Hero Background Image URL</th>
                        <td><input type="text" name="bec_home_hero_bg" value="<?php echo esc_attr(get_option('bec_home_hero_bg', '/hero-bg.webp')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row">Subpage Hero Background Image URL</th>
                        <td><input type="text" name="bec_subpage_hero_bg" value="<?php echo esc_attr(get_option('bec_subpage_hero_bg', '/page-hero-bg.webp')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row">Footer Background Image URL</th>
                        <td><input type="text" name="bec_footer_bg" value="<?php echo esc_attr(get_option('bec_footer_bg', '/footer-bg.webp')); ?>" class="regular-text" /></td>
                    </tr>
                </table>

                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }

    /**
     * Register REST API Route GET /wp-json/bec/v1/site-data
     */
    public function register_rest_routes() {
        register_rest_route('bec/v1', '/site-data', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_site_data'),
            'permission_callback' => '__return_true',
        ));
    }

    /**
     * REST API Callback
     */
    public function get_site_data() {
        // Fetch CPT Services
        $services_query = new WP_Query(array(
            'post_type' => 'bec_service',
            'posts_per_page' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ));
        $services = array();
        if ($services_query->have_posts()) {
            while ($services_query->have_posts()) {
                $services_query->the_post();
                $services[] = array(
                    'id' => get_the_ID(),
                    'title' => get_the_title(),
                    'content' => get_the_content(),
                    'image' => get_the_post_thumbnail_url(get_the_ID(), 'full') ?: '',
                );
            }
            wp_reset_postdata();
        }

        // Fetch CPT Team
        $team_query = new WP_Query(array(
            'post_type' => 'bec_team',
            'posts_per_page' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ));
        $team = array();
        if ($team_query->have_posts()) {
            while ($team_query->have_posts()) {
                $team_query->the_post();
                $team[] = array(
                    'id' => get_the_ID(),
                    'name' => get_the_title(),
                    'role' => get_the_excerpt(),
                    'photo' => get_the_post_thumbnail_url(get_the_ID(), 'full') ?: '',
                );
            }
            wp_reset_postdata();
        }

        return rest_ensure_response(array(
            'general' => array(
                'phone' => get_option('bec_phone', '0418 542 638'),
                'email' => get_option('bec_email', 'admin@theblacklanternclinic.com'),
                'hours' => get_option('bec_hours', 'Mon – Fri: 9am – 5pm'),
                'crisis_text' => get_option('bec_crisis_text', 'The Black Lantern Clinic is not a crisis clinic, if you are experiencing a mental health crisis or emergency please contact 000 or lifeline 13 11 14 or 24/7 MH Call 1300 642 255'),
            ),
            'heroes' => array(
                'home_title' => get_option('bec_home_hero_title', 'Light for the Path ahead'),
                'home_subtitle' => get_option('bec_home_hero_subtitle', 'The Black Lantern Clinic is a private specialist youth mental health clinic in Brisbane, Queensland. We see young people aged 12 to 25 — and where it helps, their families and carers too.'),
                'home_bg' => get_option('bec_home_hero_bg', '/hero-bg.webp'),
                'subpage_bg' => get_option('bec_subpage_hero_bg', '/page-hero-bg.webp'),
                'footer_bg' => get_option('bec_footer_bg', '/footer-bg.webp'),
            ),
            'services' => $services,
            'team' => $team,
        ));
    }
}

new BEC_Site_Manager();
