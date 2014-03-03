(function ($) {
    PhotoMosaic.Layouts.grid = function (images, opts) {
        this.images = images;
        this.opts = opts;
        return this.init();
    };
    PhotoMosaic.Layouts.grid.prototype = {
        init : function () {
            // set .adjusted
            $.each(this.images, function (i) {
                this.width.adjusted = this.width.constraint = 100;
                this.height.adjusted = this.height.constraint = 100;
            });
            // construct template object
            var json = {
                // id: this._id,
                // clazz: this.makeSpecialClasses(),
                width: this.opts.width,
                center: this.opts.center
            };
            var col_height = 0;
            // create position information for each image
            for (var i = 0; i < this.images.length; i++) {
                this.images[i].position = {
                    top : col_height,
                    left : 0
                };

                col_height = col_height + this.images[i].height.constraint + this.opts.padding;
            };
            json.images = this.images;
            json.height = col_height;
            json.width = 100;

            return json;
        }
    };
}(window.JQPM));