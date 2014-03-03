PhotoMosaic.ErrorChecks = (function($){
    return {
        initial: function (opts) {
            if (opts.input === 'xml') {
                if (typeof opts.gallery !== 'string' || opts.gallery === '') {
                    PhotoMosaic.Utils.log.error("No XML file path specified.");
                    return true;
                }
            }

            if (opts.input === 'json') {
                if (typeof opts.gallery === 'string') {
                    if (opts.gallery === '') {
                        PhotoMosaic.Utils.log.error("No JSON object defined.");
                        return true;
                    }

                    if (typeof window[opts.gallery] !== 'undefined') {
                        opts.gallery = window[opts.gallery];
                    } else {
                        PhotoMosaic.Utils.log.error("No JSON object found when referencing '" + opts.gallery + "'.");
                        PhotoMosaic.Utils.log.info("Make sure your variable is avaible to the global scope (window['" + opts.gallery + "']) or simply pass the object literal (gallery:" + opts.gallery + ") instead of a string (gallery:\"" + opts.gallery + "\").");
                        return true;
                    }
                }

                if (opts.gallery.length === 0) {
                    PhotoMosaic.Utils.log.error("Specified gallery data is empty.");
                    return true;
                }
            }

            if (opts.prevent_crop && opts.height !== 'auto') {
                PhotoMosaic.Utils.log.info("Height must be set to 'auto' to Prevent Cropping. The value for height (" + opts.height + ") is being ignored so as to prevent cropping.");
                opts.height = "auto";
            }
            return false;
        },
// these got moved into layouts/columns.js
        imageDimensions: function (images) {
            var to_delete = [];

            $.each(images, function (i) {
                if (isNaN(this.height.adjusted)) {
                    to_delete.push(i);
                }
            });

            for (var i = to_delete.length - 1; i >= 0; i--) {
                PhotoMosaic.Utils.log.error("The following image failed to load and was skipped.\n" + images[to_delete[i]].src);
                var rest = images.slice( to_delete[i] + 1 );
                images.length = to_delete[i];
                images.push.apply(images, rest);
            }

            return images;
        },

        layout: function (json) {
            var i = 0;
            var j = 0;

            for (i = 0; i < json.columns.length; i++) {
                for (j = 0; j < json.columns[i].images.length; j++) {
                    if (json.columns[i].images[j].height.constraint <= 0) {
                        PhotoMosaic.Utils.log.error("Your gallery's height is too small for your current settings and won't render correctly.");
                        return true;
                    }
                };
            };

            return false;    
        }
    };
}(JQPM));