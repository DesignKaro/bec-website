<?php
/**
 * Plugin Name: BEC Site Manager (Headless CMS for The Black Lantern Clinic)
 * Description: Custom Headless CMS backend plugin for managing all content, images, team members, services, and text for The Black Lantern Clinic React website.
 * Version: 1.1.0
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
        
        // CORS Headers for REST API
        add_action('rest_api_init', function() {
            remove_filter('rest_pre_serve_json', 'rest_send_cors_headers');
            add_filter('rest_pre_serve_json', function($value) {
                header('Access-Control-Allow-Origin: *');
                header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
                header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Wpnonce');
                return $value;
            });
        }, 15);
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
            // Contact & General
            'bec_phone', 'bec_email', 'bec_hours', 'bec_sat_hours', 'bec_location_text', 'bec_crisis_text',
            'bec_instagram_url', 'bec_booking_btn_text', 'bec_booking_url',
            // Heroes
            'bec_home_hero_title', 'bec_home_hero_subtitle', 'bec_home_hero_bg', 'bec_home_hero_emblem',
            'bec_subpage_hero_bg', 'bec_footer_bg',
            // CTA Banner
            'bec_cta_title', 'bec_cta_body', 'bec_cta_btn_text',
            // About Page
            'bec_about_hero_title', 'bec_about_story_title', 'bec_about_story_p1', 'bec_about_story_p2', 'bec_about_story_img',
            // Services Page
            'bec_services_hero_title', 'bec_services_intro',
            // Team Page
            'bec_team_hero_title', 'bec_team_intro',
            // Contact Page
            'bec_contact_hero_title', 'bec_contact_subtitle', 'bec_contact_channels',
            // Footer
            'bec_footer_brand_desc', 'bec_footer_credit',
            // SEO & Meta
            'bec_home_seo_title', 'bec_home_seo_desc',
            'bec_about_seo_title', 'bec_about_seo_desc',
            'bec_services_seo_title', 'bec_services_seo_desc',
            'bec_team_seo_title', 'bec_team_seo_desc',
            'bec_contact_seo_title', 'bec_contact_seo_desc',
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
            <h1>The Black Lantern Clinic - Full Site Manager</h1>
            <p>Manage all text, contact numbers, background images, banners, and SEO settings for the React website.</p>
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
                        <th scope="row">Opening Hours (Weekdays)</th>
                        <td><input type="text" name="bec_hours" value="<?php echo esc_attr(get_option('bec_hours', 'Mon – Fri: 9am – 5pm')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row">Saturday Hours</th>
                        <td><input type="text" name="bec_sat_hours" value="<?php echo esc_attr(get_option('bec_sat_hours', 'Sat: By appointment only')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row">Location / City Tagline</th>
                        <td><input type="text" name="bec_location_text" value="<?php echo esc_attr(get_option('bec_location_text', 'Youth Mental Health · Brisbane, Queensland')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row">Instagram URL</th>
                        <td><input type="text" name="bec_instagram_url" value="<?php echo esc_attr(get_option('bec_instagram_url', 'https://instagram.com')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row">Booking Link Text</th>
                        <td><input type="text" name="bec_booking_btn_text" value="<?php echo esc_attr(get_option('bec_booking_btn_text', 'Book an appointment')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row">Booking Link URL</th>
                        <td><input type="text" name="bec_booking_url" value="<?php echo esc_attr(get_option('bec_booking_url', '/contact')); ?>" class="regular-text" /></td>
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

                <h2>3. Call To Action (CTA) Banner</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row">CTA Headline</th>
                        <td><input type="text" name="bec_cta_title" value="<?php echo esc_attr(get_option('bec_cta_title', 'Ready to take the first step?')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row">CTA Body Text</th>
                        <td><textarea name="bec_cta_body" rows="3" class="large-text"><?php echo esc_textarea(get_option('bec_cta_body', 'We know reaching out can feel like a big step. Our team is here to answer your questions and help you work out if we\'re the right fit — no pressure, no obligation.')); ?></textarea></td>
                    </tr>
                    <tr>
                        <th scope="row">CTA Button Text</th>
                        <td><input type="text" name="bec_cta_btn_text" value="<?php echo esc_attr(get_option('bec_cta_btn_text', 'Get in Touch')); ?>" class="regular-text" /></td>
                    </tr>
                </table>

                <h2>4. About Page Details</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row">About Hero Title</th>
                        <td><input type="text" name="bec_about_hero_title" value="<?php echo esc_attr(get_option('bec_about_hero_title', 'Who we are')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row">Story Heading</th>
                        <td><input type="text" name="bec_about_story_title" value="<?php echo esc_attr(get_option('bec_about_story_title', '"A steady light, when the path feels uncertain."')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row">Story Image URL</th>
                        <td><input type="text" name="bec_about_story_img" value="<?php echo esc_attr(get_option('bec_about_story_img', '/about_story.webp')); ?>" class="regular-text" /></td>
                    </tr>
                </table>

                <h2>5. Footer Brand Details</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row">Footer Brand Description</th>
                        <td><textarea name="bec_footer_brand_desc" rows="2" class="large-text"><?php echo esc_textarea(get_option('bec_footer_brand_desc', 'Specialist psychiatric and mental health care for young people aged 12 to 25.')); ?></textarea></td>
                    </tr>
                </table>

                <h2>6. SEO & Meta Titles</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row">Homepage SEO Title</th>
                        <td><input type="text" name="bec_home_seo_title" value="<?php echo esc_attr(get_option('bec_home_seo_title', 'The Black Lantern Clinic | Specialist Youth Psychiatry & Therapy Brisbane')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row">Homepage SEO Description</th>
                        <td><textarea name="bec_home_seo_desc" rows="2" class="large-text"><?php echo esc_textarea(get_option('bec_home_seo_desc', 'Specialist youth mental health clinic in Brisbane for ages 12–25. Grounded, person-centred psychiatric assessment & evidence-based therapy.')); ?></textarea></td>
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
                'sat_hours' => get_option('bec_sat_hours', 'Sat: By appointment only'),
                'location_text' => get_option('bec_location_text', 'Youth Mental Health · Brisbane, Queensland'),
                'instagram_url' => get_option('bec_instagram_url', 'https://instagram.com'),
                'booking_btn_text' => get_option('bec_booking_btn_text', 'Book an appointment'),
                'booking_url' => get_option('bec_booking_url', '/contact'),
                'crisis_text' => get_option('bec_crisis_text', 'The Black Lantern Clinic is not a crisis clinic, if you are experiencing a mental health crisis or emergency please contact 000 or lifeline 13 11 14 or 24/7 MH Call 1300 642 255'),
            ),
            'heroes' => array(
                'home_title' => get_option('bec_home_hero_title', 'Light for the Path ahead'),
                'home_subtitle' => get_option('bec_home_hero_subtitle', 'The Black Lantern Clinic is a private specialist youth mental health clinic in Brisbane, Queensland. We see young people aged 12 to 25 — and where it helps, their families and carers too.'),
                'home_bg' => get_option('bec_home_hero_bg', '/hero-bg.webp'),
                'subpage_bg' => get_option('bec_subpage_hero_bg', '/page-hero-bg.webp'),
                'footer_bg' => get_option('bec_footer_bg', '/footer-bg.webp'),
            ),
            'cta' => array(
                'title' => get_option('bec_cta_title', 'Ready to take the first step?'),
                'body' => get_option('bec_cta_body', 'We know reaching out can feel like a big step. Our team is here to answer your questions and help you work out if we\'re the right fit — no pressure, no obligation.'),
                'btn_text' => get_option('bec_cta_btn_text', 'Get in Touch'),
            ),
            'about' => array(
                'hero_title' => get_option('bec_about_hero_title', 'Who we are'),
                'story_title' => get_option('bec_about_story_title', '"A steady light, when the path feels uncertain."'),
                'story_img' => get_option('bec_about_story_img', '/about_story.webp'),
            ),
            'footer' => array(
                'brand_desc' => get_option('bec_footer_brand_desc', 'Specialist psychiatric and mental health care for young people aged 12 to 25.'),
                'credit' => get_option('bec_footer_credit', 'Youth Mental Health · Brisbane, Queensland'),
            ),
            'seo' => array(
                'home_title' => get_option('bec_home_seo_title', 'The Black Lantern Clinic | Specialist Youth Psychiatry & Therapy Brisbane'),
                'home_desc' => get_option('bec_home_seo_desc', 'Specialist youth mental health clinic in Brisbane for ages 12–25. Grounded, person-centred psychiatric assessment & evidence-based therapy.'),
            ),
            'services' => $services,
            'team' => $team,
        ));
    }
}

new BEC_Site_Manager();
