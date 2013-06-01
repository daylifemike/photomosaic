(function ($) {
    $(window).on('load', function () {
        var gallery_option_template_template = '' +
            '<label class="setting">' +
                '<span>Template</span>' +
                '<select class="template" data-setting="template">' +
                    '<option value="default" selected>Default</option>' +
                    '<option value="photomosaic">PhotoMosaic</option>' +
                '</select>' +
            '</label>';

        $('#tmpl-gallery-settings').append(gallery_option_template_template);

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