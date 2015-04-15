
(function ($) {
    $(window).on('load', function () {
        var $settings = $('#tmpl-gallery-settings');
        var template_option = '<option value="photomosaic">PhotoMosaic</option>';
        var template_select = '' +
            '<label class="setting">' +
                '<span>Theme</span>' +
                '<select class="theme" data-setting="theme">' +
                    '<option value="default" selected>Default</option>' +
                    template_option +
                '</select>' +
            '</label>';
        // convert the template string into HTML so it can be traversed
        var $fragment = $('<div></div>').html( $settings.text() );
        var hasTheme = $fragment.find('select.theme').length > 0;
        var html = $settings.html();

        if (hasTheme) {
            var i1 = html.lastIndexOf('data-setting="theme"');
            var i2 = html.substring( i1 ).indexOf('</select>');
            var before = html.substring( 0, (i1 + i2) );
            var after = html.substring( (i1 + i2) );
            $settings.html( before + template_option + after );
        } else {
            $settings.html( html + template_select );
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
}(jQuery));