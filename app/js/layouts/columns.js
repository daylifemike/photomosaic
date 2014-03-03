(function ($) {
    PhotoMosaic.Layouts.columns = function (images, opts) {
        this.images = images;
        this.opts = opts;
        this.constructView();
    };

    PhotoMosaic.Layouts.columns.prototype = {
        constructView : function () {
            var images = this.images;
            var mosaic_height = 0;

            this.columns = columns = this.makeColumns();
            this.column_width = column_width = this.getColumnWidth();

            images = this.scaleToWidth( images, column_width );

            // ERROR CHECK: remove any images that didn't 404 but failed to load
            // TODO : can this be made generic and moved out of the Layout?
                images = this.removeBadImages( images );

                if (images.length === 0) {
                    return PhotoMosaic.Plugins.Mustache.to_html('', {});
                }
            // -----

            columns = this.dealIntoColumns( images, columns );

            mosaic_height = this.getMosaicHeight( columns );

            // adjust columns to mosaic.height
            // adjust images to image.container
            // collect image.position information
            // adjust DOM order (for lightboxes)
            // ~~ set image size

            return {
                width: (column_width * columns.length) + (this.opts.padding * (columns.length - 1)),
            };
        },

        makeColumns : function () {
            var columns = [];
            var num_cols = 0;
            var max_width = 0;
            var num_images = 0
            var maths = {};
            var i = 0;

            if (this.opts.columns && this.opts.columns !== 'auto') {
                num_cols = this.opts.columns;
            } else {
                // TODO : make this less lame
                max_width = this.opts.width;
                num_images = this.opts.gallery.length;
                maths = {
                    plus : 425, // (300 + (150 / 1.2))
                    minus : 175 // (300 - (150 / 1.2))
                };

                num_cols = (max_width < maths.plus) ? 1 : Math.floor(max_width / maths.minus);

                if (num_images < num_cols) {
                    num_cols = num_images;
                }
            }

            for (i = 0; i < num_cols; i++) {
                columns.push( [] );
            };

            return columns;
        },

        getColumnWidth : function () {
            var num_cols = this.columns.length;
            var total_padding = this.opts.padding * (num_cols - 1);
            var usable_width = this.opts.width - total_padding;
            var col_width = Math.floor(usable_width / num_cols);
            return col_width;
        },

        scaleToWidth : function (images, width) {
            $.each(
                images,
                function () {
                    var item = this;
                    item.width.container = width;
                    item.height.container = Math.floor((item.height.original * width) / item.width.original);
                }
            );

            return images;
        },

        removeBadImages : function (images) {
            var to_delete = [];

            $.each(images, function (i) {
                if (isNaN(this.height.container)) {
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

        dealIntoColumns : function (images, columns) {
            switch ( this.opts.order ) {
                case 'random' :
                    columns = this.sortRandomly( images, columns );
                    break;

                case 'masonry' :
                    columns = this.sortIntoMasonry( images, columns );
                    break;

                case 'columns' :
                    columns = this.sortIntoColumns( images, columns );
                    break;

                case 'rows' :
                default :
                    columns = this.sortIntoRows( images, columns );
                    break;
            }

            return columns;
        },

        sortRandomly : function (images, columns) {
            // randomize and sort into rows
            images.sort(function (a, b) {
                return (0.5 - Math.random());
            });

            columns = this.sortIntoRows( images, columns );

            return columns;
        },

        sortIntoRows : function (images, columns) {
            var num_columns = columns.length;
            var num_images = images.length;
            var which = 0;
            var i = 0;

            for (i = 0; i < num_images; i++) {
                which = i % num_columns;
                columns[which].push(images[i]);
            }

            return columns;
        },

        sortIntoColumns : function (images, columns) {
            // columns --> rows => columns
            var images = $.extend(true, [], images); // deep copy because we .shift()
            var num_images = images.length;
            var i = 0;
            var j = 0;

            columns = this.sortIntoRows( images, columns );

            // Sorting into rows tells us how many images are in each column.
            // The specific image in each slot is wrong but the slot-division is good.
            // So we replace the image in each slot with the next one from the ordered list.
            for (i = 0; i < columns.length; i++) {
                for (j = 0; j < columns[i].length; j++) {
                    columns[i][j] = images[0];
                    images.shift();
                }
            }

            return columns;
        },

        sortIntoMasonry : function (images, columns) {
            var num_columns = columns.length;
            var num_images = images.length;
            var column_heights = [];
            var which = 0;
            var i = 0;

            for (i = 0; i < num_columns; i++) {
                column_heights[i] = 0;
            } 

            // always place the next image into the shortest column
            for (i = 0; i < num_images; i++) {
                which = $.inArray(
                            Math.min.apply( Math, column_heights ),
                            column_heights
                        );
                columns[which].push( images[i] );
                column_heights[which] = column_heights[which] + images[i].height.container;
            }

            return columns;
        },

        getMosaicHeight : function (columns) {
            if (this.opts.height && this.opts.height !== 'auto') {
                return this.opts.height;
            }

            var column_heights = [];
            var column_height = 0;
            var mean_column_height = 0;
            var i = 0;
            var j = 0;

            for (i = 0; i < columns.length; i++) {
                column_height = 0;

                for (j = 0; j < columns[i].length; j++) {
                    column_height += columns[i][j].height.container;
                }

                column_height += (columns[i].length - 1) * this.opts.padding;
                column_heights.push( column_height );
            }

            // function median (values) {
            //     var half = Math.floor( values.length / 2 );
            //     values.sort( function (a,b) {
            //         return a - b;
            //     } );
            //     if (values.length % 2) {
            //         return values[half];
            //     } else {
            //         return Math.ceil( (values[half-1] + values[half]) / 2 );
            //     }
            // }

            function mean (values) {
                var sum = 0;
                var i = 0;

                for (i = 0; i < values.length; i++) {
                    sum += values[i];
                };

                return Math.ceil( sum / values.length );
            }

            mean_column_height = mean( column_heights );

            return mean_column_height;
        },

        errorChecks : {
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
        }
    };
}(window.JQPM));