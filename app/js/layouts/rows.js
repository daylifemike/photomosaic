(function ($) {
    PhotoMosaic.Layouts.rows = function (mosaic) {
        this.node = mosaic.obj;
        this.opts = mosaic.opts;
        this._options = mosaic._options;
        this._options.gallery = mosaic.opts.gallery.slice(); // we want to be able to refer to the original gallery order
        this.images = mosaic.opts.gallery;
        this.imagesById = PhotoMosaic.Utils.arrayToObj( this.images, 'id' );
        this.isRefreshing = false;
        return this;
    };
    PhotoMosaic.Layouts.rows.prototype = {
        getData : function () {},

        refresh : function () {},

        update : function () {},
    };
}(window.JQPM));