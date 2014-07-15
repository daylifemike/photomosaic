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
    registerNamespace('PhotoMosaic.$', $sub || {});
    registerNamespace('PhotoMosaic.Utils');
    registerNamespace('PhotoMosaic.Inputs');
    registerNamespace('PhotoMosaic.Loader');
    registerNamespace('PhotoMosaic.Layouts');
    registerNamespace('PhotoMosaic.Plugins');
    registerNamespace('PhotoMosaic.ErrorChecks');
    registerNamespace('PhotoMosaic.Mosaics', []);
    registerNamespace('PhotoMosaic.version', '2.8.1');

}(jQuery, window));