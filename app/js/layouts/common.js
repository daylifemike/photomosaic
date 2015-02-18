(function ($) {
    PhotoMosaic.Layouts.Common = {
        makeColumnBuckets : function (opts) {
            var columns = [];
            var num_cols = 0;
            var max_width = 0;
            var num_images = 0
            var maths = {};
            var i = 0;

            if (opts.columns && opts.columns !== 'auto') {
                num_images = opts.gallery.length;
                num_cols = (num_images < opts.columns) ? num_images : opts.columns;
            } else {
                // TODO : make this less lame
                max_width = opts.width;
                num_images = opts.gallery.length;
                maths = {
                    plus : 425, // (300 + (150 / 1.2))
                    minus : 175 // (300 - (150 / 1.2))
                };

                num_cols = (max_width < maths.plus) ? 1 : Math.floor(max_width / maths.minus);

                if (num_images < num_cols) {
                    num_cols = num_images;
                }

                if ((opts.max_columns !== 'auto') && (num_cols > opts.max_columns)) {
                    num_cols = opts.max_columns;
                }

                if ((opts.min_columns !== 'auto') && (num_cols < opts.min_columns)) {
                    num_cols = opts.min_columns;
                }
            }

            for (i = 0; i < num_cols; i++) {
                columns.push( [] );
            };

            return columns;
        },

        getColumnWidth : function (columns, opts) {
            var num_cols = columns.length;
            var total_padding = opts.padding * (num_cols - 1); // we only pad between columns
            var usable_width = opts.width - total_padding;
            var col_width = Math.floor(usable_width / num_cols);
            return col_width;
        },

        getColumnHeights : function (imagesById, columns, opts) {
            var column_heights = [];
            var column_height = 0;
            var image = null;

            for (var i = 0; i < columns.length; i++) {
                column_height = 0;

                for (var j = 0; j < columns[i].length; j++) {
                    image = imagesById[ columns[i][j] ];
                    column_height += image.height.container;
                }

                column_height += (columns[i].length - 1) * opts.padding;
                column_heights.push( column_height );
            }

            return column_heights;
        },

        dealIntoColumns : function (images, columns, opts, isRefreshing) {
            switch ( opts.order ) {
                case 'random' :
                    columns = this.sortRandomly( images, columns, isRefreshing );
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

        sortRandomly : function (images, columns, isRefreshing) {
            // randomize and sort into rows
            // don't re-randomize if we're refreshing
            if (!isRefreshing) {
                images = this.randomizeImages( images );
            }

            columns = this.sortIntoRows( images, columns );

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
                columns[which].push( images[i].id );
                column_heights[which] = column_heights[which] + images[i].height.container;
            }

            return columns;
        },

        sortIntoRows : function (images, columns) {
            var num_columns = columns.length;
            var num_images = images.length;
            var which = 0;
            var i = 0;

            for (i = 0; i < num_images; i++) {
                which = i % num_columns;
                columns[which].push(images[i].id);
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
                    columns[i][j] = images[0].id;
                    images.shift();
                }
            }

            return columns;
        },

        randomizeImages : function (images) {
            return images.sort(function (a, b) {
                return (0.5 - Math.random());
            });
        },

        positionImagesInContainer : function (images, prevent_crop) {
            var image = null;

            for (var i = 0; i < images.length; i++) {
                image = images[i];

                image.adjustments = {};

                if (!prevent_crop) {
                    // adjusted is still scaled to the column's width
                    if (image.height.adjusted > image.height.container) {
                        image.adjustments.top = Math.floor((image.height.adjusted - image.height.container) / 2);
                    } else {
                        image.width.adjusted = Math.floor((image.width.adjusted * image.height.container) / image.height.adjusted);
                        image.height.adjusted = image.height.container;

                        image.adjustments.left = Math.floor((image.width.adjusted - image.width.container) / 2);
                    }
                }

                image.adjustments = PhotoMosaic.Layouts.Common.normalizeAdjustments( image.adjustments );

                images[i] = image;
            };

            return images;
        },

        positionImagesInMosaic : function (imagesById, columns, column_width, opts) {
            var col_height = 0;
            var image = null;

            for (var i = 0; i < columns.length; i++) {
                col_height = 0;

                for (var j = 0; j < columns[i].length; j++) {
                    image = imagesById[ columns[i][j] ];

                    image.position = {
                        top : col_height,
                        left : (i * column_width) + (i * opts.padding)
                    };

                    col_height = col_height + image.height.container + opts.padding;
                };
            };
        },

        normalizeAdjustments : function (adjustments) {
            if (!adjustments.hasOwnProperty('top')) {
                adjustments.top = 0;
            }

            if (!adjustments.hasOwnProperty('left')) {
                adjustments.left = 0;
            }

            return adjustments;
        }
    };
}(window.JQPM));