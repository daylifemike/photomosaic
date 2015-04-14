(function (jQuery, window) {

    function registerNamespace(ns, raw) {
        var nsParts = ns.split('.');
        var root = window;
        for (var i = 0; i < nsParts.length; i++) {
            if (typeof root[nsParts[i]] == 'undefined') {
                root[nsParts[i]] = (raw) ? raw : {};
            }
            root = root[nsParts[i]];
        }
    }

    // verbatim from jQuery Migrate 1.2.1
    jQuery.sub = function() {
        function jQuerySub( selector, context ) {
            return new jQuerySub.fn.init( selector, context );
        }
        jQuery.extend( true, jQuerySub, this );
        jQuerySub.superclass = this;
        jQuerySub.fn = jQuerySub.prototype = this();
        jQuerySub.fn.constructor = jQuerySub;
        jQuerySub.sub = this.sub;
        jQuerySub.fn.init = function init( selector, context ) {
            if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
                context = jQuerySub( context );
            }

            return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
        };
        jQuerySub.fn.init.prototype = jQuerySub.fn;
        var rootjQuerySub = jQuerySub(document);
        return jQuerySub;
    };

    var $sub = jQuery.sub();

    registerNamespace('JQPM', $sub || {});
    registerNamespace('PhotoMosaic');
    registerNamespace('PhotoMosaic.$', $sub || {});
    registerNamespace('PhotoMosaic.version', '2.11');
    registerNamespace('PhotoMosaic.Utils');
    registerNamespace('PhotoMosaic.Inputs');
    registerNamespace('PhotoMosaic.Loader');
    registerNamespace('PhotoMosaic.Layouts');
    registerNamespace('PhotoMosaic.Plugins');
    registerNamespace('PhotoMosaic.ErrorChecks');
    registerNamespace('PhotoMosaic.Mosaics', []);
    registerNamespace('PhotoMosaic.WP', {});
    registerNamespace('PhotoMosaic.LightboxBridge', {});
    registerNamespace('PhotoMosaic.each', function (callback) {
        PhotoMosaic.$.each( PhotoMosaic.Mosaics, function (i, mosaic) {
            // this = the raw target element
            // arg[0] = the JQPM instance
            // arg[1] = $( this )
            // arg[2] = direct access to $(this).photoMosaic() w/o all the typing
            // arg[3] = index of mosaic in list of mosaics
            callback.apply(mosaic.el, [
                PhotoMosaic.$,
                mosaic.$el,
                function (args) {
                    mosaic.$el.photoMosaic.apply(mosaic.$el, [args]);
                },
                i
            ]);
        });
    });
}(jQuery, window));