(function ($) {
    $(window).on('load', function () {
        var l10n = {
            theme : (PhotoMosaic.l10n && PhotoMosaic.l10n.theme) ? PhotoMosaic.l10n.theme : 'Theme'
        };
        var templates = {
            gallery_select_option : '<option value="photomosaic">PhotoMosaic</option>',
            gallery_select : '' +
            '<label class="setting">' +
                '<span>' + l10n.theme + '</span>' +
                '<select class="theme" data-setting="theme">' +
                    '<option value="default" selected>Default</option>' +
                    '<option value="photomosaic">PhotoMosaic</option>' +
                '</select>' +
            '</label>'
        };
        var $gallery_settings = $('#tmpl-gallery-settings');
        var hasTheme = $gallery_settings.find('select.theme').length > 0;

        if (hasTheme) {
            // SELECT.theme is already in the form -- just add the OPTION
            $gallery_settings.find('select.theme').append(templates.gallery_select_option);
        } else {
            $gallery_settings.append(templates.gallery_select);
        }

        /*
            Providing an interface to allow the user to set/override PM globals would require a couple of things:
             - a model of each param
             - an object containing the current global configuration ($.extend(defaults, custom))
             - a way to prevent poluting the default [gallery] shortcode
                 -> when 'photomosaic' isn't selected all of it's attrs need to be removed from the shortcode
                 -> 'default' and 'pm' share attrs (eg: 'columns')

            You could probably tap into the global wp.media Backbone stuff and just makes this a Backbone/Underscore app.
        */
    });
}(JQPM));