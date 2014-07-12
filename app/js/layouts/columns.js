(function ($) {
    'use strict';

    PhotoMosaic.Layouts.columns = function (mosaic) {
        this.node = mosaic.obj;
        this.opts = mosaic.opts;
        this._options = mosaic._options;
        this._options.gallery = mosaic.opts.gallery.slice(); // we want to be able to refer to the original gallery order
        this.images = mosaic.opts.gallery;
        this.imagesById = PhotoMosaic.Utils.arrayToObj( this.images, 'id' );
        this.isRefreshing = false;
        return this;
    };

    PhotoMosaic.Layouts.columns.prototype = {
        getData : function () {
            var images = this.images;
            var columns = null;
            var column_width = null;
            var mosaic_height = 0;
            var position_data = null;

            if (this._options.width === 'auto' || this._options.width == 0) {
                this.opts.width = this.node.width();
            }

            // determine the number of columns
            this.columns = columns = this.makeColumnBuckets();

            // determine the column width (all columns have the same width)
            this.column_width = column_width = this.getColumnWidth();

            // scale each image to the column width
            images = this.scaleToWidth( images, column_width );

            // sort the images (based on opts.order) and assign them to columns
            columns = this.dealIntoColumns( images, columns );

            // determine the target height for the entire mosaic
            mosaic_height = this.getMosaicHeight( columns );

            //-- ??? mark last column -- is this still necessary?

            // adjust the images in each column to the new height (for a flat bottom edge)
            columns = this.adjustColumnsToHeight( columns, mosaic_height );

            // do everything possible to make sure we show SOMETHING
            if ( this.errorChecks.aspectRatio(images) ) {
                columns = this.balanceColumnsToHeight( columns, mosaic_height );
            }

            // bail if the user's settings craete a super-broken mosaic
            if ( this.errorChecks.height(images) ) {
                return false;
            }

            // create crop position info
            images = this.positionImagesInContainer( images );

            // convert all this knowledge into position data
            this.positionImagesInMosaic( columns );

            images = PhotoMosaic.Utils.pickImageSize( images, this.opts.sizes );

            this.isRefreshing = false;

            return {
                width : (column_width * columns.length) + (this.opts.padding * (columns.length - 1)),
                height : mosaic_height,
                images : this.images
            };
        },

        makeColumnBuckets : function () {
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
            var total_padding = this.opts.padding * (num_cols - 1); // we only pad between columns
            var usable_width = this.opts.width - total_padding;
            var col_width = Math.floor(usable_width / num_cols);
            return col_width;
        },

        scaleToWidth : function (images, width) {
            for (var i = 0; i < images.length; i++) {
                images[i].width.container = images[i].width.adjusted = width;
                images[i].height.container = images[i].height.adjusted = Math.floor((images[i].height.original * width) / images[i].width.original);
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
            // don't re-randomize if we're refreshing
            if (!this.isRefreshing) {
                images = this.randomizeImages( images );
            }

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

        getMosaicHeight : function (columns) {
            if (this.opts.height && this.opts.height !== 'auto') {
                return this.opts.height;
            }

            var column_heights = [];
            var column_height = 0;
            var image = null;

            for (var i = 0; i < columns.length; i++) {
                column_height = 0;

                for (var j = 0; j < columns[i].length; j++) {
                    image = this.imagesById[ columns[i][j] ];
                    column_height += image.height.container;
                }

                column_height += (columns[i].length - 1) * this.opts.padding;
                column_heights.push( column_height );
            }

            if (this.opts.prevent_crop) {
                return Math.max.apply( Math, column_heights );
            }

            /*
                function median (values) {
                    var half = Math.floor( values.length / 2 );
                    values.sort( function (a,b) {
                        return a - b;
                    } );
                    if (values.length % 2) {
                        return values[half];
                    } else {
                        return Math.ceil( (values[half-1] + values[half]) / 2 );
                    }
                }
            */

            function mean (values) {
                var sum = 0;
                var i = 0;

                for (i = 0; i < values.length; i++) {
                    sum += values[i];
                };

                return Math.ceil( sum / values.length );
            }

            return mean( column_heights );
        },

        adjustColumnsToHeight : function (columns, target_height) {
            if (this.opts.prevent_crop) {
                return columns;
            }
            for (var i = 0; i < columns.length; i++) {
                columns[i] = this.adjustColumnToHeight( columns[i], target_height );
            }
            return columns;
        },

        adjustColumnToHeight: function (ids, target_height) {
            var column_height = 0;
            var i = 0;

            // get the height of each column
            for (i = 0; i < ids.length; i++) {
                column_height += this.imagesById[ ids[i] ].height.container;
            }

            column_height += (ids.length - 1) * this.opts.padding;

            // ??? mark last image in column

            // how much do we need to grow or shrink the column
            var diff = target_height - column_height // (plus = grow, minus = shrink)
            var direction = (diff > 0) ? 'grow' : 'shrink';
            diff = Math.abs(diff);

            // spread the diff between the image
            i = 0;
            while (diff > 0) {
                i = (i >= ids.length) ? 0 : i;
                if (direction === 'grow') {
                    this.imagesById[ ids[i] ].height.container++;
                } else {
                    this.imagesById[ ids[i] ].height.container--;
                }
                i++;
                diff--;
            }

            return ids;
        },

        balanceColumnsToHeight : function (columns, target_height) {
            if (this.opts.prevent_crop) {
                return columns;
            }
            for (var i = 0; i < columns.length; i++) {
                columns[i] = this.balanceColumnToHeight( columns[i], target_height );
            }
            return columns;
        },

        balanceColumnToHeight : function (ids, target_height) {
            var column_height = target_height - ((ids.length - 1) * this.opts.padding);
            var divy = Math.floor(column_height / ids.length);
            var remainder = column_height % ids.length;

            for (var i = 0; i < ids.length; i++) {
                this.imagesById[ ids[i] ].height.container = divy;
            }

            for (var i = 0; i < remainder; i++) {
                this.imagesById[ ids[i] ].height.container++;
            }

            return ids;
        },

        positionImagesInContainer : function (images) {
            var image = null;

            for (var i = 0; i < images.length; i++) {
                image = images[i];

                if (this.opts.prevent_crop) {
                    image.adjustment = {
                        type : 'top',
                        value : 0
                    };
                } else {
                    // adjusted is still scaled to the column's width
                    if (image.height.adjusted > image.height.container) {
                        image.adjustment = {
                            type : 'top',
                            value : Math.floor((image.height.adjusted - image.height.container) / 2)
                        };
                    } else {
                        image.width.adjusted = Math.floor((image.width.adjusted * image.height.container) / image.height.adjusted);
                        image.height.adjusted = image.height.container;

                        image.adjustment = {
                            type : 'left',
                            value : Math.floor((image.width.adjusted - image.width.container) / 2)
                        };
                    }
                }

                images[i] = image;
            };

            return images;
        },

        positionImagesInMosaic : function (columns) {
            var col_height = 0;
            var image = null;

            for (var i = 0; i < columns.length; i++) {
                col_height = 0;

                for (var j = 0; j < columns[i].length; j++) {
                    image = this.imagesById[ columns[i][j] ];

                    image.position = {
                        top : col_height,
                        left : (i * this.column_width) + (i * this.opts.padding)
                    };

                    col_height = col_height + image.height.container + this.opts.padding;
                };
            };
        },

        randomizeImages : function (images) {
            return images.sort(function (a, b) {
                return (0.5 - Math.random());
            });
        },

        refresh : function () {
            this.isRefreshing = true;
            return this.getData();
        },

        update : function (props) {
            this.opts = $.extend({}, this.opts, props);

            // take care of any layout-specific change-logic
            if (props.order) {
                this.images = this._options.gallery.slice();

                if (props.order == 'random') {
                    this.images = this.randomizeImages( this.images );
                }
            }
        },

        errorChecks : {
            aspectRatio: function (images) {
                for (var i = 0; i < images.length; i++) {
                    if (images[i].height.container <= 10) { // 10 is pretty arbitrary
                        PhotoMosaic.Utils.log.error("Your gallery's height doesn't allow your images to proportioned based on their aspect ratios.");
                        return true;
                    }
                }
                return false;
            },
            height: function (images) {
                for (var i = 0; i < images.length; i++) {
                    if (images[i].height.container <= 0) {
                        PhotoMosaic.Utils.log.error("Your gallery has been hidden because its height is too small for your current settings and won't render correctly.");
                        return true;
                    }
                }
                return false;
            }
        }
    };
}(window.JQPM));